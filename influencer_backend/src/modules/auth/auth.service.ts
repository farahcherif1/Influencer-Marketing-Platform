import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { Response } from 'express-serve-static-core';

import { User } from '../../modules/user/entities/user.entity';
import { Creator } from '../../modules/creator/entities/creator.entity';
import { Brand } from '../brand/entities/brand.entity';
import { Token } from '../../modules/auth/entities/token.entity';
import { MailerService } from '../../modules/mailer/mailer.service';
import { UserRole } from '../../common/enums/user-role.enum';
import { SignupDto } from './dto/create-auth.dto';
import { GoogleUser } from '../../types/express';
import { Cart } from '../../modules/cart/entities/cart.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Creator)
    private readonly creatorRepository: Repository<Creator>,

    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,

    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,

    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async generateReferralCode(name: string): Promise<string> {
    const random = Math.floor(100 + Math.random() * 900);
    const normalized = name.replace(/\s+/g, '').toLowerCase();
    return `${normalized}${random}`;
  }

  async signup(dto: SignupDto, role: 'brand' | 'creator') {
    const { name, email, password } = dto;

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) throw new BadRequestException('Email already used');

    const referralCode = await this.generateReferralCode(name);
    const hashedPassword = await this.hashPassword(password);

    if (role === 'brand') {
      const username = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const existingUsername = await this.brandRepository.findOne({
        where: { username },
      });
      if (existingUsername) {
        throw new BadRequestException('Username already taken');
      }
      const brand = this.brandRepository.create({
        role: UserRole.BRAND,
        ...dto,
        password: hashedPassword,
        referralCode,
        username,
      });
      await this.brandRepository.save(brand);
    } else if (role === 'creator') {
      const creator = this.creatorRepository.create({
        role: UserRole.CREATOR,
        ...dto,
        password: hashedPassword,
        referralCode,
      });
      await this.creatorRepository.save(creator);
    }

    const token = await this.generateToken(email, 10);
    await this.mailerService.sendVerificationEmail(email, token.token);

    return { message: 'Signup successful. Please check your email to verify.' };
  }

  async generateToken(email: string, expiresInMinutes = 10): Promise<Token> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const tokenCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    await this.tokenRepository.delete({ user: { id: user.id } });

    const token = this.tokenRepository.create({
      token: tokenCode,
      expiresAt,
      user,
    });

    return await this.tokenRepository.save(token);
  }

  async verifyEmail(
    tokenValue: string,
    res: Response,
  ): Promise<{ message: string; user: User; accessToken: string }> {
    const token = await this.tokenRepository.findOne({
      where: { token: tokenValue },
      relations: ['user'],
    });
    if (!token) throw new BadRequestException('Invalid token');
    if (token.expiresAt < new Date()) {
      await this.tokenRepository.delete(token.id);
      throw new BadRequestException('Token expired');
    }

    const user = token.user;
    user.isVerified = true;
    await this.userRepository.save(user);

    if (user.role === UserRole.BRAND) {
      const brand = await this.brandRepository.findOne({
        where: { id: user.id },
        relations: ['cart'],
      });

      if (!brand?.cart) {
        const cart = this.cartRepository.create({
          brandId: brand?.id,
        });
        await this.cartRepository.save(cart);
      }
    }
    await this.tokenRepository.delete(token.id);
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    if (user.role === UserRole.BRAND) {
      await this.mailerService.sendWelcomeEmailToBrand(user.email);
    } else if (user.role === UserRole.CREATOR) {
      const referralUrl = `${process.env.VITE_APP_BASE_URL}/?ref=${user.referralCode}`;
      await this.mailerService.sendWelcomeEmailToCreator(
        user.email,
        user.name,
        referralUrl,
      );
    }

    return {
      message: 'Email verified successfully',
      user,
      accessToken,
    };
  }

  @Cron(CronExpression.EVERY_HOUR)
  async cleanupExpiredTokens() {
    const expiredTokens = await this.tokenRepository.find({
      where: { expiresAt: LessThan(new Date()) },
      relations: ['user'],
    });

    for (const token of expiredTokens) {
      const user = token.user;

      if (!user.isVerified) {
        if (user.role === UserRole.BRAND) {
          await this.brandRepository.delete(user.id);
        } else if (user.role === UserRole.CREATOR) {
          await this.creatorRepository.delete(user.id);
        }
        await this.userRepository.delete(user.id);
      }

      await this.tokenRepository.delete(token.id);
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; user: User }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new UnauthorizedException('user not found');
    if (!user.password) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    // Load full user based on role
    let fullUser: User | Creator | Brand | null;
    if (user.role === UserRole.BRAND) {
      fullUser = await this.brandRepository.findOne({
        where: { id: user.id },
        relations: ['wallet', 'cart', 'billing', 'socialChannels'],
      });
    } else if (user.role === UserRole.CREATOR) {
      fullUser = await this.creatorRepository.findOne({
        where: { id: user.id },
        relations: [
          'wallet',
          'card',
          'media',
          'portfolio',
          'niches',
          'socialChannels',
        ],
      });
    } else {
      fullUser = user;
    }

    // Remove password if present
    if (fullUser && 'password' in fullUser) {
      delete fullUser.password;
    }

    if (!fullUser) {
      throw new UnauthorizedException('User not found');
    }

    // Sign and return token
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: fullUser,
    };
  }

  async validateGoogleUser(googleProfile: {
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    password: string;
    role: 'brand' | 'creator';
  }): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: googleProfile.email },
    });

    if (existingUser) return existingUser;

    const referralCode = await this.generateReferralCode(
      googleProfile.firstName,
    );
    const name = `${googleProfile.firstName} ${googleProfile.lastName}`;

    if (googleProfile.role === 'brand') {
      const username = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const existingUsername = await this.brandRepository.findOne({
        where: { username },
      });
      if (existingUsername) {
        throw new BadRequestException('Username already taken');
      }
      const brand = this.brandRepository.create({
        name,
        email: googleProfile.email,
        password: '',
        isVerified: true,
        role: UserRole.BRAND,
        referralCode,
        username,
      });
      return await this.brandRepository.save(brand);
    } else {
      const creator = this.creatorRepository.create({
        name,
        email: googleProfile.email,
        password: '',
        isVerified: true,
        role: UserRole.CREATOR,
        referralCode,
      });
      return await this.creatorRepository.save(creator);
    }
  }

  async loginGoogle(
    googleUser: GoogleUser,
    role: 'brand' | 'creator',
  ): Promise<{ accessToken: string; user: User }> {
    const { email, name } = googleUser;

    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      const referralCode = await this.generateReferralCode(name);

      if (role === 'creator') {
        user = this.creatorRepository.create({
          name,
          email,
          password: '',
          isVerified: true,
          role: UserRole.CREATOR,
          referralCode,
        });
        await this.creatorRepository.save(user);
      } else {
        user = this.brandRepository.create({
          name,
          email,
          password: '',
          isVerified: true,
          role: UserRole.BRAND,
          referralCode,
          username: name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(),
        });
        await this.brandRepository.save(user);
      }
    }

    // Load full subclass entity
    let fullUser: User | Creator | Brand | null;
    if (user.role === UserRole.BRAND && user.profileComplete === true) {
      fullUser = await this.brandRepository.findOne({
        where: { id: user.id },
        relations: ['wallet', 'cart', 'billing', 'socialChannels'],
      });
    } else if (
      user.role === UserRole.CREATOR &&
      user.profileComplete === true
    ) {
      fullUser = await this.creatorRepository.findOne({
        where: { id: user.id },
        relations: [
          'wallet',
          'card',
          'media',
          'portfolio',
          'niches',
          'socialChannels',
        ],
      });
    } else {
      fullUser = user;
    }

    if (fullUser && 'password' in fullUser) delete fullUser.password;

    if (!fullUser) {
      throw new UnauthorizedException('User not found');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const profileComplete = user.profileComplete === true;
    return {
      accessToken,
      user,
    };
  }

  async issueTokenAfterSignup(
    userId: number,
    res: Response,
  ): Promise<{ accessToken: string; user: User }> {
    const baseUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!baseUser) throw new BadRequestException('User not found');

    let user: User | Creator | Brand | null;
    baseUser.profileComplete = true;

    await this.userRepository.save(baseUser);

    if (baseUser.role === UserRole.BRAND) {
      user = await this.brandRepository.findOne({
        where: { id: baseUser.id },
        relations: ['wallet', 'cart', 'billing', 'socialChannels'],
      });
    } else if (baseUser.role === UserRole.CREATOR) {
      user = await this.creatorRepository.findOne({
        where: { id: baseUser.id },
        relations: [
          'wallet',
          'card',
          'media',
          'portfolio',
          'niches',
          'socialChannels',
        ],
      });
    } else {
      user = baseUser;
    }

    if (user && 'password' in user) delete user.password;

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { accessToken, user };
  }

  async getUserById(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async forgotPassword(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    const resetToken = this.generateToken(email, 15);
    await this.mailerService.sendPasswordResetEmail(user, await resetToken);
  }

  async resetPassword(
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    const resetToken = await this.tokenRepository.findOne({
      where: { token },
      relations: ['user'],
    });
    if (!resetToken) throw new NotFoundException('Token not found');
    if (!resetToken.user) throw new NotFoundException('User not found');
    if (resetToken.expiresAt < new Date()) {
      await this.tokenRepository.delete(resetToken.id);
      throw new BadRequestException('Token expired');
    }

    const user = resetToken.user;
    const hashedPassword = await this.hashPassword(newPassword);
    user.password = hashedPassword;
    await this.tokenRepository.delete(resetToken.id);

    await this.userRepository.save(user);

    return {
      message: 'Your password has been reset successfully. You can now log in.',
    };
  }
}

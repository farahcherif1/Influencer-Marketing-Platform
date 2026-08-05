import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { User } from '../user/entities/user.entity';
import { Brand } from '../brand/entities/brand.entity';
import { Token } from './entities/token.entity';
import { MailerModule } from '../mailer/mailer.module';
import { Creator } from '../creator/entities/creator.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import googleOauthConfig from '../../config/google-oauth.config';
import { GoogleStrategy } from './strategies/google.strategy';
import { Cart } from '../../modules/cart/entities/cart.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Brand, Token, Creator, Cart]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forFeature(googleOauthConfig),
    MailerModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}

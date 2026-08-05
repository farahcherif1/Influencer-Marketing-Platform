import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { MailerService } from '../mailer/mailer.service';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Referral } from './entities/referral.entity';
import { Brand } from '../brand/entities/brand.entity';

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
    @InjectRepository(Referral)
    private referralRepository: Repository<Referral>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async sendInvite(email: string, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Inviting user not found');

    const referralUrl = `${process.env.VITE_APP_BASE_URL}/?ref=${user.referralCode}`;
    await this.mailerService.sendReferralInviteEmail(
      email,
      user.name,
      referralUrl,
    );

    return { message: 'Invite sent successfully' };
  }
  async createReferral(
    referralCode: string,
    brandId: number,
  ): Promise<Referral> {
    const referrer = await this.userRepository.findOne({
      where: { referralCode },
    });

    if (!referrer) {
      throw new NotFoundException('Referrer with this code not found');
    }

    const brand = await this.brandRepository.findOne({
      where: { id: brandId },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    // Check for existing referral for this brand
    const existingReferral = await this.referralRepository.findOne({
      where: { brandId },
    });
    if (existingReferral) {
      throw new ConflictException('This brand already has a referral');
    }

    const referral = this.referralRepository.create({
      referrerId: referrer.id,
      brandId,
    });

    return this.referralRepository.save(referral);
  }
}

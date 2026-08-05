import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { CreateReferralDto } from './dto/create-referral.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Referral } from './entities/referral.entity';

@Controller('referral')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post()
  create(@Body() dto: CreateReferralDto): Promise<Referral> {
    return this.referralService.createReferral(dto.referralCode, dto.brandId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('invite')
  async inviteByEmail(@Body() body: { email: string; userId: number }) {
    return this.referralService.sendInvite(body.email, body.userId);
  }
}

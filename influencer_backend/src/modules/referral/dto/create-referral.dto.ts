import { IsString, IsNumber } from 'class-validator';

export class CreateReferralDto {
  @IsString()
  referralCode: string;

  @IsNumber()
  brandId: number;
}

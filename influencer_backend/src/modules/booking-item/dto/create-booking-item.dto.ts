import {
  IsInt,
  IsNumber,
  IsString,
  IsBoolean,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateBookingItemDto {
  @IsInt()
  creatorServiceId: number;

  @IsInt()
  quantity: number;

  @IsNumber()
  unitPrice: number;

  @IsString()
  productDescription: string;

  @IsString()
  contentRequirements: string;

  @IsBoolean()
  @IsOptional()
  contentApproval?: boolean;

  @IsBoolean()
  @IsOptional()
  physicalProduct?: boolean;

  @IsNumber()
  @IsOptional()
  productCost?: number;

  @IsBoolean()
  @IsOptional()
  useForAds?: boolean;

  @IsString()
  @IsOptional()
  additionalRequirements?: string;

  @IsDateString()
  @IsOptional()
  deliveryDate?: Date;
}

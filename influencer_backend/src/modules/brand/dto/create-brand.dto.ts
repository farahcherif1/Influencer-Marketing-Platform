import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsNumber,
  IsArray,
  IsString,
} from 'class-validator';

export class CreateBrandDto {
  @IsNotEmpty()
  @IsString()
  brandName: string;

  @IsOptional()
  @IsString()
  brandRole?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  // NEW: for linking existing categories
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  categoryIds?: number[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetPlatforms?: string[];

  @IsOptional()
  @IsInt()
  piecesOfContentPerMonth?: number;

  @IsOptional()
  @IsNumber()
  annualBudget?: number;
}

import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { genderType } from '../../../common/enums/genderType.enum';

export class SearchCreatorDto {
  @IsOptional() @IsString() platform: string;
  @IsOptional() @IsString() category?: string;

  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() city?: string;

  @IsOptional() @IsString() name?: string;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(16)
  @Max(120)
  ageMin?: number;
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(16)
  @Max(120)
  ageMax?: number;

  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) priceMin?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) priceMax?: number;

  @IsOptional() @IsEnum(genderType) @IsString() gender?: genderType;

  @IsOptional() @IsString() ethnicity?: string;
  @IsOptional() @IsString() contentType?: string;

  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) followersMin?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) followersMax?: number;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 8;
}

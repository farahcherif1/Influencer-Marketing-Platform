import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class SearchBrandDto {
  @IsOptional() @IsString() platform?: string;
  @IsOptional() @IsString() category?: string;

  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() brandName?: string;

  @IsOptional() @IsString() industry?: string;

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

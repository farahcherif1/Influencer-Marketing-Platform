import { IsOptional, IsString, IsArray, IsNumber } from 'class-validator';
import { Category } from 'modules/category/category.entity';

export class UpdateBrandDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true }) // if IDs are numbers
  categoryIds?: number[];
}

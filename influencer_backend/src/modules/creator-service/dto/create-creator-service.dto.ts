import { IsNumber, IsString, IsOptional, IsEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { DurationUnit } from '../../../common/enums/durationUnit.enum';

export class CreateCreatorServiceDto {
  @IsNumber()
  serviceId: number;

  @IsOptional()
  @IsString()
  contentType?: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  quantity: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  duration?: number;

  @IsOptional()
  durationUnit?: DurationUnit;
}

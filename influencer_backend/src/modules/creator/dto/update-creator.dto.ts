import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { genderType } from '../../../common/enums/genderType.enum';

export class UpdateCreatorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(genderType)
  gender?: genderType;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;
}

import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsInt,
} from 'class-validator';
import { genderType } from '../../../common/enums/genderType.enum';

export class CreateUsernameDto {
  @IsString()
  username: string;
}

export class CreateLocationDto {
  @IsOptional()
  @IsString()
  location?: string;
}

export class CreateTitleDto {
  @IsString()
  title: string;
}

export class CreateDescriptionDto {
  @IsString()
  description: string;
}

export class CreateGenderDto {
  @IsEnum(genderType)
  gender: genderType;
}

export class CreateCategoryIdsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  categoryIds: number[];
}

export class CreatePhoneNumberDto {
  @IsString()
  phoneNumber: string;
}

import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ContentType } from '../../../common/enums/contentType.enum';

export class CreateSocialChannelDto {
  @IsEnum(ContentType)
  platform: ContentType;

  @ValidateIf(
    (o) =>
      o.platform !== ContentType.AMAZON && o.platform !== ContentType.WEBSITE,
  )
  @IsInt()
  @IsOptional()
  followers?: number;

  @ValidateIf(
    (o) =>
      o.platform !== ContentType.AMAZON && o.platform !== ContentType.WEBSITE,
  )
  @IsString()
  @IsNotEmpty()
  username: string;

  @ValidateIf(
    (o) =>
      o.platform === ContentType.AMAZON || o.platform === ContentType.WEBSITE,
  )
  @IsString()
  @IsNotEmpty({ message: 'URL must be provided for Amazon or Website' })
  url?: string;
}

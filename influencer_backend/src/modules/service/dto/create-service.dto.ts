import { IsBoolean, IsEnum, IsString } from 'class-validator';
import { ContentType } from '../../../common/enums/contentType.enum';

export class CreateServiceDto {
  @IsString()
  name: string;

  @IsEnum(ContentType)
  platform: ContentType;

  @IsBoolean()
  hasDuration: boolean;
}

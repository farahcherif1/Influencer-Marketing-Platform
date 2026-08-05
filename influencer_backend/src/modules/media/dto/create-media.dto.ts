import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MediaType } from '../../../common/enums/mediaType.enum';

export class CreateMediaDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  url?: string;

  @IsEnum(MediaType)
  type: MediaType;
}

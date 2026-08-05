import { IsOptional, IsString } from 'class-validator';

export class UpdateBrandMediaDto {
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsString()
  coverPicture?: string;
}

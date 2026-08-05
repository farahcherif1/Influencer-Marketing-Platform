import { IsOptional, IsString } from 'class-validator';

export class changePasswordDto {
  @IsString()
  password: string;
}

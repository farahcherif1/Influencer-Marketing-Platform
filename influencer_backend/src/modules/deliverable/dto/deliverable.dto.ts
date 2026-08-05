import { IsArray, IsString } from 'class-validator';

export class CreateLinkDto {
  @IsArray()
  @IsString({ each: true })
  links: string[];
}

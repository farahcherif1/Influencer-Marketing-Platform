import { IsString } from 'class-validator';

export class CreatePortfolioDto {
  @IsString()
  url: string;
}

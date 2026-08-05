import { IsInt, IsString, Min, Max } from 'class-validator';

export class CreateReviewBrandDto {
  @IsInt()
  creatorId: number;

  @IsInt()
  brandId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  communicationRating: number;

  @IsInt()
  @Min(1)
  @Max(5)
  timeTakenToCompleteOrderRating: number;

  @IsInt()
  @Min(1)
  @Max(5)
  serviceRating: number;

  @IsString()
  comment: string;
}

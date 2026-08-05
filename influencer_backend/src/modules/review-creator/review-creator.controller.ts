import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ReviewCreatorService } from './review-creator.service';
import { CreateReviewCreatorDto } from './dto/create-review-creator.dto';
import { ReviewCreator } from './entities/review-creator.entity';

@Controller('review-creator')
export class ReviewCreatorController {
  constructor(private readonly reviewCreatorService: ReviewCreatorService) {}

  @Post()
  async create(
    @Body() CreateReviewCreatorDto: CreateReviewCreatorDto,
  ): Promise<ReviewCreator> {
    return this.reviewCreatorService.create(CreateReviewCreatorDto);
  }

  @Get(':creatorId')
  async get(@Param('creatorId') creatorId: number): Promise<ReviewCreator[]> {
    return this.reviewCreatorService.findByCreator(creatorId);
  }
}

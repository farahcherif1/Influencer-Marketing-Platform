import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ReviewBrandService } from './review-brand.service';
import { CreateReviewBrandDto } from './dto/create-review-brand.dto';
import { ReviewBrand } from './entities/review-brand.entity';

@Controller('review-brand')
export class ReviewBrandController {
  constructor(private readonly reviewBrandService: ReviewBrandService) {}

  @Post()
  async create(
    @Body() createReviewBrandDto: CreateReviewBrandDto,
  ): Promise<ReviewBrand> {
    return this.reviewBrandService.create(createReviewBrandDto);
  }

  @Get(':brandId')
  async get(@Param('brandId') brandId: number): Promise<ReviewBrand[]> {
    return this.reviewBrandService.findByBrand(brandId);
  }
}

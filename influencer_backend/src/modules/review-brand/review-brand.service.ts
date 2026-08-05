import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewBrand } from './entities/review-brand.entity';
import { CreateReviewBrandDto } from './dto/create-review-brand.dto';
import { Brand } from '../brand/entities/brand.entity';

@Injectable()
export class ReviewBrandService {
  constructor(
    @InjectRepository(ReviewBrand)
    private readonly reviewBrandRepository: Repository<ReviewBrand>,

    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async create(
    createReviewBrandDto: CreateReviewBrandDto,
  ): Promise<ReviewBrand> {
    const review = this.reviewBrandRepository.create(createReviewBrandDto);
    return await this.reviewBrandRepository.save(review);
  }

  async findByBrand(brandId: number): Promise<ReviewBrand[]> {
    const brand = await this.brandRepository.findOne({
      where: { id: brandId },
    });
    if (!brand) {
      throw new NotFoundException('brand do not exist');
    }
    return await this.reviewBrandRepository.find({
      where: { brandId },
      relations: ['creator', 'brand'],
    });
  }
}

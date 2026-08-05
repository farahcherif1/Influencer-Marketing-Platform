import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewCreator } from './entities/review-creator.entity';
import { CreateReviewCreatorDto } from './dto/create-review-creator.dto';
import { Creator } from '../creator/entities/creator.entity';

@Injectable()
export class ReviewCreatorService {
  constructor(
    @InjectRepository(ReviewCreator)
    private readonly reviewCreatorRepository: Repository<ReviewCreator>,

    @InjectRepository(Creator)
    private readonly creatorRepository: Repository<Creator>,
  ) {}

  async create(
    createReviewCreatorDto: CreateReviewCreatorDto,
  ): Promise<ReviewCreator> {
    const review = this.reviewCreatorRepository.create(createReviewCreatorDto);
    return await this.reviewCreatorRepository.save(review);
  }
  async findByCreator(creatorId: number): Promise<ReviewCreator[]> {
    const creator = await this.creatorRepository.findOne({
      where: { id: creatorId },
    });
    if (!creator) {
      throw new NotFoundException('creator do not exist');
    }
    return await this.reviewCreatorRepository.find({
      where: { creatorId },
      relations: ['creator', 'brand'],
    });
  }
}

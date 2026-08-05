import { Module } from '@nestjs/common';
import { ReviewCreatorService } from './review-creator.service';
import { ReviewCreatorController } from './review-creator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewCreator } from './entities/review-creator.entity';
import { Creator } from '../creator/entities/creator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewCreator, Creator])],
  controllers: [ReviewCreatorController],
  providers: [ReviewCreatorService],
})
export class ReviewCreatorModule {}

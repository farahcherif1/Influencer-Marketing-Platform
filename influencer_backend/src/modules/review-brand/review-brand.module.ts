import { Module } from '@nestjs/common';
import { ReviewBrandService } from './review-brand.service';
import { ReviewBrandController } from './review-brand.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { ReviewBrand } from './entities/review-brand.entity';
import { Brand } from '../brand/entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewBrand, Brand])],
  controllers: [ReviewBrandController],
  providers: [ReviewBrandService],
})
export class ReviewBrandModule {}

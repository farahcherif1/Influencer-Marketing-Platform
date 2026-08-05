import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Category } from '../category/category.entity';
import { Referral } from '../referral/entities/referral.entity';
import { Booking } from '../booking/entities/booking.entity';
import { S3Module } from '../../s3/s3.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Brand, Category, Referral, Booking]),
    S3Module,
  ],
  providers: [BrandService],
  controllers: [BrandController],
  exports: [BrandService],
})
export class BrandModule {}

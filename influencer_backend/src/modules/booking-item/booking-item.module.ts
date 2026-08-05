import { Module } from '@nestjs/common';
import { BookingItemService } from './booking-item.service';
import { BookingItemController } from './booking-item.controller';
import { BookingItem } from './entities/booking-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';

@Module({
  imports: [TypeOrmModule.forFeature([BookingItem])],
  controllers: [BookingItemController],
  providers: [BookingItemService],
})
export class BookingItemModule {}

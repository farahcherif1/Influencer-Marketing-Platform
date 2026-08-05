import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingItem } from '../booking-item/entities/booking-item.entity';
import { Booking } from './entities/booking.entity';
import { Brand } from '../brand/entities/brand.entity';
import { CreatorService } from '../creator-service/entities/creator-service.entity';
import { TwilioService } from '../twilio/twilio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, BookingItem, Brand, CreatorService]),
  ],
  controllers: [BookingController],
  providers: [BookingService, TwilioService],
})
export class BookingModule {}

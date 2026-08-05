import { Controller, Post, Body, Param } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateBookingItemDto } from '../booking-item/dto/create-booking-item.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // Step 1 → Create booking
  @Post()
  createBooking(@Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(dto);
  }

  // Step 2 → Add booking item to booking
  @Post(':id/items')
  createBookingItem(
    @Param('id') id: number,
    @Body() dto: CreateBookingItemDto,
  ) {
    return this.bookingService.createBookingItem(+id, dto);
  }
}

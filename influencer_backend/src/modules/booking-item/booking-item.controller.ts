import { Body, Controller, Param, ParseIntPipe, Put } from '@nestjs/common';
import { BookingItemService } from './booking-item.service';

@Controller('booking-item')
export class BookingItemController {
  constructor(private readonly bookingItemService: BookingItemService) {}

  @Put(':id/status')
  async updateBookingItem(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingItem: { status: string },
  ) {
    return this.bookingItemService.updateStatus(id, updateBookingItem);
  }
}

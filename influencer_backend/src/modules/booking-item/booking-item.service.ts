import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingItem } from './entities/booking-item.entity';
import { Repository } from 'typeorm/repository/Repository';
import { BookingItemStatus } from 'common/enums/bookingItemStatus.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookingItemService {
  constructor(
    @InjectRepository(BookingItem)
    private readonly bookingItemRepo: Repository<BookingItem>,
  ) {}
  async findOne(id: number): Promise<BookingItem> {
    const bookingItem = await this.bookingItemRepo.findOne({
      where: { id },
      relations: ['creatorService', 'booking'],
    });
    if (!bookingItem) throw new NotFoundException('Booking item not found');
    return bookingItem;
  }

  async updateStatus(id: number, { status }: { status: string }) {
    const bookingItem = await this.findOne(id);
    if (!bookingItem) {
      throw new Error('Booking item not found');
    }
    bookingItem.status = status as BookingItemStatus;
    await this.bookingItemRepo.save(bookingItem);
  }
}

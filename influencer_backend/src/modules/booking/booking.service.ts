import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { BookingItem } from '../booking-item/entities/booking-item.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { CreateBookingItemDto } from '../booking-item/dto/create-booking-item.dto';
import { Brand } from '../brand/entities/brand.entity';
import { CreatorService } from '../creator-service/entities/creator-service.entity';
import { TwilioService } from '../twilio/twilio.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(BookingItem)
    private bookingItemRepo: Repository<BookingItem>,
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
    private twilioService: TwilioService,
    @InjectRepository(CreatorService)
    private creatorServiceRepo: Repository<CreatorService>,
  ) {}

  async createBooking(dto: CreateBookingDto) {
    const brand = await this.brandRepo.findOne({ where: { id: dto.brandId } });
    if (!brand) throw new NotFoundException('Brand not found');

    const booking = this.bookingRepo.create({
      brand,
      price: dto.price,
      status: dto.status,
    });

    return this.bookingRepo.save(booking);
  }

  async createBookingItem(bookingId: number, dto: CreateBookingItemDto) {
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    const creatorService = await this.creatorServiceRepo.findOne({
      where: { id: dto.creatorServiceId },
      relations: ['creator'],
    });
    if (!creatorService)
      throw new NotFoundException('Creator service not found');

    const bookingItem = this.bookingItemRepo.create({
      ...dto,
      booking,
      creatorService,
    });

    const savedBookingItem = await this.bookingItemRepo.save(bookingItem);

    if (creatorService.creator?.phoneNumber) {
      await this.twilioService.sendSms(
        creatorService.creator.phoneNumber,
        `Hi! You just got a new booking 🎉`,
      );
    }
    return savedBookingItem;
  }
}

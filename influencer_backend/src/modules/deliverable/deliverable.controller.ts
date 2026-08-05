import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { DeliverableService } from './deliverable.service';
import { CreateLinkDto } from './dto/deliverable.dto';

@Controller('deliverable')
export class DeliverableController {
  constructor(private readonly deliverableService: DeliverableService) {}

  @Post('upload/:bookingItemId')
  @UseInterceptors(FilesInterceptor('files', 10))
  async upload(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('bookingItemId') bookingItemIdParam: string,
  ) {
    const bookingItemId = Number(bookingItemIdParam);
    if (!bookingItemId) {
      throw new BadRequestException('bookingItemId is required');
    }
    return this.deliverableService.uploadToS3(bookingItemId, files);
  }

  @Post('links/:bookingItemId')
  createLinks(
    @Param('bookingItemId', ParseIntPipe) bookingItemId: number,
    @Body() dto: CreateLinkDto,
  ) {
    return this.deliverableService.createLinks(bookingItemId, dto);
  }

  @Get(':bookingItemId')
  find(@Param('bookingItemId', ParseIntPipe) bookingItemId: number) {
    return this.deliverableService.find(bookingItemId);
  }

  @Post('approved/:bookingItemId')
  approve(@Param('bookingItemId', ParseIntPipe) bookingItemId: number) {
    return this.deliverableService.approve(bookingItemId);
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PayoutHistoryService } from './payout-history.service';
import { CreatePayoutHistoryDto } from './dto/create-payout-history.dto';
import { UpdatePayoutHistoryDto } from './dto/update-payout-history.dto';

@Controller('payout-history')
export class PayoutHistoryController {
  constructor(private readonly payoutHistoryService: PayoutHistoryService) {}

  @Post()
  create(@Body() createPayoutHistoryDto: CreatePayoutHistoryDto) {
    return this.payoutHistoryService.create(createPayoutHistoryDto);
  }

  @Get()
  findAll() {
    return this.payoutHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payoutHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePayoutHistoryDto: UpdatePayoutHistoryDto,
  ) {
    return this.payoutHistoryService.update(+id, updatePayoutHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.payoutHistoryService.remove(+id);
  }
}

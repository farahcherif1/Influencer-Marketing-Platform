import { Injectable } from '@nestjs/common';
import { CreatePayoutHistoryDto } from './dto/create-payout-history.dto';
import { UpdatePayoutHistoryDto } from './dto/update-payout-history.dto';

@Injectable()
export class PayoutHistoryService {
  create(createPayoutHistoryDto: CreatePayoutHistoryDto) {
    return 'This action adds a new payoutHistory';
  }

  findAll() {
    return `This action returns all payoutHistory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payoutHistory`;
  }

  update(id: number, updatePayoutHistoryDto: UpdatePayoutHistoryDto) {
    return `This action updates a #${id} payoutHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} payoutHistory`;
  }
}

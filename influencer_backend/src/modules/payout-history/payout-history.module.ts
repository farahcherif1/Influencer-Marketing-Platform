import { Module } from '@nestjs/common';
import { PayoutHistoryService } from './payout-history.service';
import { PayoutHistoryController } from './payout-history.controller';

@Module({
  controllers: [PayoutHistoryController],
  providers: [PayoutHistoryService],
})
export class PayoutHistoryModule {}

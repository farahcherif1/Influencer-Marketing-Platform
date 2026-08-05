import { Test, TestingModule } from '@nestjs/testing';
import { PayoutHistoryController } from './payout-history.controller';
import { PayoutHistoryService } from './payout-history.service';

describe('PayoutHistoryController', () => {
  let controller: PayoutHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PayoutHistoryController],
      providers: [PayoutHistoryService],
    }).compile();

    controller = module.get<PayoutHistoryController>(PayoutHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

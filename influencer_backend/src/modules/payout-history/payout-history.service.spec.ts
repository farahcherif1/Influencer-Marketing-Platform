import { Test, TestingModule } from '@nestjs/testing';
import { PayoutHistoryService } from './payout-history.service';

describe('PayoutHistoryService', () => {
  let service: PayoutHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayoutHistoryService],
    }).compile();

    service = module.get<PayoutHistoryService>(PayoutHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

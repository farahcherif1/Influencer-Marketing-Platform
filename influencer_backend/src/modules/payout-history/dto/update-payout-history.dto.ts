import { PartialType } from '@nestjs/mapped-types';
import { CreatePayoutHistoryDto } from './create-payout-history.dto';

export class UpdatePayoutHistoryDto extends PartialType(
  CreatePayoutHistoryDto,
) {}

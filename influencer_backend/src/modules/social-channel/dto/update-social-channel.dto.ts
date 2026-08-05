import { PartialType } from '@nestjs/mapped-types';
import { CreateSocialChannelDto } from './create-social-channel.dto';

export class UpdateSocialChannelDto extends PartialType(
  CreateSocialChannelDto,
) {}

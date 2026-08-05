import { PartialType } from '@nestjs/mapped-types';
import { CreateCreatorServiceDto } from './create-creator-service.dto';

export class UpdateCreatorServiceDto extends PartialType(
  CreateCreatorServiceDto,
) {}

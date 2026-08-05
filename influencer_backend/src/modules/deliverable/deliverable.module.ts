import { Module } from '@nestjs/common';
import { DeliverableService } from './deliverable.service';
import { DeliverableController } from './deliverable.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deliverable } from './entities/deliverable.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deliverable])],
  controllers: [DeliverableController],
  providers: [DeliverableService],
})
export class DeliverableModule {}

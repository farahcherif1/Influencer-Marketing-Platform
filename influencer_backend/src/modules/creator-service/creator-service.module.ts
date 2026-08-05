import { Module } from '@nestjs/common';
import { CreatorServiceService } from './creator-service.service';
import { CreatorServiceController } from './creator-service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorService } from './entities/creator-service.entity';
import { Service } from '../service/entities/service.entity';
import { Creator } from '../creator/entities/creator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CreatorService, Service, Creator])],
  providers: [CreatorServiceService],
  controllers: [CreatorServiceController],
  exports: [CreatorServiceService],
})
export class CreatorServiceModule {}

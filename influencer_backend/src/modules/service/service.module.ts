import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { CreatorService } from '../creator-service/entities/creator-service.entity';
import { Category } from '../category/category.entity';
import { CreatorServiceModule } from '../creator-service/creator-service.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service, CreatorService, Category]),

    CreatorServiceModule,
  ],
  providers: [ServiceService],
  controllers: [ServiceController],
  exports: [ServiceService],
})
export class ServiceModule {}

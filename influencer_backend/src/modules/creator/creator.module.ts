import { Module } from '@nestjs/common';
import { CreatorService } from './creator.service';
import { CreatorController } from './creator.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Creator } from './entities/creator.entity';
import { SocialChannel } from '../social-channel/entities/social-channel.entity';
import { Media } from '../media/entities/media.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { ReviewBrand } from '../review-brand/entities/review-brand.entity';
import { ReviewCreator } from '../review-creator/entities/review-creator.entity';
import { Service } from '../service/entities/service.entity';
import { CreatorServiceModule } from '../creator-service/creator-service.module';
import { CreatorService as creatorServiceEntity } from '../creator-service/entities/creator-service.entity';
import { Category } from '../category/category.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { BookingItem } from '../booking-item/entities/booking-item.entity';
import { Portfolio } from '../portfolio/entities/portfolio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Creator,
      SocialChannel,
      Media,
      CreatorService,
      Service,
      creatorServiceEntity,
      Wallet,
      ReviewBrand,
      ReviewCreator,
      Category,
      User,
      BookingItem,
      Portfolio,
    ]),
    UserModule,
    CreatorServiceModule,
  ],
  controllers: [CreatorController],
  providers: [CreatorService],
})
export class CreatorModule {}

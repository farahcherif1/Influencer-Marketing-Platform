import { Module } from '@nestjs/common';
import { SocialChannelService } from './social-channel.service';
import { SocialChannelController } from './social-channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialChannel } from './entities/social-channel.entity';
import { Creator } from '../creator/entities/creator.entity';
import { Brand } from '../brand/entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SocialChannel, Creator, Brand])],
  controllers: [SocialChannelController],
  providers: [SocialChannelService],
  exports: [SocialChannelService],
})
export class SocialChannelModule {}

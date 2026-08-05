import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDatabaseConfig } from './config/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { BrandModule } from './modules/brand/brand.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { ServiceModule } from './modules/service/service.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { PaymentHistoryModule } from './modules/payment-history/payment-history.module';
import { BookingItemModule } from './modules/booking-item/booking-item.module';
import { NicheModule } from './modules/niche/niche.module';
import { ReviewBrandModule } from './modules/review-brand/review-brand.module';
import { ReviewCreatorModule } from './modules/review-creator/review-creator.module';
import { SocialChannelModule } from './modules/social-channel/social-channel.module';
import { CreatorServiceModule } from './modules/creator-service/creator-service.module';
import { BookingModule } from './modules/booking/booking.module';
import { BillingModule } from './modules/billing/billing.module';
import { CartModule } from './modules/cart/cart.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { MediaModule } from './modules/media/media.module';
import { MessageModule } from './modules/message/message.module';
import { NotificationModule } from './modules/notification/notification.module';
import { CreatorModule } from './modules/creator/creator.module';
import { ReferralModule } from './modules/referral/referral.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { PayoutHistoryModule } from './modules/payout-history/payout-history.module';
import { CardModule } from './modules/card/card.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CategoryModule } from './modules/category/category.module';
import { DeliverableModule } from './modules/deliverable/deliverable.module';
import { LanguageModule } from './language/language.module';
import { HealthModule } from './modules/health/health.module';
import { TwilioModule } from './modules/twilio/twilio.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ScheduleModule.forRoot(),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: async () => ({
        ...getDatabaseConfig.options,
      }),
    }),

    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   useFactory: async () => ({
    //     store: await redisStore({
    //       url: process.env.REDIS_URL || 'redis://localhost:6379',
    //     }),
    //     ttl: 60_000,
    //   }),
    // }),
    AuthModule,
    UserModule,
    BrandModule,
    MailerModule,
    ServiceModule,
    MessageModule,
    NicheModule,
    ReviewBrandModule,
    ReviewCreatorModule,
    SocialChannelModule,
    CreatorServiceModule,
    BookingModule,
    BillingModule,
    CartModule,
    PortfolioModule,
    MediaModule,
    BookingItemModule,
    PaymentHistoryModule,
    CartItemModule,
    NotificationModule,
    CreatorModule,
    ReferralModule,
    WalletModule,
    PayoutHistoryModule,
    CardModule,
    CategoryModule,
    DeliverableModule,
    LanguageModule,
    HealthModule,
    TwilioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

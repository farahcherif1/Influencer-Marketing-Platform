import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1756898664128 implements MigrationInterface {
  name = ' $npmConfigName1756898664128';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "token" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "token" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "userId" integer, CONSTRAINT "REL_94f168faad896c0786646fa3d4" UNIQUE ("userId"), CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer NOT NULL, "message" character varying NOT NULL, "isRead" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "senderId" integer NOT NULL, "receiverId" integer NOT NULL, "content" character varying NOT NULL, "timestamp" TIMESTAMP NOT NULL, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "referral" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "referrerId" integer NOT NULL, "brandId" integer NOT NULL, "isRewarded" boolean NOT NULL DEFAULT false, "rewardDate" TIMESTAMP, CONSTRAINT "UQ_83abcf069b079f18c6ed285a18e" UNIQUE ("brandId"), CONSTRAINT "PK_a2d3e935a6591168066defec5ad" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('brand', 'creator')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_gender_enum" AS ENUM('Male', 'Female', 'Other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "username" character varying, "email" character varying NOT NULL, "password" character varying, "role" "public"."user_role_enum", "isVerified" boolean NOT NULL DEFAULT false, "profileComplete" boolean NOT NULL DEFAULT false, "referralCode" character varying, "brandName" character varying, "brandRole" character varying, "logoUrl" character varying, "coverPhotoUrl" character varying, "description" character varying, "industry" character varying, "targetPlatforms" text, "piecesOfContentPerMonth" integer, "annualBudget" double precision, "location" character varying, "city" character varying, "country" character varying, "age" integer, "title" character varying, "gender" "public"."user_gender_enum", "ethnicity" character varying, "starRating" double precision DEFAULT '0', "phoneNumber" character varying, "dateOfBirth" date, "type" character varying NOT NULL DEFAULT 'user', "cardId" integer, CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_bf0e513b5cd8b4e937fa0702311" UNIQUE ("referralCode"), CONSTRAINT "REL_de44ed71836e81c3fca3dc7fc5" UNIQUE ("cardId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b964abf615cd68203dc3a0880c" ON "user" ("city") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5cb2b3e0419a73a360d327d497" ON "user" ("country") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1f457efff42e9e3d54598c4bd8" ON "user" ("age") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1ac5eabc8849a787948c3a32b6" ON "user" ("ethnicity") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_creator_ethnicity" ON "user" ("ethnicity") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_creator_gender" ON "user" ("gender") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_creator_age" ON "user" ("age") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_craeator_city" ON "user" ("city") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_creator_country" ON "user" ("country") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_31ef2b4d30675d0c15056b7f6e" ON "user" ("type") `,
    );
    await queryRunner.query(
      `CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "label" character varying NOT NULL, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_23c05c292c439d77b0de816b50" ON "category" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_creator_category" ON "category" ("name") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."service_platform_enum" AS ENUM('Instagram', 'TikTok', 'UGC', 'YouTube', 'Twitter', 'Twitch', 'Amazon', 'Website')`,
    );
    await queryRunner.query(
      `CREATE TABLE "service" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, "platform" "public"."service_platform_enum" NOT NULL, "hasDuration" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7806a14d42c3244064b4a1706c" ON "service" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1712c3f7635a5fad5e9e39a4ad" ON "service" ("platform") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_service_name" ON "service" ("name") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_service_platform" ON "service" ("platform") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."social_channel_platform_enum" AS ENUM('Instagram', 'TikTok', 'UGC', 'YouTube', 'Twitter', 'Twitch', 'Amazon', 'Website')`,
    );
    await queryRunner.query(
      `CREATE TABLE "social_channel" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "platform" "public"."social_channel_platform_enum" NOT NULL, "url" character varying, "followers" integer, "creatorId" integer, "brandId" integer, "username" character varying, CONSTRAINT "PK_c3ab4dadb89acdca225b34cc02b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_creator_contentType" ON "social_channel" ("platform") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_creator_followers" ON "social_channel" ("followers") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_history_status_enum" AS ENUM('Pending', 'Completed', 'Failed')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_history_type_enum" AS ENUM('Spend', 'TopUp')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_history" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "bookingId" integer, "billingId" integer, "amount" numeric(10,2) NOT NULL, "paymentMethod" character varying, "status" "public"."payment_history_status_enum" NOT NULL, "date" TIMESTAMP NOT NULL, "details" character varying, "type" "public"."payment_history_type_enum" NOT NULL, CONSTRAINT "REL_8799ccb4b093b6880d8cef9ec6" UNIQUE ("bookingId"), CONSTRAINT "PK_5fcec51a769b65c0c3c0987f11c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "billing" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "brandId" integer NOT NULL, "year" integer NOT NULL, "totalSpend" numeric(10,2) NOT NULL, "totalPending" numeric(10,2) NOT NULL, "balance" numeric(10,2) NOT NULL, CONSTRAINT "REL_ff5561d364f41cbf8a49b092cb" UNIQUE ("brandId"), CONSTRAINT "PK_d9043caf3033c11ed3d1b29f73c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart_item" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "cartId" integer NOT NULL, "creatorServiceId" integer NOT NULL, CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "brandId" integer NOT NULL, CONSTRAINT "REL_6f768033c2ba68b38802ce33ed" UNIQUE ("brandId"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payout_history_status_enum" AS ENUM('Pending', 'Approved', 'Rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payout_history" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "amount" double precision NOT NULL, "status" "public"."payout_history_status_enum" NOT NULL, "paymentMethod" character varying NOT NULL, "transactionId" character varying NOT NULL, "requestedAt" TIMESTAMP NOT NULL, "processedAt" TIMESTAMP, "walletId" integer, CONSTRAINT "PK_33d39bf1a6123a50aefbaca1489" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "wallet" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "availableBalance" double precision NOT NULL DEFAULT '0', "pendingBalance" double precision NOT NULL DEFAULT '0', "totalEarnings" double precision NOT NULL DEFAULT '0', "brandId" integer, CONSTRAINT "REL_99277703e0947cd80452eb35eb" UNIQUE ("brandId"), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "review_brand" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "rating" integer NOT NULL, "comment" text NOT NULL, "creatorId" integer NOT NULL, "brandId" integer NOT NULL, CONSTRAINT "PK_24a47b318f20a5257395e928eaa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "review_creator" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "rating" integer NOT NULL, "comment" text NOT NULL, "brandId" integer NOT NULL, "creatorId" integer NOT NULL, CONSTRAINT "PK_2b8cdd172bee186763eb91ae3df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "booking" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "brandId" integer NOT NULL, "status" character varying NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "booking_item" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "quantity" integer NOT NULL, "unitPrice" numeric NOT NULL, "bookingId" integer, "creatorServiceId" integer, CONSTRAINT "PK_5f00cae6b1d793669a01d03df5d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "creator_service" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "creatorId" integer NOT NULL, "serviceId" integer NOT NULL, "price" integer NOT NULL, "description" text NOT NULL, "quantity" integer NOT NULL, "duration" integer, "durationUnit" character varying, CONSTRAINT "PK_4ed5312d6974c9ed92412753f2b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a74ad7ed0c64e8849a58623e91" ON "creator_service" ("price") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_creator_price" ON "creator_service" ("price") `,
    );
    await queryRunner.query(
      `CREATE TABLE "niche" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "name" character varying NOT NULL, CONSTRAINT "PK_86e6b646495afbd5e82deef9f09" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "portfolio" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "creatorId" integer NOT NULL, "url" character varying, "s3Key" character varying, CONSTRAINT "PK_6936bb92ca4b7cda0ff28794e48" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."media_type_enum" AS ENUM('PROFILE_PICTURE', 'COVER_PICTURE', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "media" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "creatorId" integer NOT NULL, "url" character varying NOT NULL, "type" "public"."media_type_enum" NOT NULL, "s3Key" character varying, CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "card" ("id" SERIAL NOT NULL, "creatorItd" character varying NOT NULL, "brand" character varying NOT NULL, "last4" character varying NOT NULL, "expiry_month" integer NOT NULL, "expiry_year" integer NOT NULL, "creatorId" integer, CONSTRAINT "REL_f2ea75a6729b657d16f6dde6a6" UNIQUE ("creatorId"), CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "language" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "code" character varying, CONSTRAINT "UQ_7df7d1e250ea2a416f078a631fb" UNIQUE ("name"), CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7df7d1e250ea2a416f078a631f" ON "language" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_categories_category" ("userId" integer NOT NULL, "categoryId" integer NOT NULL, CONSTRAINT "PK_5a62c2d9eba0ec02cda365b9ab7" PRIMARY KEY ("userId", "categoryId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_331665e2e7d360bf2b715dfeea" ON "user_categories_category" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_936afd72159ca6d1143ab3d66a" ON "user_categories_category" ("categoryId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_languages_language" ("userId" integer NOT NULL, "languageId" integer NOT NULL, CONSTRAINT "PK_14221c954c50812bb7fd06b319c" PRIMARY KEY ("userId", "languageId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b5a354512d266899cbf6926a07" ON "user_languages_language" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_549a828f3e9504aed8572234df" ON "user_languages_language" ("languageId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "user_niches_niche" ("userId" integer NOT NULL, "nicheId" integer NOT NULL, CONSTRAINT "PK_f454a5fec03165ab13291d932f8" PRIMARY KEY ("userId", "nicheId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_00a6518a5901679b2afcfb87b8" ON "user_niches_niche" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4921fd5bcc89a1c55fda4fc5ee" ON "user_niches_niche" ("nicheId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_71fb36906595c602056d936fc13" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral" ADD CONSTRAINT "FK_ec295d220eaab068ed5147e8582" FOREIGN KEY ("referrerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_de44ed71836e81c3fca3dc7fc5c" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_channel" ADD CONSTRAINT "FK_32e4f87107693b745d6da9cd44f" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_channel" ADD CONSTRAINT "FK_477cba058cae3c484caefc503e7" FOREIGN KEY ("brandId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_history" ADD CONSTRAINT "FK_8799ccb4b093b6880d8cef9ec6e" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_history" ADD CONSTRAINT "FK_6eb2bc5a6dc2ae50f88f8a6cebe" FOREIGN KEY ("billingId") REFERENCES "billing"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "billing" ADD CONSTRAINT "FK_ff5561d364f41cbf8a49b092cba" FOREIGN KEY ("brandId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_29e590514f9941296f3a2440d39" FOREIGN KEY ("cartId") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_e0f4bb7ac80cb9d3e0c76baaf05" FOREIGN KEY ("creatorServiceId") REFERENCES "creator_service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_6f768033c2ba68b38802ce33ed7" FOREIGN KEY ("brandId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payout_history" ADD CONSTRAINT "FK_8b7650155b10359dd1cb5dcdf5a" FOREIGN KEY ("walletId") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_99277703e0947cd80452eb35eb2" FOREIGN KEY ("brandId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_brand" ADD CONSTRAINT "FK_182ac45df6d6c2b7709d532e216" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_brand" ADD CONSTRAINT "FK_c01f617d087c5426af08c5ba2b1" FOREIGN KEY ("brandId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_creator" ADD CONSTRAINT "FK_afcd87cecdc1b251baa2dd82211" FOREIGN KEY ("brandId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_creator" ADD CONSTRAINT "FK_95d76be82d1fd94f0f5f1edccb1" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_4b0ef235726ca75028f12011f89" FOREIGN KEY ("brandId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_item" ADD CONSTRAINT "FK_9faafa553fc2800ecd63392aedc" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_item" ADD CONSTRAINT "FK_c0b5eb382434b2b6dc121b8bf08" FOREIGN KEY ("creatorServiceId") REFERENCES "creator_service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_service" ADD CONSTRAINT "FK_12727c32408bcffc115b2e2c0f4" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_service" ADD CONSTRAINT "FK_6062ea0ef23005c5ccd8e59f404" FOREIGN KEY ("serviceId") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio" ADD CONSTRAINT "FK_e49d560310a885ba47e378435e7" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" ADD CONSTRAINT "FK_4fd9c27adef50f63eaef9c34eb4" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "card" ADD CONSTRAINT "FK_f2ea75a6729b657d16f6dde6a6c" FOREIGN KEY ("creatorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_categories_category" ADD CONSTRAINT "FK_331665e2e7d360bf2b715dfeea9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_categories_category" ADD CONSTRAINT "FK_936afd72159ca6d1143ab3d66af" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_languages_language" ADD CONSTRAINT "FK_b5a354512d266899cbf6926a073" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_languages_language" ADD CONSTRAINT "FK_549a828f3e9504aed8572234dfa" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_niches_niche" ADD CONSTRAINT "FK_00a6518a5901679b2afcfb87b89" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_niches_niche" ADD CONSTRAINT "FK_4921fd5bcc89a1c55fda4fc5ee5" FOREIGN KEY ("nicheId") REFERENCES "niche"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_niches_niche" DROP CONSTRAINT "FK_4921fd5bcc89a1c55fda4fc5ee5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_niches_niche" DROP CONSTRAINT "FK_00a6518a5901679b2afcfb87b89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_languages_language" DROP CONSTRAINT "FK_549a828f3e9504aed8572234dfa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_languages_language" DROP CONSTRAINT "FK_b5a354512d266899cbf6926a073"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_categories_category" DROP CONSTRAINT "FK_936afd72159ca6d1143ab3d66af"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_categories_category" DROP CONSTRAINT "FK_331665e2e7d360bf2b715dfeea9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "card" DROP CONSTRAINT "FK_f2ea75a6729b657d16f6dde6a6c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "media" DROP CONSTRAINT "FK_4fd9c27adef50f63eaef9c34eb4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "portfolio" DROP CONSTRAINT "FK_e49d560310a885ba47e378435e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_service" DROP CONSTRAINT "FK_6062ea0ef23005c5ccd8e59f404"`,
    );
    await queryRunner.query(
      `ALTER TABLE "creator_service" DROP CONSTRAINT "FK_12727c32408bcffc115b2e2c0f4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_item" DROP CONSTRAINT "FK_c0b5eb382434b2b6dc121b8bf08"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_item" DROP CONSTRAINT "FK_9faafa553fc2800ecd63392aedc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_4b0ef235726ca75028f12011f89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_creator" DROP CONSTRAINT "FK_95d76be82d1fd94f0f5f1edccb1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_creator" DROP CONSTRAINT "FK_afcd87cecdc1b251baa2dd82211"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_brand" DROP CONSTRAINT "FK_c01f617d087c5426af08c5ba2b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "review_brand" DROP CONSTRAINT "FK_182ac45df6d6c2b7709d532e216"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_99277703e0947cd80452eb35eb2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payout_history" DROP CONSTRAINT "FK_8b7650155b10359dd1cb5dcdf5a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_6f768033c2ba68b38802ce33ed7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "FK_e0f4bb7ac80cb9d3e0c76baaf05"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "FK_29e590514f9941296f3a2440d39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "billing" DROP CONSTRAINT "FK_ff5561d364f41cbf8a49b092cba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_history" DROP CONSTRAINT "FK_6eb2bc5a6dc2ae50f88f8a6cebe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_history" DROP CONSTRAINT "FK_8799ccb4b093b6880d8cef9ec6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_channel" DROP CONSTRAINT "FK_477cba058cae3c484caefc503e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_channel" DROP CONSTRAINT "FK_32e4f87107693b745d6da9cd44f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_de44ed71836e81c3fca3dc7fc5c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "referral" DROP CONSTRAINT "FK_ec295d220eaab068ed5147e8582"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_71fb36906595c602056d936fc13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4921fd5bcc89a1c55fda4fc5ee"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_00a6518a5901679b2afcfb87b8"`,
    );
    await queryRunner.query(`DROP TABLE "user_niches_niche"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_549a828f3e9504aed8572234df"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b5a354512d266899cbf6926a07"`,
    );
    await queryRunner.query(`DROP TABLE "user_languages_language"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_936afd72159ca6d1143ab3d66a"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_331665e2e7d360bf2b715dfeea"`,
    );
    await queryRunner.query(`DROP TABLE "user_categories_category"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7df7d1e250ea2a416f078a631f"`,
    );
    await queryRunner.query(`DROP TABLE "language"`);
    await queryRunner.query(`DROP TABLE "card"`);
    await queryRunner.query(`DROP TABLE "media"`);
    await queryRunner.query(`DROP TYPE "public"."media_type_enum"`);
    await queryRunner.query(`DROP TABLE "portfolio"`);
    await queryRunner.query(`DROP TABLE "niche"`);
    await queryRunner.query(`DROP INDEX "public"."idx_creator_price"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a74ad7ed0c64e8849a58623e91"`,
    );
    await queryRunner.query(`DROP TABLE "creator_service"`);
    await queryRunner.query(`DROP TABLE "booking_item"`);
    await queryRunner.query(`DROP TABLE "booking"`);
    await queryRunner.query(`DROP TABLE "review_creator"`);
    await queryRunner.query(`DROP TABLE "review_brand"`);
    await queryRunner.query(`DROP TABLE "wallet"`);
    await queryRunner.query(`DROP TABLE "payout_history"`);
    await queryRunner.query(`DROP TYPE "public"."payout_history_status_enum"`);
    await queryRunner.query(`DROP TABLE "cart"`);
    await queryRunner.query(`DROP TABLE "cart_item"`);
    await queryRunner.query(`DROP TABLE "billing"`);
    await queryRunner.query(`DROP TABLE "payment_history"`);
    await queryRunner.query(`DROP TYPE "public"."payment_history_type_enum"`);
    await queryRunner.query(`DROP TYPE "public"."payment_history_status_enum"`);
    await queryRunner.query(`DROP INDEX "public"."idx_creator_followers"`);
    await queryRunner.query(`DROP INDEX "public"."idx_creator_contentType"`);
    await queryRunner.query(`DROP TABLE "social_channel"`);
    await queryRunner.query(
      `DROP TYPE "public"."social_channel_platform_enum"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_service_platform"`);
    await queryRunner.query(`DROP INDEX "public"."idx_service_name"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1712c3f7635a5fad5e9e39a4ad"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7806a14d42c3244064b4a1706c"`,
    );
    await queryRunner.query(`DROP TABLE "service"`);
    await queryRunner.query(`DROP TYPE "public"."service_platform_enum"`);
    await queryRunner.query(`DROP INDEX "public"."idx_creator_category"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_23c05c292c439d77b0de816b50"`,
    );
    await queryRunner.query(`DROP TABLE "category"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_31ef2b4d30675d0c15056b7f6e"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_creator_country"`);
    await queryRunner.query(`DROP INDEX "public"."idx_craeator_city"`);
    await queryRunner.query(`DROP INDEX "public"."idx_creator_age"`);
    await queryRunner.query(`DROP INDEX "public"."idx_creator_gender"`);
    await queryRunner.query(`DROP INDEX "public"."idx_creator_ethnicity"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1ac5eabc8849a787948c3a32b6"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1f457efff42e9e3d54598c4bd8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5cb2b3e0419a73a360d327d497"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b964abf615cd68203dc3a0880c"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_gender_enum"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
    await queryRunner.query(`DROP TABLE "referral"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(`DROP TABLE "token"`);
  }
}

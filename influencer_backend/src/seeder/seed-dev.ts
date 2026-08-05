import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource, In } from 'typeorm';
import { ContentType } from '../common/enums/contentType.enum';
import { Creator } from '../modules/creator/entities/creator.entity';
import { Portfolio } from '../modules/portfolio/entities/portfolio.entity';
import { SocialChannel } from '../modules/social-channel/entities/social-channel.entity';
import { Media } from '../modules/media/entities/media.entity';
import { MediaType } from '../common/enums/mediaType.enum';
import { UserRole } from '../common/enums/user-role.enum';
import * as bcrypt from 'bcrypt';
import { genderType } from '../common/enums/genderType.enum';
import { Service } from '../modules/service/entities/service.entity';
import { DurationUnit } from '../common/enums/durationUnit.enum';
import { Brand } from '../modules/brand/entities/brand.entity';
import { CreatorService } from '../modules/creator-service/entities/creator-service.entity';
import { Category } from '../modules/category/category.entity';
import { User } from '../modules/user/entities/user.entity';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🔄 Resetting database for development...');

  await dataSource.query(`
    TRUNCATE TABLE
      review_creator,
      review_brand,
      booking_item,
      creator_service,
      portfolio,
      social_channel,
      media,
      "user"
    RESTART IDENTITY CASCADE;
  `);

  const creatorRepo = dataSource.getRepository(Creator);
  const portfolioRepo = dataSource.getRepository(Portfolio);
  const socialRepo = dataSource.getRepository(SocialChannel);
  const mediaRepo = dataSource.getRepository(Media);
  const creatorServiceRepo = dataSource.getRepository(CreatorService);
  const serviceRepo = dataSource.getRepository(Service);
  const brandRepo = dataSource.getRepository(Brand);
  const categoryRepo = dataSource.getRepository(Category);
  const userRepo = dataSource.getRepository(User);

  // ===== CREATORS =====
  const creatorsData = [
    {
      name: 'Test Influencer',
      username: 'testinfluencer',
      email: 'testInfluencer@example.com',
      title: 'Tech & Lifestyle Influencer',
      description:
        'Helping brands connect with millennials through tech content.',
      gender: genderType.FEMALE,
      starRating: 4,
      location: 'New York',
      city: 'New York',
      country: 'USA',
      socials: [
        {
          platform: ContentType.YOUTUBE,
          url: 'https://youtube.com/testinfluencer',
          followers: 20000,
          username: 'testinfluencer',
        },
      ],
      portfolio: [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3',
      ],
      media: [
        {
          type: MediaType.PROFILE_PICTURE,
          url: 'https://picsum.photos/200/200?profile',
        },
        {
          type: MediaType.COVER_PICTURE,
          url: 'https://picsum.photos/1200/400?cover',
        },
        {
          type: MediaType.OTHER,
          url: 'https://picsum.photos/400/300?gallery1',
        },
        {
          type: MediaType.OTHER,
          url: 'https://picsum.photos/400/300?gallery2',
        },
        {
          type: MediaType.OTHER,
          url: 'https://picsum.photos/400/300?gallery3',
        },
      ],
    },
    {
      name: 'Fashion Guru',
      username: 'fashionguru',
      email: 'fashionguru@example.com',
      title: 'Fashion & Beauty Influencer',
      description: 'Sharing style tips and beauty routines worldwide.',
      gender: genderType.FEMALE,
      starRating: 5,
      location: 'Los Angeles',
      city: 'Los Angeles',
      country: 'USA',
      socials: [
        {
          platform: ContentType.TIKTOK,
          url: 'https://tiktok.com/fashionguru',
          followers: 50000,
          username: 'fashionguru',
        },
      ],
      portfolio: [
        'https://picsum.photos/400/300?fashion1',
        'https://picsum.photos/400/300?fashion2',
      ],
      media: [
        {
          type: MediaType.PROFILE_PICTURE,
          url: 'https://picsum.photos/200/200?fashion',
        },
      ],
    },
    {
      name: 'Travel Explorer',
      username: 'travelexplorer',
      email: 'travelexplorer@example.com',
      title: 'Travel & Adventure Blogger',
      description: 'Exploring new destinations and cultures.',
      gender: genderType.MALE,
      starRating: 4,
      location: 'Miami',
      city: 'Miami',
      country: 'USA',
      socials: [
        {
          platform: ContentType.INSTAGRAM,
          url: 'https://instagram.com/travelexplorer',
          followers: 8000,
          username: 'travelexplorer',
        },
      ],
      portfolio: [
        'https://picsum.photos/400/300?travel1',
        'https://picsum.photos/400/300?travel2',
      ],
      media: [
        {
          type: MediaType.PROFILE_PICTURE,
          url: 'https://picsum.photos/200/200?travel',
        },
      ],
    },
    {
      name: 'Test1 Influencer',
      username: 'test1influencer',
      email: 'test1Influencer@example.com',
      title: 'Tech & Lifestyle Influencer',
      description:
        'Helping brands connect with millennials through tech content.',
      gender: genderType.FEMALE,
      starRating: 4,
      location: 'tunis',
      city: 'tunis',
      country: 'tunisia',
      socials: [
        {
          platform: ContentType.YOUTUBE,
          url: 'https://youtube.com/testinfluencer',
          followers: 20000,
          username: 'test1influencer',
        },
      ],
      portfolio: [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3',
      ],
      media: [
        {
          type: MediaType.PROFILE_PICTURE,
          url: 'https://picsum.photos/200/200?profile',
        },
        {
          type: MediaType.COVER_PICTURE,
          url: 'https://picsum.photos/1200/400?cover',
        },
        {
          type: MediaType.OTHER,
          url: 'https://picsum.photos/400/300?gallery1',
        },
        {
          type: MediaType.OTHER,
          url: 'https://picsum.photos/400/300?gallery2',
        },
        {
          type: MediaType.OTHER,
          url: 'https://picsum.photos/400/300?gallery3',
        },
      ],
    },
    {
      name: 'Test4 Influencer',
      username: 'test4influencer',
      email: 'test4Influencer@example.com',
      title: 'Tech & Lifestyle Influencer',
      description:
        'Helping brands connect with millennials through tech content.',
      gender: genderType.FEMALE,
      starRating: 4,
      location: 'New York',
      city: 'New York',
      country: 'USA',
      socials: [
        {
          platform: ContentType.YOUTUBE,
          url: 'https://youtube.com/testinfluencer',
          followers: 1000,
          username: 'tes4tinfluencer',
        },
      ],
      portfolio: [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3',
      ],
      media: [
        {
          type: MediaType.PROFILE_PICTURE,
          url: 'https://picsum.photos/200/200?profile',
        },
        {
          type: MediaType.COVER_PICTURE,
          url: 'https://picsum.photos/1200/400?cover',
        },
        {
          type: MediaType.OTHER,
          url: 'https://picsum.photos/400/300?gallery1',
        },
        {
          type: MediaType.OTHER,
          url: 'https://picsum.photos/400/300?gallery2',
        },
        {
          type: MediaType.OTHER,
          url: 'https://picsum.photos/400/300?gallery3',
        },
      ],
    },
    {
      name: 'Test8 Influencer',
      username: 'test8influencer',
      email: 'test8Influencer@example.com',
      title: 'Tech & Lifestyle Influencer',
      description:
        'Helping brands connect with millennials through tech content.',
      gender: genderType.MALE,
      starRating: 4,
      location: 'Europe',
      city: 'paris',
      country: 'France',
      socials: [
        {
          platform: ContentType.YOUTUBE,
          url: 'https://youtube.com/testinfluencer',
          followers: 20000,
          username: 'test8influencer',
        },
      ],
      portfolio: [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3',
      ],
      media: [
        {
          type: MediaType.PROFILE_PICTURE,
          url: 'https://picsum.photos/200/200?profile',
        },
        {
          type: MediaType.COVER_PICTURE,
          url: 'https://picsum.photos/1200/400?cover',
        },
        {
          type: MediaType.OTHER,
          url: 'https://picsum.photos/400/300?gallery1',
        },
        {
          type: MediaType.OTHER,
          url: 'https://picsum.photos/400/300?gallery2',
        },
        {
          type: MediaType.OTHER,
          url: 'https://picsum.photos/400/300?gallery3',
        },
      ],
    },
    {
      name: 'Test Influencer9',
      username: 'testinfluencer9',
      email: 'testInfluencer9@example.com',
      title: 'Tech & Lifestyle Influencer',
      description:
        'Helping brands connect with millennials through tech content.',
      gender: genderType.FEMALE,
      starRating: 4,
      location: 'New York',
      city: 'New York',
      country: 'USA',
      socials: [
        {
          platform: ContentType.YOUTUBE,
          url: 'https://youtube.com/testinfluencer',
          followers: 20000,
          username: 'test9influencer',
        },
      ],
      portfolio: [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3',
      ],
      media: [
        {
          type: MediaType.PROFILE_PICTURE,
          url: 'https://picsum.photos/200/200?profile',
        },
        {
          type: MediaType.COVER_PICTURE,
          url: 'https://picsum.photos/1200/400?cover',
        },
        {
          type: MediaType.OTHER,
          url: 'https://picsum.photos/400/300?gallery1',
        },
        {
          type: MediaType.OTHER,
          url: 'https://picsum.photos/400/300?gallery2',
        },
        {
          type: MediaType.OTHER,
          url: 'https://picsum.photos/400/300?gallery3',
        },
      ],
    },
  ];

  const savedCreators = [];
  for (const data of creatorsData) {
    const creator = creatorRepo.create({
      name: data.name,
      username: data.username,
      email: data.email,
      password: await bcrypt.hash('test', 10),
      role: UserRole.CREATOR,
      isVerified: true,
      profileComplete: true,
      title: data.title,
      description: data.description,
      gender: data.gender,
      starRating: data.starRating,
      location: data.location,
      city: data.city,
      country: data.country,
    });
    await creatorRepo.save(creator);

    // socials
    const socials = socialRepo.create(
      data.socials.map((s) => ({ ...s, creator })),
    );
    await socialRepo.save(socials);

    // portfolio
    const portfolio = portfolioRepo.create(
      data.portfolio.map((url) => ({ creatorId: creator.id, url })),
    );
    await portfolioRepo.save(portfolio);

    // media
    const mediaList = mediaRepo.create(
      data.media.map((m) => ({ ...m, creator })),
    );
    await mediaRepo.save(mediaList);

    savedCreators.push(creator);
  }

  // ===== BRANDS =====
  const categoriesToAssign = await categoryRepo.find({
    where: { name: In(['technology', 'fashion']) },
  });

  const brandsData = [
    {
      name: 'Test Brand',
      username: 'testbrand',
      email: 'testBrand@example.com',
      brandName: 'Test Brand Inc.',
      brandRole: 'Marketing Manager',
      logoUrl: 'https://picsum.photos/200/200?logo',
      description: 'We are a leading brand in tech accessories.',
      industry: 'Technology',
      targetPlatforms: ['instagram', 'tiktok'],
      piecesOfContentPerMonth: 10,
      annualBudget: 50000,
    },
    {
      name: 'Fashion House',
      username: 'fashionhouse',
      email: 'fashionhouse@example.com',
      brandName: 'Fashion House Ltd.',
      brandRole: 'PR Manager',
      logoUrl: 'https://picsum.photos/200/200?logo2',
      description: 'Luxury fashion brand collaborating with influencers.',
      industry: 'Fashion',
      targetPlatforms: ['instagram'],
      piecesOfContentPerMonth: 15,
      annualBudget: 80000,
    },
    {
      name: 'Eco Tech',
      username: 'ecotech',
      email: 'ecotech@example.com',
      brandName: 'Eco Tech Solutions',
      brandRole: 'Brand Manager',
      logoUrl: 'https://picsum.photos/200/200?logo3',
      description: 'Sustainable technology products for everyday life.',
      industry: 'Technology',
      targetPlatforms: ['youtube', 'tiktok'],
      piecesOfContentPerMonth: 5,
      annualBudget: 30000,
    },
    {
      name: 'TravelCo',
      username: 'travelco',
      email: 'travelco@example.com',
      brandName: 'TravelCo International',
      brandRole: 'Social Media Coordinator',
      logoUrl: 'https://picsum.photos/200/200?logo4',
      description: 'Connecting explorers with unique destinations.',
      industry: 'Travel',
      targetPlatforms: ['instagram', 'youtube'],
      piecesOfContentPerMonth: 20,
      annualBudget: 120000,
    },
  ];

  for (const data of brandsData) {
    const brand = brandRepo.create({
      ...data,
      password: await bcrypt.hash('test', 10),
      role: UserRole.BRAND,
      isVerified: true,
      profileComplete: true,
      categories: categoriesToAssign,
    });
    await brandRepo.save(brand);
  }
  // ===== ADMIN =====
  const adminUser = userRepo.create({
    name: 'Admin User',
    username: 'admin',
    email: 'admin@example.com',
    password: await bcrypt.hash('admin', 10),
    role: UserRole.ADMIN,
    isVerified: true,
    profileComplete: true,
  });
  await userRepo.save(adminUser);

  // ===== CREATOR SERVICES =====
  const services = await serviceRepo.find();
  if (services.length === 0) {
    throw new Error('No services found to link to CreatorService');
  }

  for (const creator of savedCreators) {
    const creatorServicesData = services.slice(0, 3).map((service, index) => ({
      creatorId: creator.id,
      serviceId: service.id,
      price: 50 + index * 20,
      description: `Description for ${service.name}`,
      quantity: 1 + index,
      duration: 30 + index * 15,
      durationUnit: DurationUnit.MINUTES,
    }));
    const creatorServices = creatorServiceRepo.create(creatorServicesData);
    await creatorServiceRepo.save(creatorServices);
  }

  console.log('✅ Dev Seeding complete');
  await app.close();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
});

import { Service } from '../modules/service/entities/service.entity';
import { DataSource } from 'typeorm';
import { ContentType } from '../common/enums/contentType.enum';
import { Category } from '../modules/category/category.entity';

const services = [
  {
    name: 'Instagram Photo Feed Post',
    platform: ContentType.INSTAGRAM,
    hasDuration: false,
  },
  {
    name: 'Instagram Reel',
    platform: ContentType.INSTAGRAM,
    hasDuration: true,
  },
  {
    name: 'Instagram Story',
    platform: ContentType.INSTAGRAM,
    hasDuration: false,
  },
  {
    name: 'Instagram Live',
    platform: ContentType.INSTAGRAM,
    hasDuration: true,
  },
  { name: 'TikTok Video', platform: ContentType.TIKTOK, hasDuration: true },
  { name: 'TikTok Story', platform: ContentType.TIKTOK, hasDuration: false },
  { name: 'TikTok Live', platform: ContentType.TIKTOK, hasDuration: true },
  { name: 'UGC Product Video', platform: ContentType.UGC, hasDuration: true },
  { name: 'UGC Product Photo', platform: ContentType.UGC, hasDuration: false },
  { name: 'UGC Video Ad', platform: ContentType.UGC, hasDuration: true },
  { name: 'UGC Photo Ad', platform: ContentType.UGC, hasDuration: false },
  { name: 'UGC Tutorial', platform: ContentType.UGC, hasDuration: true },
  {
    name: 'UGC Testimonial/Review',
    platform: ContentType.UGC,
    hasDuration: true,
  },
  { name: 'UGC Unboxing', platform: ContentType.UGC, hasDuration: true },
  { name: 'UGC Blog', platform: ContentType.UGC, hasDuration: false },
  { name: 'YouTube Video', platform: ContentType.YOUTUBE, hasDuration: true },
  { name: 'YouTube Short', platform: ContentType.YOUTUBE, hasDuration: true },
  {
    name: 'YouTube Livestream',
    platform: ContentType.YOUTUBE,
    hasDuration: true,
  },
  { name: 'Twitter Tweet', platform: ContentType.TWITTER, hasDuration: false },
  { name: 'Twitter Thread', platform: ContentType.TWITTER, hasDuration: false },
  {
    name: 'Twitter Retweet',
    platform: ContentType.TWITTER,
    hasDuration: false,
  },
  {
    name: 'Twitch Livestream',
    platform: ContentType.TWITCH,
    hasDuration: true,
  },
];

const categories = [
  { name: 'fashion', label: 'Fashion' },
  { name: 'beauty', label: 'Beauty' },
  { name: 'travel', label: 'Travel' },
  { name: 'health_fitness', label: 'Health & Fitness' },
  { name: 'food_drink', label: 'Food & Drink' },
  { name: 'comedy_entertainment', label: 'Comedy & Entertainment' },
  { name: 'art_photography', label: 'Art & Photography' },
  { name: 'music_dance', label: 'Music & Dance' },
  { name: 'family_children', label: 'Family & Children' },
  { name: 'entrepreneur_business', label: 'Entrepreneur & Business' },
  { name: 'animals_pets', label: 'Animals & Pets' },
  { name: 'education', label: 'Education' },
  { name: 'adventure_outdoors', label: 'Adventure & Outdoors' },
  { name: 'athlete_sports', label: 'Athlete & Sports' },
  { name: 'technology', label: 'Technology' },
  { name: 'gaming', label: 'Gaming' },
  { name: 'healthcare', label: 'Healthcare' },
  { name: 'automotive', label: 'Automotive' },
  { name: 'skilled_trades', label: 'Skilled Trades' },
  { name: 'ecommerce', label: 'Ecommerce' },
];

export async function seedData(dataSource: DataSource) {
  const repo = dataSource.getRepository(Service);

  for (const s of services) {
    const existingService = await repo.findOne({ where: { name: s.name } });
    if (existingService) {
      // Update the hasDuration value if it changed
      if (existingService.hasDuration !== s.hasDuration) {
        existingService.hasDuration = s.hasDuration;
        await repo.save(existingService);
        console.log(`🔄 Updated service: ${s.name}`);
      }
    } else {
      await repo.save(repo.create(s));
      console.log(`✅ Inserted service: ${s.name}`);
    }
    const repoCategory = dataSource.getRepository(Category);
    const existingCategories = await repoCategory.find();
    const existingValues = new Set(existingCategories.map((c) => c.name));

    const toInsertCategories = categories
      .filter((c) => !existingValues.has(c.name))
      .map((c) => repoCategory.create(c));
    if (toInsertCategories.length) {
      await repoCategory.save(toInsertCategories);
      console.log(`✅ Seeded ${toInsertCategories.length} new categories`);
    } else {
      console.log('ℹ️ All categories already exist, skipping seeding');
    }
  }
}

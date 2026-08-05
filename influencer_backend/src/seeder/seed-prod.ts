import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { seedData } from './seed-data';

async function seedProd() {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error('This script is for production only');
  }
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('Running static data seeds...');

  await seedData(dataSource); // This should check if services already exist

  console.log('✅ Static data seeding complete');
  await app.close();
}

seedProd().catch((err) => {
  console.error('❌ Seeding failed:', err);
});
export default seedProd;

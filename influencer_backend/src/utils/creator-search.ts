import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { SearchCreatorDto } from '../modules/creator/dto/search-creators.dto';

export function addJoins<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  entity: 'creator' | 'brand' | 'user',
) {
  if (entity === 'creator') {
    qb.leftJoinAndSelect('creator.categories', 'category')
      .leftJoinAndSelect('creator.creatorServices', 'creatorService')
      .leftJoinAndSelect('creatorService.service', 'service')
      .leftJoinAndSelect('creator.media', 'media');
  }
}

export function applyFilters<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  dto: SearchCreatorDto,
) {
  const {
    name,
    category,
    country,
    city,
    ageMin,
    ageMax,
    priceMin,
    priceMax,
    gender,
    ethnicity,
    contentType,
    keyword,
  } = dto;

  // Filtre sur plateforme → service + social

  if (category) {
    qb.andWhere('category.name ILIKE :category', {
      category: `%${dto.category}%`,
    });
  }

  if (country)
    qb.andWhere('creator.country ILIKE :country', {
      country: `%${dto.country}%`,
    });
  if (city) qb.andWhere('creator.city ILIKE :city', { city: `%${dto.city}%` });

  if (ageMin) qb.andWhere('creator.age >= :ageMin', { ageMin: dto.ageMin });
  if (ageMax) qb.andWhere('creator.age <= :ageMax', { ageMax: dto.ageMax });

  if (gender) qb.andWhere('creator.gender = :gender', { gender: dto.gender });
  if (ethnicity)
    qb.andWhere('creator.ethnicity ILIKE :ethnicity', {
      ethnicity: `%${dto.ethnicity}%`,
    });

  if (name)
    qb.andWhere('creator.name ILIKE :name', {
      name: `%${dto.name}%`,
    });

  if (contentType)
    qb.andWhere('service.name ILIKE :contentType', {
      contentType: `%${dto.contentType}%`,
    });

  if (priceMin)
    qb.andWhere('creatorService.price >= :priceMin', {
      priceMin: dto.priceMin,
    });
  if (priceMax)
    qb.andWhere('creatorService.price <= :priceMax', {
      priceMax: dto.priceMax,
    });

  if (keyword) {
    qb.andWhere(
      '(creator.name ILIKE :kw OR creator.description ILIKE :kw OR category.name ILIKE :kw)',
      { kw: `%${keyword}%` },
    );
  }
}

export function applyPagination<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  dto: SearchCreatorDto,
) {
  const { page, limit } = dto;
  qb.skip((page - 1) * limit).take(limit);
}

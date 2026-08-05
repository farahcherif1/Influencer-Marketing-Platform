import { SelectQueryBuilder } from 'typeorm';
import { Brand } from '../modules/brand/entities/brand.entity';
import { SearchBrandDto } from '../modules/brand/dto/search-brand.dto';
export function applyBrandFilters(
  qb: SelectQueryBuilder<Brand>,
  dto: SearchBrandDto,
) {
  if (dto.name) {
    qb.andWhere('brand.name ILIKE :name', { name: `%${dto.name}%` });
  }

  if (dto.brandName) {
    qb.andWhere('brand.brandName ILIKE :brandName', {
      brandName: `%${dto.brandName}%`,
    });
  }

  if (dto.platform) {
    qb.andWhere('brand.platform = :platform', { platform: dto.platform });
  }

  if (dto.category) {
    qb.andWhere('brand.category = :category', { category: dto.category });
  }

  if (dto.industry) {
    qb.andWhere('brand.industry ILIKE :industry', {
      industry: `%${dto.industry}%`,
    });
  }
  if (dto.keyword) {
    qb.andWhere(
      `(brand.name ILIKE :keyword 
        OR brand.brandName ILIKE :keyword 
        OR brand.username ILIKE :keyword 
        OR brand.email ILIKE :keyword)`,
      { keyword: `%${dto.keyword}%` },
    );
  }

  return qb;
}

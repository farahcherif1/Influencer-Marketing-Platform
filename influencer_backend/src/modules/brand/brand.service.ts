import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Category } from '../category/category.entity';
import { Repository, In } from 'typeorm';
import { CreateBrandDto } from './dto/create-brand.dto';
import { SearchBrandDto } from './dto/search-brand.dto';
import { addJoins } from '../../utils/creator-search';
import { deleteResponse } from 'types/api-responses';
import { applyBrandFilters } from '../../utils/brand-filters.helper';
import { PaginatedResult } from '../../modules/creator/dto/search-result.dto';
import { Booking } from '../booking/entities/booking.entity';
import { BookingItem } from '../booking-item/entities/booking-item.entity';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { S3Service } from '../../s3/s3.service';
import { BrandDto } from './dto/brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepo: Repository<Brand>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    private readonly s3Service: S3Service,
  ) {}
  async deleteBrand(email: string): Promise<deleteResponse> {
    if (!email) {
      throw new NotFoundException('Email query parameter is required');
    }
    const brand = await this.brandRepo.findOne({
      where: { email },
    });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    if (brand.logoKey) {
      await this.s3Service.deleteFile(brand.logoKey);
    }

    if (brand.coverKey) {
      await this.s3Service.deleteFile(brand.coverKey);
    }

    await this.brandRepo.remove(brand);
    return {
      message: 'Brand deleted successfully',
      status: true,
      statusCode: 200,
    };
  }
  async getBrandsCount(): Promise<number> {
    return this.brandRepo.count();
  }
  async updatePartialBrand(id: number, dto: Partial<CreateBrandDto>) {
    const brand = await this.brandRepo.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!brand) throw new NotFoundException('Brand not found');

    if (dto.brandRole !== undefined) {
      brand.brandRole = dto.brandRole;
    }
    if (dto.logoUrl !== undefined) {
      brand.logoUrl = dto.logoUrl;
    }
    if (dto.description !== undefined) {
      brand.description = dto.description;
    }
    if (dto.industry !== undefined) {
      brand.industry = dto.industry;
    }
    if (dto.targetPlatforms !== undefined) {
      brand.targetPlatforms = dto.targetPlatforms;
    }
    if (dto.piecesOfContentPerMonth !== undefined) {
      brand.piecesOfContentPerMonth = dto.piecesOfContentPerMonth;
    }
    if (dto.annualBudget !== undefined) {
      brand.annualBudget = dto.annualBudget;
    }

    if (dto.categoryIds && dto.categoryIds.length > 0) {
      const categories = await this.categoryRepo.find({
        where: { id: In(dto.categoryIds) },
      });
      brand.categories = categories;
    }

    return await this.brandRepo.save(brand);
  }

  async findById(brandId: number): Promise<Brand> {
    const brand = await this.brandRepo.findOne({
      where: { id: brandId },
      relations: ['socialChannels'],
    });

    if (!brand) {
      throw new NotFoundException(`Brand with id ${brandId} not found`);
    }
    return brand;
  }

  async findByUserName(userName: string): Promise<BrandDto> {
    const brand = await this.brandRepo.findOne({
      where: { username: userName },
      relations: [
        'socialChannels',
        'cart',
        'wallet',
        'billing',
        'bookings',
        'writtenCreatorReviews',
        'receivedReviews',
        'categories',
      ],
    });
    if (!brand) {
      throw new NotFoundException(`Brand with username ${userName} not found`);
    }
    const logoUrl = brand.logoKey
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await this.s3Service.getSignedUrlForGet(brand.logoKey)
      : undefined;

    const coverPhotoUrl = brand.coverKey
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await this.s3Service.getSignedUrlForGet(brand.coverKey)
      : undefined;

    return {
      id: brand.id,
      username: brand.username,
      email: brand.email,
      brandName: brand.brandName,
      brandRole: brand.brandRole,
      logoUrl,
      coverPhotoUrl,
      description: brand.description,
      industry: brand.industry,
      targetPlatforms: brand.targetPlatforms,
      piecesOfContentPerMonth: brand.piecesOfContentPerMonth,
      annualBudget: brand.annualBudget,
      location: brand.location,
      categories: brand.categories,
      socialChannels: brand.socialChannels,
      cart: brand.cart,
      wallet: brand.wallet,
      billing: brand.billing,
      bookings: brand.bookings,
      writtenCreatorReviews: brand.writtenCreatorReviews,
      receivedReviews: brand.receivedReviews,
    };
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandRepo.findOne({
      where: { id },
      relations: [
        'socialChannels',
        'cart',
        'wallet',
        'billing',
        'bookings',
        'writtenCreatorReviews',
        'receivedReviews',
        'categories',
      ],
    });
    if (!brand) throw new NotFoundException('Brand not found');
    const logoUrl = brand.logoKey
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await this.s3Service.getSignedUrlForGet(brand.logoKey)
      : undefined;
    const coverPhotoUrl = brand.coverKey
      ? // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await this.s3Service.getSignedUrlForGet(brand.coverKey)
      : undefined;
    brand.logoUrl = logoUrl;
    brand.coverPhotoUrl = coverPhotoUrl;
    return brand;
  }
  async searchBrands(dto: SearchBrandDto): Promise<PaginatedResult<any>> {
    const page = dto.page;
    const limit = dto.limit;

    const qb = this.brandRepo.createQueryBuilder('brand').distinct(true);

    addJoins(qb, 'brand');
    applyBrandFilters(qb, dto)
      .skip((page - 1) * limit)
      .take(limit);

    const [brands, total] = await qb.getManyAndCount();

    const data = brands.map((b) => ({
      id: b.id,
      name: b.name,
      email: b.email,
      username: b.username,
      brandName: b.brandName,
      industry: b.industry,

      isVerified: b.isVerified,
      profileComplete: b.profileComplete,
      referralCode: b.referralCode,
      description: b.description,
    }));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBookings(brandId: number): Promise<BookingItem[]> {
    const brand = await this.brandRepo.findOneBy({ id: brandId });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    // Step 1: find all bookings of this brand
    const bookings = await this.bookingRepo.find({
      where: { brandId },
      relations: ['bookingItems'],
    });

    if (bookings.length === 0) {
      return [];
    }

    // Step 2: flatten all bookingItems across the bookings
    const bookingItems = bookings.flatMap((booking) => booking.bookingItems);

    return bookingItems;
  }
  async updateProfilePicture(brandId: number, file: Express.Multer.File) {
    const brand = await this.brandRepo.findOne({ where: { id: brandId } });
    if (!brand) throw new NotFoundException('Brand not found');
    const key = await this.s3Service.uploadFile(file, 'brands/profile');
    brand.logoKey = key;
    await this.brandRepo.save(brand);

    const logoUrl = await this.s3Service.getSignedUrlForGet(key);
    return { logoUrl };
  }

  async updateCoverPicture(brandId: number, file: Express.Multer.File) {
    const brand = await this.brandRepo.findOne({ where: { id: brandId } });
    if (!brand) throw new NotFoundException('Brand not found');
    const key = await this.s3Service.uploadFile(file, 'brands/cover');
    brand.coverKey = key;
    await this.brandRepo.save(brand);

    const coverPhotoUrl = await this.s3Service.getSignedUrlForGet(key);
    return { coverPhotoUrl };
  }
  async findAll(): Promise<Brand[]> {
    return this.brandRepo.find();
  }
  async updateBrand(id: number, updateDto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findById(id);
    if (!brand) throw new Error('Brand not found');

    if (updateDto.categoryIds !== undefined) {
      const categories = await this.categoryRepo.findBy({
        id: In(updateDto.categoryIds),
      });
      brand.categories = categories;
    }
    let city: string | null = null;
    let country: string | null = null;

    if (updateDto.location) {
      const parts = updateDto.location.split(',').map((p) => p.trim());
      if (parts.length > 1) {
        city = parts[0];
        country = parts[parts.length - 1];
      } else {
        city = updateDto.location;
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { categoryIds, ...rest } = updateDto;
    Object.assign(brand, {
      ...rest,
      ...(city && { city }),
      ...(country && { country }),
    });
    return this.brandRepo.save(brand);
  }
}

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Creator } from './entities/creator.entity';
import {
  CreateCategoryIdsDto,
  CreateDescriptionDto,
  CreateGenderDto,
  CreateLocationDto,
  CreatePhoneNumberDto,
  CreateTitleDto,
  CreateUsernameDto,
} from './dto/create-creator.dto';
import { SocialChannel } from '../social-channel/entities/social-channel.entity';
import { CreateSocialChannelDto } from '../social-channel/dto/create-social-channel.dto';
import { ContentType } from '../../common/enums/contentType.enum';
import { Media } from '../media/entities/media.entity';
import { CreateMediaDto } from '../media/dto/create-media.dto';
import { UpdateCreatorDto } from './dto/update-creator.dto';
import * as bcrypt from 'bcrypt';
import { Service } from '../service/entities/service.entity';
import { CreateCreatorServiceDto } from '../creator-service/dto/create-creator-service.dto';
import { CreatorServiceService } from '../creator-service/creator-service.service';
import { CreatorService as CreatorServiceEntity } from '../creator-service/entities/creator-service.entity';
import {
  UpdateAccountResponse,
  deleteResponse,
} from '../../types/api-responses';
import { Category } from '../category/category.entity';
import { SearchCreatorDto } from './dto/search-creators.dto';
import {
  /*{buildCacheKey},*/ applyFilters,
  addJoins,
} from '../../utils/creator-search';
import { PaginatedResult, SearchCreatorResult } from './dto/search-result.dto';
import { homepageProfiles } from '../../config/homePage-profiles';
import { BookingItem } from '../../modules/booking-item/entities/booking-item.entity';
import {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Portfolio } from '../portfolio/entities/portfolio.entity';

@Injectable()
export class CreatorService {
  private s3: S3Client;
  private bucketName = process.env.AWS_S3_BUCKET;

  constructor(
    @InjectRepository(Creator)
    private readonly creatorRepository: Repository<Creator>,
    private readonly creatorServiceService: CreatorServiceService,

    @InjectRepository(SocialChannel)
    private readonly socialChannelRepository: Repository<SocialChannel>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,

    @InjectRepository(CreatorServiceEntity)
    private readonly creatorServiceRepository: Repository<CreatorServiceEntity>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(BookingItem)
    private readonly bookingItemRepository: Repository<BookingItem>,

    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
  ) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  private async generatePresignedUrl(key: string, expiresIn = 3600) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });
      return await getSignedUrl(this.s3, command, { expiresIn });
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      return null; // Return null if URL generation fails
    }
  }

  findAll() {
    return this.creatorRepository.find({
      relations: ['socialChannels', 'media'],
    });
  }
  async getCreatorsCount(): Promise<number> {
    return this.creatorRepository.count();
  }

  async removeCreatorMediaFromS3(creatorId: number) {
    const mediaList = await this.mediaRepository.find({
      where: { creatorId },
    });

    if (!mediaList.length) return;

    for (const media of mediaList) {
      if (media.s3Key) {
        try {
          await this.s3.send(
            new DeleteObjectCommand({
              Bucket: this.bucketName,
              Key: media.s3Key,
            }),
          );
        } catch (err) {
          console.error(`Failed to delete from S3: ${media.s3Key}`, err);
        }
      }
    }
  }

  async removeCreatorPortfolioFromS3(creatorId: number) {
    const portfolioItems = await this.portfolioRepository.find({
      where: { creatorId },
    });

    if (!portfolioItems.length) return;

    for (const item of portfolioItems) {
      if (item.s3Key) {
        try {
          await this.s3.send(
            new DeleteObjectCommand({
              Bucket: this.bucketName,
              Key: item.s3Key,
            }),
          );
        } catch (err) {
          console.error(
            `Failed to delete portfolio from S3: ${item.s3Key}`,
            err,
          );
        }
      }
    }
  }

  async deleteCreator(email: string): Promise<deleteResponse> {
    if (!email) {
      throw new NotFoundException('Email query parameter is required');
    }
    const creator = await this.creatorRepository.findOne({
      where: { email },
    });
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    await this.removeCreatorMediaFromS3(creator.id);
    await this.removeCreatorPortfolioFromS3(creator.id);
    await this.creatorRepository.remove(creator);
    return {
      message: 'Creator deleted successfully',
      status: true,
      statusCode: 200,
    };
  }
  async searchCreator(
    dto: SearchCreatorDto,
  ): Promise<PaginatedResult<SearchCreatorResult>> {
    const page = dto.page;
    const limit = dto.limit;

    //  Base query: creators only
    const qb = this.creatorRepository
      .createQueryBuilder('creator')
      .distinct(true);
    addJoins(qb, 'creator');
    applyFilters(qb, dto);

    const creators = await qb.getMany();
    if (creators.length === 0) {
      return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }
    const creatorIds = creators.map((c) => c.id);

    // 2️⃣ Fetch social channels separately
    let channelsQuery = this.socialChannelRepository
      .createQueryBuilder('sc')
      .where('sc.creatorId IN (:...ids)', { ids: creatorIds });

    if (dto.platform) {
      channelsQuery = channelsQuery.andWhere('sc.platform = :platform', {
        platform: dto.platform,
      });
    }
    if (dto.followersMin) {
      channelsQuery = channelsQuery.andWhere('sc.followers >= :followersMin', {
        followersMin: dto.followersMin,
      });
    }
    if (dto.followersMax) {
      channelsQuery = channelsQuery.andWhere('sc.followers <= :followersMax', {
        followersMax: dto.followersMax,
      });
    }

    const socialChannels = await channelsQuery.getMany();

    // Map channels by creatorId
    const channelsMap = socialChannels.reduce(
      (acc, sc) => {
        const creatorId = sc.creatorId as number;
        if (!acc[creatorId]) acc[creatorId] = [];
        acc[creatorId].push({ platform: sc.platform, followers: sc.followers });
        return acc;
      },
      {} as Record<number, { platform: string; followers: number }[]>,
    );

    // 3️⃣ Map creators with followers, prices, images
    const dataWithFollowers = await Promise.all(
      creators.map(async (c) => {
        const filteredServices = c.creatorServices ?? [];
        const filteredMedia = c.media;

        // If platform filter exists, only keep services linked to that platform
        // if (dto.platform) {
        //   filteredServices = filteredServices; // no filtering by serviceId
        //   filteredMedia = filteredMedia; // no platform-specific filtering
        // }

        // Generate presigned URL for profile picture
        let profilePictureUrl = null;
        const profileMedia = filteredMedia.find(
          (m) => m.type === 'PROFILE_PICTURE',
        );
        if (profileMedia && profileMedia.s3Key) {
          profilePictureUrl = await this.generatePresignedUrl(
            profileMedia.s3Key,
          );
        }

        return {
          id: c.id,
          imageUrls: profilePictureUrl,
          name: c.name,
          username: c.username,
          age: c.age,
          gender: c.gender,
          email: c.email,
          title: c.title,
          city: c.city,
          country: c.country,
          rating: c.starRating ?? 0,
          isVerified: c.isVerified,
          referral: c.referralCode,
          profileComplete: c.profileComplete,
          prices: filteredServices.map((s) => ({
            price: s.price,
            platform: s.service?.platform ?? null, // if you have a platform relation in service
            contentType: s.service?.name ?? null,
          })),
          description: c.description,
          location: `${c.city ?? ''}, ${c.country ?? ''}`,
          followers:
            channelsMap[c.id]?.map((ch) => ({
              platform: ch.platform,
              followers: ch.followers,
            })) ?? [],
        };
      }),
    );

    //  Filter by platform if provided
    let filteredData = dataWithFollowers;

    // Apply platform + follower filters if needed
    if (dto.platform || dto.followersMin || dto.followersMax) {
      filteredData = dataWithFollowers.filter((c) =>
        c.followers.some((f) => {
          const minCheck = dto.followersMin
            ? f.followers >= dto.followersMin
            : true;
          const maxCheck = dto.followersMax
            ? f.followers <= dto.followersMax
            : true;
          const platformCheck = dto.platform
            ? f.platform === dto.platform
            : true;
          return minCheck && maxCheck && platformCheck;
        }),
      );
    }

    const totalAfterPlatform = filteredData.length;
    const totalPages = Math.ceil(totalAfterPlatform / limit);

    // Paginate
    const startIndex = (page - 1) * limit;
    const paginatedData = filteredData.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      meta: { total: totalAfterPlatform, page, limit, totalPages },
    };
  }
  async findOne(id: number): Promise<Creator> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid creator ID');
    }
    const creator = await this.creatorRepository.findOne({
      where: { id },
      relations: [
        'niches',
        'portfolio',
        'media',
        'socialChannels',
        'creatorServices',
        'receivedReviews',
        'writtenBrandReviews',
        'wallet',
      ],
    });

    if (!creator)
      throw new NotFoundException(`Creator with id ${id} not found`);
    return creator;
  }

  async updateProfile(creatorId: number, dto: UpdateCreatorDto) {
    const creator = await this.creatorRepository.findOne({
      where: { id: creatorId },
    });

    if (!creator) throw new NotFoundException('Creator not found');

    Object.assign(creator, dto);

    await this.creatorRepository.save(creator);

    return {
      message: 'Profile updated',
      creator: {
        id: creator.id,
        name: creator.name,
        location: creator.location,
        title: creator.title,
        description: creator.description,
        gender: creator.gender,
      },
    };
  }
  async updateAccount(
    email: string,
    dto: UpdateCreatorDto,
  ): Promise<UpdateAccountResponse> {
    const user = await this.creatorRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    let updated = false;
    let emailChanged = false;
    let passwordChanged = false;
    let message: string | null = null;

    // --- EMAIL UPDATE ---
    if (dto.email && dto.email !== user.email) {
      user.email = dto.email;
      updated = true;
      emailChanged = true;
    } else if (dto.email && dto.email === user.email) {
      message = 'Same email provided';
    }

    // --- PASSWORD UPDATE ---
    if (dto.password && dto.password.trim() !== '') {
      if (!user.password || typeof user.password !== 'string') {
        throw new UnauthorizedException('Password not defined for user');
      }

      const isSamePassword = await bcrypt.compare(dto.password, user.password);
      if (isSamePassword) {
        message = 'Same password provided';
      } else {
        const hashedPassword = await this.hashPassword(dto.password);
        user.password = hashedPassword;
        updated = true;
        passwordChanged = true;
      }
    }

    if (updated) {
      await this.creatorRepository.save(user);

      if (emailChanged && passwordChanged) {
        message = 'Email and password updated successfully';
      } else if (emailChanged) {
        message = 'Email updated successfully';
      } else if (passwordChanged) {
        message = 'Password updated successfully';
      } else {
        message = 'No changes made';
      }
    }

    // --- FINAL RESPONSE ---
    return {
      success: updated,
      message: message || 'No changes made',
      user: {
        id: user.id,
        email: user.email,
      },
    };
  }

  async verifyCurrentPassword(
    email: string,
    password: string,
  ): Promise<boolean> {
    const user = await this.creatorRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!password || typeof password !== 'string') {
      return false;
    }

    if (!user.password || typeof user.password !== 'string') {
      throw new UnauthorizedException('Password not set for user');
    }

    try {
      const result = await bcrypt.compare(password, user.password);
      return result;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  async createUsername(creatorId: number, dto: CreateUsernameDto) {
    const creator = await this.creatorRepository.findOne({
      where: { id: creatorId },
    });
    if (!creator) throw new NotFoundException('Creator not found');
    const existing = await this.creatorRepository.findOne({
      where: { username: dto.username },
    });
    if (existing && existing.id !== creatorId) {
      throw new BadRequestException('Username already taken');
    }
    creator.username = dto.username;
    return this.creatorRepository.save(creator);
  }

  async createLocation(creatorId: number, dto: CreateLocationDto) {
    const creator = await this.creatorRepository.findOne({
      where: { id: creatorId },
    });
    if (!creator) throw new NotFoundException('Creator not found');

    let city: string | null = null;
    let country: string | null = null;

    if (dto.location) {
      const parts = dto.location.split(',').map((p) => p.trim());
      if (parts.length > 1) {
        city = parts[0];
        country = parts[parts.length - 1];
      } else {
        city = dto.location;
      }
    }

    Object.assign(creator, {
      ...dto,
      ...(city && { city }),
      ...(country && { country }),
    });

    return this.creatorRepository.save(creator);
  }

  async createTitle(creatorId: number, dto: CreateTitleDto) {
    const creator = await this.creatorRepository.findOne({
      where: { id: creatorId },
    });
    if (!creator) throw new NotFoundException('Creator not found');
    creator.title = dto.title;
    return this.creatorRepository.save(creator);
  }

  async createDescription(creatorId: number, dto: CreateDescriptionDto) {
    const creator = await this.creatorRepository.findOne({
      where: { id: creatorId },
    });
    if (!creator) throw new NotFoundException('Creator not found');
    creator.description = dto.description;
    return this.creatorRepository.save(creator);
  }

  async createGender(creatorId: number, dto: CreateGenderDto) {
    const creator = await this.creatorRepository.findOne({
      where: { id: creatorId },
    });
    if (!creator) throw new NotFoundException('Creator not found');
    creator.gender = dto.gender;
    return this.creatorRepository.save(creator);
  }

  async createSocialChannel(
    creatorId: number,
    dto: CreateSocialChannelDto,
  ): Promise<SocialChannel> {
    const creator = await this.creatorRepository.findOne({
      where: { id: creatorId },
    });

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    const platformUrls: Record<ContentType, string> = {
      [ContentType.INSTAGRAM]: 'https://instagram.com/',
      [ContentType.TIKTOK]: 'https://www.tiktok.com/@',
      [ContentType.YOUTUBE]: 'https://www.youtube.com/',
      [ContentType.TWITTER]: 'https://twitter.com/',
      [ContentType.TWITCH]: 'https://www.twitch.tv/',
      [ContentType.UGC]: '',
      [ContentType.AMAZON]: '',
      [ContentType.WEBSITE]: '',
    };

    // Determine URL
    let url: string;

    if (
      dto.platform === ContentType.AMAZON ||
      dto.platform === ContentType.WEBSITE
    ) {
      // Accept user-provided URL directly
      if (!dto.url) {
        throw new BadRequestException(
          'URL must be provided for Amazon or Website',
        );
      }
      url = dto.url;
    } else {
      url = platformUrls[dto.platform] + dto.username;
    }

    const channel = this.socialChannelRepository.create({
      ...dto,
      creatorId,
      url,
    });

    return await this.socialChannelRepository.save(channel);
  }

  async createCategories(creatorId: number, dto: CreateCategoryIdsDto) {
    const creator = await this.creatorRepository.findOne({
      where: { id: creatorId },
      relations: ['categories'], // load existing categories relation
    });
    if (!creator) throw new NotFoundException('Creator not found');

    const categories = await this.categoryRepository.find({
      where: { id: In(dto.categoryIds) },
    });
    creator.categories = categories;

    return this.creatorRepository.save(creator);
  }

  async createMedia(creatorId: number, dto: CreateMediaDto): Promise<Media> {
    const creator = await this.creatorRepository.findOne({
      where: { id: creatorId },
    });

    if (!creator) {
      throw new NotFoundException('Creator not found');
    }

    const media = this.mediaRepository.create({
      ...dto,
      creatorId,
    });

    return await this.mediaRepository.save(media);
  }
  async createPhoneNumber(creatorId: number, dto: CreatePhoneNumberDto) {
    const creator = await this.creatorRepository.findOne({
      where: { id: creatorId },
    });
    if (!creator) throw new NotFoundException('Creator not found');
    creator.phoneNumber = dto.phoneNumber;
    return this.creatorRepository.save(creator);
  }

  async findByUsername(username: string): Promise<Creator> {
    const creator = await this.creatorRepository.findOne({
      where: { username: username },
      relations: [
        'portfolio',
        'media',
        'creatorServices',
        'creatorServices.service',
        'niches',
        'wallet',
        'card',
        'receivedReviews',
        'writtenBrandReviews',
      ],
    });
    if (!creator) {
      throw new NotFoundException(
        `Creator with username ${username} not found`,
      );
    }
    const socialChannels = await this.socialChannelRepository.find({
      where: { creator: { id: creator.id } },
    });

    creator.socialChannels = socialChannels;
    return creator;
  }

  async getHomepageCreators() {
    const fetchGroup = async (homepageProfiles: {
      [key: string]: number[];
    }) => {
      const allIds = [...new Set(Object.values(homepageProfiles).flat())];
      const creators = await this.creatorRepository.find({
        where: { id: In(allIds) },
        relations: [
          'socialChannels',
          'media',
          'creatorServices',
          'creatorServices.service',
        ],
      });

      if (!creators || creators.length === 0) {
        throw new NotFoundException(`creators not found`);
      }

      // Process creators and generate presigned URLs
      const processedCreators = await Promise.all(
        creators.map(async (c) => {
          let coverPhotoUrl = null;

          // Generate presigned URL for cover photo
          const profileMedia = c.media?.find(
            (m) => m.type === 'PROFILE_PICTURE',
          );
          if (profileMedia && profileMedia.s3Key) {
            coverPhotoUrl = await this.generatePresignedUrl(profileMedia.s3Key);
          }

          return {
            id: c.id,
            name: c.name,
            username: c.username,
            title: c.title,
            location: c.location,
            rating: c.starRating,
            coverPhoto: coverPhotoUrl,
            socialChannels: c.socialChannels,
            creatorServices: c.creatorServices,
          };
        }),
      );

      // Create map from processed creators
      const creatorMap = new Map(processedCreators.map((c) => [c.id, c]));

      const result: { [key: string]: any[] } = {};

      for (const [category, ids] of Object.entries(homepageProfiles)) {
        result[category] = ids
          .filter((id) => creatorMap.has(id))
          .map((id) => {
            const creator = creatorMap.get(id);
            const platform = category === 'featured' ? 'Instagram' : category;
            const followers =
              creator?.socialChannels?.find((sc) => sc.platform === platform)
                ?.followers || null;
            const price =
              (creator?.creatorServices ?? []).length > 0
                ? Math.min(
                    ...(creator?.creatorServices ?? [])
                      .filter(
                        (cs) => !platform || cs.service?.platform === platform,
                      )
                      .map((cs) => cs.price),
                  ) || null
                : null;
            return {
              id: creator?.id,
              name: creator?.name,
              username: creator?.username,
              title: creator?.title,
              location: creator?.location,
              rating: creator?.rating,
              coverPhoto: creator?.coverPhoto,
              followers: followers,
              price: price,
              platform: platform,
            };
          });
      }
      return result;
    };

    return {
      resultat: await fetchGroup(homepageProfiles),
    };
  }

  async addCreatorPackage(
    id: number,
    dto: CreateCreatorServiceDto,
  ): Promise<CreatorServiceEntity> {
    return await this.creatorServiceService.create(id, dto);
  }
  async getCreatorBookingItems(creatorId: number): Promise<BookingItem[]> {
    // Step 1: make sure the creator exists
    const creator = await this.creatorRepository.findOne({
      where: { id: creatorId },
    });
    if (!creator) {
      throw new NotFoundException('Creator not found');
    }
    // Step 2: find all CreatorServices of this creator
    const creatorServices = await this.creatorServiceRepository.find({
      where: { creatorId },
    });
    if (creatorServices.length === 0) {
      return []; // no services, so no booking items
    }
    // Step 3: collect their IDs
    const creatorServiceIds = creatorServices.map((cs) => cs.id);
    // Step 4: fetch all booking items linked to those services
    const bookingItems = await this.bookingItemRepository.find({
      where: { creatorService: { id: In(creatorServiceIds) } },
      relations: ['booking', 'creatorService'],
    });
    return bookingItems;
  }
}

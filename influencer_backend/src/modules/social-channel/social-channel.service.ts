import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSocialChannelDto } from './dto/create-social-channel.dto';
import { UpdateSocialChannelDto } from './dto/update-social-channel.dto';
import { Repository } from 'typeorm/repository/Repository';
import { SocialChannel } from './entities/social-channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentType } from '../../common/enums/contentType.enum';
import { Creator } from '../creator/entities/creator.entity';
import { Brand } from '../brand/entities/brand.entity';

@Injectable()
export class SocialChannelService {
  constructor(
    @InjectRepository(SocialChannel)
    private readonly socialChannelRepository: Repository<SocialChannel>,
    @InjectRepository(Creator)
    private readonly creatorRepository: Repository<Creator>,
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}
  async createSocialChannel(
    userId: number,
    dto: CreateSocialChannelDto,
    role: 'creator' | 'brand',
  ): Promise<SocialChannel> {
    const user =
      role === 'creator'
        ? await this.creatorRepository.findOne({ where: { id: userId } })
        : await this.brandRepository.findOne({ where: { id: userId } });
    if (isNaN(userId)) {
      throw new BadRequestException('Invalid userId');
    }
    if (!user)
      throw new NotFoundException(
        role === 'creator' ? 'Creator not found' : 'Brand not found',
      );
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
    let url: string;
    if (
      dto.platform === ContentType.AMAZON ||
      dto.platform === ContentType.WEBSITE
    ) {
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
      url,
      ...(role === 'creator'
        ? { creatorId: userId, followers: dto.followers ?? 0 }
        : {}),
      ...(role === 'brand' ? { brandId: userId } : {}),
    });

    return await this.socialChannelRepository.save(channel);
  }

  async findAll(): Promise<SocialChannel[]> {
    return this.socialChannelRepository.find();
  }

  async findOne(id: number): Promise<SocialChannel> {
    const channel = await this.socialChannelRepository.findOne({
      where: { id },
    });
    if (!channel) throw new NotFoundException(`SocialChannel #${id} not found`);
    return channel;
  }

  async updateSocialChannel(
    id: number,
    dto: UpdateSocialChannelDto,
  ): Promise<SocialChannel> {
    const channel = await this.socialChannelRepository.findOne({
      where: { id },
    });
    if (!channel) {
      throw new NotFoundException('Social channel not found');
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

    if (dto.username !== undefined) {
      channel.username = dto.username;

      if (
        channel.platform !== ContentType.AMAZON &&
        channel.platform !== ContentType.WEBSITE &&
        platformUrls[channel.platform]
      ) {
        channel.url = platformUrls[channel.platform] + dto.username;
      }
    }

    if (dto.followers !== undefined) {
      channel.followers = dto.followers;
    }
    if (
      (channel.platform === ContentType.AMAZON ||
        channel.platform === ContentType.WEBSITE) &&
      dto.url
    ) {
      channel.url = dto.url;
    }

    return await this.socialChannelRepository.save(channel);
  }

  async remove(id: number): Promise<void> {
    const result = await this.socialChannelRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException(`SocialChannel #${id} not found`);
  }
  async findByCreatorId(creatorId: number) {
    return this.socialChannelRepository.find({
      where: { creatorId },
    });
  }
  async findByBrandId(brandId: number) {
    return this.socialChannelRepository.find({
      where: { brandId },
    });
  }
}

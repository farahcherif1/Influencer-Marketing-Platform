import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatorService } from './entities/creator-service.entity';
import { CreateCreatorServiceDto } from './dto/create-creator-service.dto';
import { Creator } from '../creator/entities/creator.entity';
import { Service } from '../service/entities/service.entity';
import { DeletePackageResponse } from '../../types/api-responses';

@Injectable()
export class CreatorServiceService {
  constructor(
    @InjectRepository(CreatorService)
    private readonly creatorServiceRepo: Repository<CreatorService>,
    @InjectRepository(Creator)
    private readonly creatorRepo: Repository<Creator>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async create(
    creatorId: number,
    dto: CreateCreatorServiceDto,
  ): Promise<CreatorService> {
    const creator = await this.creatorRepo.findOne({
      where: { id: creatorId },
    });
    if (!creator) throw new NotFoundException('Creator not found');

    const service = await this.serviceRepo.findOne({
      where: { id: dto.serviceId },
    });
    if (!service) throw new NotFoundException('Service not found');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { serviceId: _ignored, ...rest } = dto;

    const creatorService = this.creatorServiceRepo.create({
      ...rest,
      creatorId,
      serviceId: service.id,
      price: dto.price,
      description: dto.description,
      quantity: dto.quantity,
      duration: dto.duration,
      durationUnit: dto.durationUnit,
    });

    return await this.creatorServiceRepo.save(creatorService);
  }

  async removePackage(
    packageId: number,
    creatorId: number,
  ): Promise<DeletePackageResponse> {
    const creatorService = await this.creatorServiceRepo.findOne({
      where: {
        id: packageId,
        creator: { id: creatorId }, // ensures ownership
      },
      relations: ['creator'],
    });
    if (!creatorService) {
      throw new NotFoundException('Package not found');
    }

    await this.creatorServiceRepo.remove(creatorService);

    return {
      message: `Package ${packageId} removed successfully`,
      status: true,
      statusCode: 200,
    };
  }
  async getCreatorPackage(id: number) {
    const packages = await this.creatorServiceRepo.find({
      where: { creatorId: id },
      relations: ['service'],
    });
    if (!packages || packages.length === 0) {
      throw new NotFoundException(
        `CreatorService with creatorId ${id} not found`,
      );
    }
    return packages.map(({ service, ...rest }) => ({
      ...rest,
      contentType: service?.name,
    }));
  }
  async update(id: number, dto: CreateCreatorServiceDto) {
    const res = await this.creatorServiceRepo.update(id, dto);
    return this.creatorServiceRepo.findOneBy({ id });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { Category } from '../../modules/category/category.entity';
import { CreatorServiceService } from '../../modules/creator-service/creator-service.service';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    private creatorServiceService: CreatorServiceService,
  ) {}

  async create(dto: CreateServiceDto): Promise<Service> {
    const service = this.serviceRepo.create(dto);
    return await this.serviceRepo.save(service);
  }

  async findAll(): Promise<Service[]> {
    return await this.serviceRepo.find();
  }

  async getByName(serviceName: string): Promise<number> {
    const service = await this.serviceRepo.findOne({
      where: { name: serviceName },
    });
    if (!service) {
      throw new NotFoundException(`service with name ${serviceName} not found`);
    }
    return service.id;
  }

  async getById(serviceId: number): Promise<Service> {
    const service = await this.serviceRepo.findOne({
      where: { id: serviceId },
    });
    if (!service) {
      throw new NotFoundException(`service with id ${serviceId} not found`);
    }
    return service;
  }
  async getAllServiceNames(): Promise<string[]> {
    const services = await this.serviceRepo.find({
      select: ['name'],
    });

    // services is an array of objects like { name: 'serviceName' }
    return services.map((service) => service.name);
  }

  async getServicesWithDuration(): Promise<number[]> {
    const services = await this.serviceRepo.find({
      select: ['id'],
      where: { hasDuration: true },
    });

    return services.map((service) => service.id);
  }

  async getPlatforms(): Promise<string[]> {
    const services = await this.serviceRepo
      .createQueryBuilder('service')
      .select('DISTINCT service.platform', 'platform')
      .getRawMany();

    return services.map((s) => s.platform);
  }
}

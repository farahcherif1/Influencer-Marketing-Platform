import { Controller, Get, Param, Query } from '@nestjs/common';
import { ServiceService } from './service.service';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}
  @Get()
  async findAll() {
    return this.serviceService.findAll();
  }

  @Get('serviceId/:id')
  async getServiceById(@Param('id') serviceId: number) {
    return this.serviceService.getById(serviceId);
  }

  @Get('serviceIdByName')
  async getServiceId(@Query('serviceName') serviceName: string) {
    return this.serviceService.getByName(serviceName);
  }

  @Get('all')
  async getAllServiceNames() {
    return this.serviceService.getAllServiceNames();
  }
  @Get('platforms')
  async getPlatforms() {
    return this.serviceService.getPlatforms();
  }

  @Get('servicesWithDuration')
  async getServicesWithDuration() {
    return this.serviceService.getServicesWithDuration();
  }
}

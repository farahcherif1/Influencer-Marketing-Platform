import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Delete,
  UseGuards,
  Get,
  Put,
} from '@nestjs/common';
import { CreatorServiceService } from './creator-service.service';
import { CreateCreatorServiceDto } from './dto/create-creator-service.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../creator/decorators/current-user.decorator';
import { Creator } from '../creator/entities/creator.entity';
import { User } from '../user/entities/user.entity';

@Controller('creator-service')
export class CreatorServiceController {
  constructor(private readonly creatorServiceService: CreatorServiceService) {}

  @Post(':id')
  async create(
    @Param('id', ParseIntPipe) creatorId: number,
    @Body() dto: CreateCreatorServiceDto,
  ) {
    return this.creatorServiceService.create(creatorId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('removePackage/:packageId')
  async removeCreatorPackage(
    @CurrentUser() creator: Creator,
    @Param('packageId', ParseIntPipe) packageId: number,
  ) {
    return this.creatorServiceService.removePackage(packageId, creator.id);
  }
  @UseGuards(JwtAuthGuard)
  @Get('packages')
  async getCreatorPackage(@CurrentUser() creator: Creator | User) {
    return this.creatorServiceService.getCreatorPackage(creator.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  async updatePackage(
    @Param('id') serviceId: number,
    @Body() dto: CreateCreatorServiceDto,
  ) {
    return await this.creatorServiceService.update(serviceId, dto);
  }
}

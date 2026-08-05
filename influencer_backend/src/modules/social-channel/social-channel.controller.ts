import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { SocialChannelService } from './social-channel.service';
import { CreateSocialChannelDto } from './dto/create-social-channel.dto';
import { UpdateSocialChannelDto } from './dto/update-social-channel.dto';

@Controller('social-channel')
export class SocialChannelController {
  constructor(private readonly socialChannelService: SocialChannelService) {}
  @Post('user/:userId')
  create(
    @Param('userId') userId: string,
    @Body() createDto: CreateSocialChannelDto,
    @Query('role') role: 'creator' | 'brand',
  ) {
    return this.socialChannelService.createSocialChannel(
      +userId,
      createDto,
      role,
    );
  }

  @Get('creator/:creatorId')
  findByCreatorId(@Param('creatorId') creatorId: string) {
    return this.socialChannelService.findByCreatorId(+creatorId);
  }
  @Get('brand/:brandId')
  findByBrandId(@Param('brandId') brandId: string) {
    return this.socialChannelService.findByBrandId(+brandId);
  }

  @Get()
  findAll() {
    return this.socialChannelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.socialChannelService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSocialChannelDto: UpdateSocialChannelDto,
  ) {
    return this.socialChannelService.updateSocialChannel(
      +id,
      updateSocialChannelDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialChannelService.remove(+id);
  }
}

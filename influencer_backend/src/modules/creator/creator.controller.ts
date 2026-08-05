import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Get,
  UseInterceptors,
  UploadedFiles,
  Query,
  Delete,
} from '@nestjs/common';
import { Put, Req, UseGuards } from '@nestjs/common';

import { CreatorService } from './creator.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../modules/auth/guards/roles.guard';
import { Roles } from '../../modules/auth/guards/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { UpdateCreatorDto } from './dto/update-creator.dto';
import { changePasswordDto } from './dto/change-password.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import {
  CreateLocationDto,
  CreateTitleDto,
  CreateDescriptionDto,
  CreateGenderDto,
  CreatePhoneNumberDto,
  CreateCategoryIdsDto,
  CreateUsernameDto,
} from './dto/create-creator.dto';
import { CreateSocialChannelDto } from '../social-channel/dto/create-social-channel.dto';
// import { CreateMediaDto } from '../media/dto/create-media.dto';
import { CreateCreatorServiceDto } from '../creator-service/dto/create-creator-service.dto';
import { Creator } from './entities/creator.entity';
import { diskStorage } from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediaType } from '../../common/enums/mediaType.enum';
import { extname } from 'path';
import { SearchCreatorDto } from './dto/search-creators.dto';

@Controller('creator')
export class CreatorController {
  constructor(private readonly creatorService: CreatorService) {}
  @Get()
  async getCreators() {
    return this.creatorService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete()
  async deleteCreator(@Query('email') email: string) {
    return this.creatorService.deleteCreator(email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMyAccount(@CurrentUser() creator: Creator) {
    return this.creatorService.deleteCreator(creator.email);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('count')
  async getCreatorsCount() {
    return this.creatorService.getCreatorsCount();
  }
  @Post(':id/username')
  createUsername(
    @Param('id', ParseIntPipe) creatorId: number,
    @Body() dto: CreateUsernameDto,
  ) {
    return this.creatorService.createUsername(creatorId, dto);
  }

  @Post(':id/location')
  createLocation(
    @Param('id', ParseIntPipe) creatorId: number,
    @Body() dto: CreateLocationDto,
  ) {
    return this.creatorService.createLocation(creatorId, dto);
  }

  @Post(':id/title')
  createTitle(
    @Param('id', ParseIntPipe) creatorId: number,
    @Body() dto: CreateTitleDto,
  ) {
    return this.creatorService.createTitle(creatorId, dto);
  }

  @Post(':id/description')
  createDescription(
    @Param('id', ParseIntPipe) creatorId: number,
    @Body() dto: CreateDescriptionDto,
  ) {
    return this.creatorService.createDescription(creatorId, dto);
  }

  @Post(':id/gender')
  createGender(
    @Param('id', ParseIntPipe) creatorId: number,
    @Body() dto: CreateGenderDto,
  ) {
    return this.creatorService.createGender(creatorId, dto);
  }

  @Post(':id/social-channel')
  async createSocialChannel(
    @Param('id', ParseIntPipe) creatorId: number,
    @Body() dto: CreateSocialChannelDto,
  ) {
    return this.creatorService.createSocialChannel(creatorId, dto);
  }

  @Post(':id/categories')
  createCategories(
    @Param('id', ParseIntPipe) creatorId: number,
    @Body() dto: CreateCategoryIdsDto,
  ) {
    return this.creatorService.createCategories(creatorId, dto);
  }

  @Post(':id/media')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/media',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadMedia(
    @Param('id', ParseIntPipe) creatorId: number,

    @UploadedFiles() files: Express.Multer.File[],
    // @Body() dto: CreateMediaDto,
  ) {
    const uploaded = await Promise.all(
      files.map((file) =>
        this.creatorService.createMedia(creatorId, {
          url: `/uploads/media/${file.filename}`,
          type: MediaType.OTHER,
        }),
      ),
    );
    return uploaded;
  }

  @Post(':id/phone-number')
  createPhoneNumber(
    @Param('id', ParseIntPipe) creatorId: number,
    @Body() dto: CreatePhoneNumberDto,
  ) {
    return this.creatorService.createPhoneNumber(creatorId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('addPackage')
  async addCreatorPackage(
    @CurrentUser() creator: Creator,
    @Body() dto: CreateCreatorServiceDto,
  ) {
    return this.creatorService.addCreatorPackage(creator.id, dto);
  }
  @Get('search')
  async creatorSearch(@Query() dto: SearchCreatorDto) {
    return this.creatorService.searchCreator(dto);
  }

  @Get('/homePage')
  async getHomePageCreators() {
    return await this.creatorService.getHomepageCreators();
  }

  @Get('username/:username')
  async findByUsername(@Param('username') username: string) {
    return this.creatorService.findByUsername(username);
  }

  @Get('id/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.creatorService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@Req() req: Request & { user: Creator }) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(
    @CurrentUser() creator: Creator,
    @Body() dto: UpdateCreatorDto,
  ) {
    return this.creatorService.updateProfile(creator.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('account')
  async updateAccount(
    @CurrentUser() creator: Creator,
    @Body() dto: UpdateCreatorDto,
  ) {
    return this.creatorService.updateAccount(creator.email, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verifyCurrentPassword')
  async verifyCurrentPassword(
    @CurrentUser() creator: Creator,
    @Body() dto: changePasswordDto,
  ) {
    return this.creatorService.verifyCurrentPassword(
      creator.email,
      dto.password,
    );
  }

  @Get('All')
  async findAll() {
    return this.creatorService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  @Get('bookings/:creatorId')
  async findCreatorBookingsByCreatorId(
    @Param('creatorId', ParseIntPipe) creatorId: number,
  ) {
    return this.creatorService.getCreatorBookingItems(creatorId);
  }
}

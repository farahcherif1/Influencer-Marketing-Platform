import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Put,
  Query,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { Brand } from './entities/brand.entity';
import { S3Service } from '../../s3/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SearchBrandDto } from './dto/search-brand.dto';
import { RolesGuard } from '../../modules/auth/guards/roles.guard';
import { Roles } from '../../modules/auth/guards/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../creator/decorators/current-user.decorator';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandDto } from './dto/brand.dto';

@Controller('brand')
export class BrandController {
  constructor(
    private readonly brandService: BrandService,
    private readonly s3Service: S3Service,
  ) {}

  @Get()
  async getAllBrands() {
    return this.brandService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('count')
  async getBrandsCount() {
    return this.brandService.getBrandsCount();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('search')
  async creatorSearch(@Query() dto: SearchBrandDto) {
    return this.brandService.searchBrands(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete()
  async deleteBrand(@Query('email') email: string) {
    return this.brandService.deleteBrand(email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMyAccount(@CurrentUser() brand: Brand) {
    return this.brandService.deleteBrand(brand.email);
  }

  @Post(':id/step')
  async updateBrandStep(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    dto: Partial<CreateBrandDto>,
  ) {
    return this.brandService.updatePartialBrand(id, dto);
  }

  @Get('username/:username')
  async getBrandByUserName(
    @Param('username') userName: string,
  ): Promise<BrandDto> {
    return await this.brandService.findByUserName(userName);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@Req() req: Request & { user: Brand }) {
    return req.user;
  }

  @Get('id/:id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.brandService.findOne(id);
  }

  @Get('bookings/:brandId')
  async getBookings(@Param('brandId', ParseIntPipe) brandId: number) {
    return await this.brandService.getBookings(brandId);
  }
  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(
    @CurrentUser() brand: Brand,
    @Body() dto: UpdateBrandDto,
  ) {
    return this.brandService.updateBrand(brand.id, dto);
  }

  @Put(':id/profile-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @Param('id') brandId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.brandService.updateProfilePicture(brandId, file);
  }

  @Put(':id/cover-picture')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCoverPicture(
    @Param('id') brandId: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.brandService.updateCoverPicture(brandId, file);
  }
}

import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Body,
  Query,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediaType } from '../../common/enums/mediaType.enum';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post(':creatorId/upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  async upload(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('creatorId') creatorIdParam: string,
    @Body('type') type: MediaType,
  ) {
    const creatorId = Number(creatorIdParam);
    if (!creatorId) {
      throw new BadRequestException('creatorId is required');
    }

    if (!Object.values(MediaType).includes(type)) {
      throw new BadRequestException(
        'Invalid media type. Must be PROFILE_PICTURE, COVER_PICTURE, or OTHER',
      );
    }

    return this.mediaService.uploadToS3(creatorId, type, files);
  }
  @Get()
  findAll(@Query('creatorId') creatorId?: string) {
    const id = creatorId ? Number(creatorId) : undefined;
    return this.mediaService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.removeFromS3(+id);
  }
}

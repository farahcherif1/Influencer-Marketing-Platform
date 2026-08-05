import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('creators/:creatorId/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      limits: {
        fileSize: 500 * 1024 * 1024,
      },
    }),
  )
  async create(
    @Param('creatorId') creatorId: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.portfolioService.uploadToS3(+creatorId, files);
  }

  @Get()
  findAll(@Param('creatorId') creatorId: string) {
    return this.portfolioService.findAllByCreator(+creatorId);
  }

  @Get(':id')
  findOne(@Param('creatorId') creatorId: string, @Param('id') id: string) {
    return this.portfolioService.findOneByCreator(+creatorId, +id);
  }

  @Delete(':id')
  remove(@Param('creatorId') creatorId: string, @Param('id') id: string) {
    return this.portfolioService.removeFromS3(+creatorId, +id);
  }
}

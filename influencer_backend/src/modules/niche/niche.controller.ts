import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NicheService } from './niche.service';
import { CreateNicheDto } from './dto/create-niche.dto';
import { UpdateNicheDto } from './dto/update-niche.dto';

@Controller('niche')
export class NicheController {
  constructor(private readonly nicheService: NicheService) {}

  @Post()
  create(@Body() createNicheDto: CreateNicheDto) {
    return this.nicheService.create(createNicheDto);
  }

  @Get()
  findAll() {
    return this.nicheService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nicheService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNicheDto: UpdateNicheDto) {
    return this.nicheService.update(+id, updateNicheDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nicheService.remove(+id);
  }
}

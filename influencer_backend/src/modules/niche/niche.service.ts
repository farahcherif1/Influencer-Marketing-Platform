import { Injectable } from '@nestjs/common';
import { CreateNicheDto } from './dto/create-niche.dto';
import { UpdateNicheDto } from './dto/update-niche.dto';

@Injectable()
export class NicheService {
  create(createNicheDto: CreateNicheDto) {
    return 'This action adds a new niche';
  }

  findAll() {
    return `This action returns all niche`;
  }

  findOne(id: number) {
    return `This action returns a #${id} niche`;
  }

  update(id: number, updateNicheDto: UpdateNicheDto) {
    return `This action updates a #${id} niche`;
  }

  remove(id: number) {
    return `This action removes a #${id} niche`;
  }
}

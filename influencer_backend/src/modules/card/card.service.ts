import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm/repository/Repository';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';

@Injectable()
export class CardService {
  // constructor(
  //   @InjectRepository(User)
  //   private readonly userRepository: Repository<User>,
  //   @InjectRepository(Card)
  //   private readonly cardRepository: Repository<Card>,
  // ) {}
  // async getCardByUserId(userId: number): Promise<Card | null> {
  //   const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ['card'],
  //   });
  //   if (!user || !user.card) {
  //     return null;
  //   }
  //   return user.card;
  // }
}

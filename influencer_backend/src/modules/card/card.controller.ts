import { Controller, Get, Param, Req } from '@nestjs/common';
import { CardService } from './card.service';
import { CardDto } from './dto/cardDto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  // @Get('userId/:id')
  // async getCard(@Param('id') userId: number) {
  //   return this.cardService.getCardByUserId(userId);
  // }
}

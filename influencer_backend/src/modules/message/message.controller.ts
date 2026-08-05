import { Controller, Get, Param } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':userId1/:userId2')
  async getChatHistory(
    @Param('userId1') userId1: number,
    @Param('userId2') userId2: number,
  ) {
    return this.messageService.findChatHistory(userId1, userId2);
  }
}

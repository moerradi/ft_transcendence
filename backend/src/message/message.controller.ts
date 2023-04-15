import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAccessTokenGuard } from 'src/auth/guards/jwtaccess.guard';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get(':id')
  @UseGuards(JwtAccessTokenGuard)
  getMessages(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.messageService.getMessages(req.user.id, id);
  }

  @Get()
  @UseGuards(JwtAccessTokenGuard)
  getFriends(@Req() req) {
    return this.messageService.getFriends(req.user.id);
  }
}

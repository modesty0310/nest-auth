import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpDto } from './dto/req.dto';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  async signUp(@Body() dto: SignUpDto) {
    await this.service.signUp(dto);
  }
}

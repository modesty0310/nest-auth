import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SignInDto, SignUpDto } from './dto/req.dto';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';
import { IUser, UserGuard } from 'src/auth/guards/user.guard';
import { User } from 'src/auth/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @UseGuards(UserGuard)
  async getMyInfo(@User() user: IUser) {
    return await this.service.getMyInfo(user);
  }

  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    await this.service.signUp(dto);
  }

  @Post('sign-in')
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.signIn(dto);

    res.setHeader('Authorization', 'Bearer ' + access_token);
    res.cookie('access_token', access_token, { httpOnly: true });
    res.cookie('refresh_token', refresh_token, { httpOnly: true });
    res.send({ message: 'sign-in', data: {} });
  }
}

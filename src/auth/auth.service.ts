import * as bcrypt from 'bcrypt';

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { SignInDto } from 'src/user/dto/req.dto';
import { UserRepository } from 'src/user/user.repository';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(dto: SignInDto) {
    const { id, pw } = dto;
    const user = await this.validateUser(id, pw);

    const access_token = this.generateAccessToken(user);
    const refresh_token = this.generateRefreshToken(user);

    await this.setRefreshToken(user.uid, refresh_token);

    return { access_token, refresh_token };
  }

  private async validateUser(id: string, pw: string) {
    const user = await this.userRepository.getUserById(id);
    if (!user) throw new UnauthorizedException('존재 하지 않는 유저입니다.');

    const comparePassword = await bcrypt.compare(pw, user.password);
    if (!comparePassword)
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');

    return user;
  }

  private generateAccessToken(user: User) {
    return this.jwtService.sign(
      { id: user.id, sub: user.uid },
      { expiresIn: process.env.ACCESS_EXP },
    );
  }

  private generateRefreshToken(user: User) {
    return this.jwtService.sign(
      { id: user.id, sub: user.uid },
      { expiresIn: process.env.REFRESH_EXP },
    );
  }

  private async setRefreshToken(uid: string, token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: process.env.JwtSecret,
    });
    const exp = payload.exp;

    await this.userRepository.insertRefreshToken(uid, token, exp);
  }
}

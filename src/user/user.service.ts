import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

import { BadRequestException, Injectable } from '@nestjs/common';

import { UserRepository } from './user.repository';
import { SignUpDto } from './dto/req.dto';
import { IUser } from 'src/auth/guards/user.guard';

@Injectable()
export class UserService {
  constructor(private readonly repository: UserRepository) {}

  async signUp(dto: SignUpDto) {
    const uid = uuidv4();
    const { id, pw } = dto;

    const existUser = await this.repository.getUserById(id);
    if (existUser)
      throw new BadRequestException('이미 존재 하는 아이디 입니다.');

    const hashedPassword = await await bcrypt.hash(
      pw,
      parseInt(process.env.bcrypt_salt),
    );

    await this.repository.signUp(uid, id, hashedPassword);
  }

  async getMyInfo(user: IUser) {
    return await this.repository.getUserById(user.id);
  }
}

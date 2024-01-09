import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async signUp(uid: string, id: string, password: string) {
    await this.repository
      .createQueryBuilder()
      .insert()
      .values({
        uid,
        id,
        password,
      })
      .execute();
  }

  async existId(id: string) {
    return await this.repository.createQueryBuilder().where({ id }).getOne();
  }
}

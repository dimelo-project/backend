import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async createUser(email: string, nickname: string, password: string) {
    const foundEmail = await this.usersRepository.findOne({ where: { email } });
    if (foundEmail) {
      throw new UnauthorizedException('이미 해당하는 아이디가 존재합니다');
    }
    const foundNick = await this.usersRepository.findOne({
      where: { nickname },
    });
    if (foundNick) {
      throw new UnauthorizedException('이미 해당하는 닉네임이 존재합니다');
    }
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.BCRYPT_SALT_ROUNDS),
    );

    await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
  }
}

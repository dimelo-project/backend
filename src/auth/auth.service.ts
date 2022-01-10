import bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
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

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'nickname'],
    });
    if (!user) {
      return null;
    }

    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }
}

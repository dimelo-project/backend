import { GithubLoginUserDto } from './dto/github-login-user.dto';
import bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
import { GoogleLoginUserDto } from './dto/google-login-user.dto';

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

  async googleSignUp(user: GoogleLoginUserDto) {
    const foundGoogle = await this.usersRepository.findOne({
      where: { email: user.email, googleId: user.googleId },
    });
    if (foundGoogle) {
      return foundGoogle;
    }
    const found = await this.usersRepository.findOne({
      where: { email: user.email },
    });
    if (found) {
      const googleConnected = {
        ...found,
        googleId: user.googleId,
      };
      return this.usersRepository.save(googleConnected);
    }
    return this.usersRepository.save(user);
  }

  async githubSignUp(user: GithubLoginUserDto) {
    const foundGithub = await this.usersRepository.findOne({
      where: { email: user.email, githubId: user.githubId },
    });
    if (foundGithub) {
      return foundGithub;
    }
    const found = await this.usersRepository.findOne({
      where: { email: user.email },
    });
    if (found) {
      const githubConnected = {
        ...found,
        githubId: user.githubId,
      };
      return this.usersRepository.save(githubConnected);
    }
    return this.usersRepository.save(user);
  }
}

import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user-profile.dto';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async getMyInfo(id: number) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    return user;
  }

  async createProfile(
    id: number,
    data: CreateUserProfileDto,
    file?: Express.MulterS3.File,
  ) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    if (user.nickname) {
      throw new ForbiddenException('이미 프로필을 생성하였습니다');
    }
    const foundNick = await this.usersRepository.findOne({
      where: { nickname: data.nickname },
    });
    if (foundNick) {
      throw new ConflictException('해당 닉네임은 이미 사용중 입니다');
    }
    if (file) {
      user.imageUrl = file.location;
    }
    const updatedUser = {
      ...user,
      ...data,
    };
    return this.usersRepository.save(updatedUser);
  }

  async updateProfile(
    id: number,
    data: UpdateUserDto,
    file?: Express.MulterS3.File,
  ) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }

    if (user.nickname !== data.nickname) {
      const foundNick = await this.usersRepository.findOne({
        where: { nickname: data.nickname },
      });
      if (foundNick) {
        throw new ConflictException('해당 닉네임은 이미 사용중 입니다');
      }
    }
    if (file) {
      data.imageUrl = file.location;
    }
    const updatedUser = {
      ...user,
      ...data,
    };
    return this.usersRepository.save(updatedUser);
  }

  async delete(id: number, password: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다');
    }
    await this.usersRepository.softDelete(user);
    return true;
  }

  async setPassword(id: number, newPassword: string, passwordConfirm: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    if (user.password) {
      throw new ForbiddenException('비밀번호가 이미 설정되어 있습니다');
    }
    if (newPassword !== passwordConfirm) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다');
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      parseInt(process.env.BCRYPT_SALT_ROUNDS),
    );

    return this.usersRepository.save({
      ...user,
      password: hashedPassword,
    });
  }

  async changePassword(
    id: number,
    password: string,
    newPassword: string,
    passwordConfirm: string,
  ) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new UnauthorizedException('로그인을 먼저 해주세요');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new ForbiddenException('비밀번호가 일치하지 않습니다');
    }
    if (password === newPassword) {
      throw new ConflictException('같은 비밀번호를 설정할 수 없습니다');
    }
    if (newPassword !== passwordConfirm) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다');
    }
    const hashedPassword = await bcrypt.hash(
      newPassword,
      parseInt(process.env.BCRYPT_SALT_ROUNDS),
    );
    return this.usersRepository.save({
      ...user,
      password: hashedPassword,
    });
  }
}

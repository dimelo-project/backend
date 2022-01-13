import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
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

  async findById(id: number) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다');
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
      throw new NotFoundException('해당 하는 유저가 없습니다');
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
      throw new NotFoundException('해당 유저를 찾을 수 없습니다');
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
      throw new NotFoundException('해당 유저를 찾을 수 없습니다');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    }
    return this.usersRepository.softDelete(user);
  }

  async setPassword(id: number, newPassword: string, checkPassword: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다');
    }
    if (user.password) {
      throw new UnauthorizedException('비밀번호를 변경하기를 해주세요');
    }
    if (newPassword !== checkPassword) {
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
    checkPassword: string,
  ) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다');
    }
    if (await bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    }
    if (password === newPassword) {
      throw new ConflictException('같은 비밀번호를 설정할 수 없습니다');
    }
    if (newPassword !== checkPassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
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

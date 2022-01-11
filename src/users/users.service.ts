import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
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

  async update(id: number, data: Partial<UpdateUserDto>) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다');
    }
    if (data.nickname) {
      const foundNick = await this.usersRepository.findOne({
        where: { nickname: data.nickname },
      });
      if (foundNick)
        throw new UnauthorizedException('해당 닉네임이 이미 존재 합니다');
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
      select: ['id', 'email', 'password', 'nickname'],
    });
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    }
    return this.usersRepository.softDelete(user);
  }

  async changePassword(id: number, newPassword: string, checkPassword: string) {
    const user = await this.usersRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다');
    }
    if (newPassword !== checkPassword) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');
    }
    if (await bcrypt.compare(newPassword, user.password)) {
      throw new UnauthorizedException('같은 비밀번호는 설정할 수 없습니다');
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

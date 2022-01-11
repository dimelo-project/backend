import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
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
}

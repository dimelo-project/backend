import { ChangePassword } from './dto/change-password.dto';
import { UndefinedToNullInterceptor } from './../common/interceptors/undefinedToNull.interceptor';
import { UserDto } from './dto/user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { LoggedInGuard } from './../common/guards/logged-in.guard';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { User } from '../common/decorators/user.decorator';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('USER')
@UseInterceptors(UndefinedToNullInterceptor)
@UseGuards(new LoggedInGuard())
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '내 정보 받아오기' })
  @Serialize(ReturnUserDto)
  @Get('me')
  getMyInfo(@User() user: UserDto) {
    return this.usersService.findById(user.id);
  }

  @ApiOperation({ summary: '내 정보 수정하기' })
  @Serialize(ReturnUserDto)
  @Patch('/me')
  updateMyInfo(@User() user: UserDto, @Body() data: Partial<UpdateUserDto>) {
    return this.usersService.update(user.id, data);
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @Post('/delete/me')
  deleteMyAccount(@User() user: UserDto, @Body('password') password: string) {
    return this.usersService.delete(user.id, password);
  }

  @ApiOperation({ summary: '비밀번호 찾기' })
  @Post('/password')
  findMyPassword() {}

  @ApiOperation({ summary: '비밀번호 변경하기' })
  @Serialize(ReturnUserDto)
  @Patch('/password')
  updateMyPassword(@User() user: UserDto, @Body() data: ChangePassword) {
    return this.usersService.changePassword(
      user.id,
      data.newPassword,
      data.checkPassword,
    );
  }

  @ApiOperation({ summary: '특정 회원 정보 받아오기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'user id',
  })
  @Serialize(ReturnUserDto)
  @Get('/:id')
  getUserInfo(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }
}

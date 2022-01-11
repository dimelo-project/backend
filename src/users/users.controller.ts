import { LoginUserDto } from './dto/login-user.dto';
import { ReturnUserDto } from './dto/return-user.dto';
import { NotLoggedInGuard } from '../common/guards/not-logged-in.guard';
import { LoggedInGuard } from '../common/guards/logged-in.guard';
import { LocalAuthGuard } from '../auth/guard/local.auth.guard';
import { User } from './../common/decorators/user.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
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
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '특정 회원 정보 받아오기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'user id',
  })
  @Get('/:id')
  getUserInfo(@Param('id', ParseIntPipe) id: number) {}

  @ApiOperation({ summary: '내 정보 받아오기' })
  @Get('/me')
  getMyInfo() {}

  @ApiOperation({ summary: '내 정보 수정하기' })
  @Patch('/me')
  updateMyInfo() {}

  @ApiOperation({ summary: '회원 탈퇴' })
  @Delete('/me')
  deleteMyAccount() {}

  @ApiOperation({ summary: '비밀번호 찾기' })
  @Post('/password')
  findMyPassword() {}

  @ApiOperation({ summary: '비밀번호 변경하기' })
  @Patch('/password')
  updateMyPassword() {}
}

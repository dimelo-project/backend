import { NotLoggedInGuard } from './../auth/not-logged-in.guard';
import { LoggedInGuard } from './../auth/logged-in.guard';
import { LocalAuthGuard } from './../auth/local.auth.guard';
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
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원 가입' })
  @UseGuards(new NotLoggedInGuard())
  @Post('/signup')
  async signup(@Body() data: CreateUserDto) {
    await this.usersService.createUser(
      data.email,
      data.nickname,
      data.password,
    );
  }

  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@User() user) {
    return user;
  }

  @UseGuards(new LoggedInGuard())
  @ApiOperation({ summary: '로그아웃' })
  @Post('/logout')
  logout(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('로그아웃 되었습니다');
  }

  @ApiOperation({ summary: '이메일 중복 확인' })
  @Post('/check/email')
  checkEmail() {}

  @ApiOperation({ summary: '닉네임 중복 확인' })
  @Post('/check/nickname')
  checkNickname() {}

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

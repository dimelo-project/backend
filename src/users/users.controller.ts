import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  @ApiOperation({ summary: '회원 가입' })
  @Post('/signup')
  signup() {}

  @ApiOperation({ summary: '로그인' })
  @Post('/login')
  login() {}

  @ApiOperation({ summary: '로그아웃' })
  @Post('/logout')
  logout() {}

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

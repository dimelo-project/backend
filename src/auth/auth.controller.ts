import { UserDto } from './../users/dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { NotLoggedInGuard } from '../common/guards/not-logged-in.guard';
import { LoggedInGuard } from '../common/guards/logged-in.guard';
import { LocalLoginUserDto } from './dto/local-login-user.dto';
import { User } from './../common/decorators/user.decorator';
import { LocalAuthGuard } from './guard/local.auth.guard';
import { ReturnUserDto } from './../users/dto/return-user.dto';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { CreateUserProfile } from './dto/create-user-profile.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authSerivce: AuthService) {}

  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
  })
  @ApiOperation({ summary: '회원 가입' })
  @UseGuards(new NotLoggedInGuard())
  @Serialize(ReturnUserDto)
  @Post('/signup')
  async signup(@Body() data: CreateUserDto) {
    const user = await this.authSerivce.createUser(data.email, data.password);
    return user;
  }

  @ApiResponse({
    status: 201,
    description: '로그인 성공',
    type: ReturnUserDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@User() user, @Body() data: LocalLoginUserDto) {
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

  @UseGuards(AuthGuard('google'))
  @Get('/google')
  async googleAuth(@Req() req) {}

  @UseGuards(AuthGuard('google'))
  @Get('/google/redirect')
  googleAuthRedirect(@User() user) {
    return user;
  }

  @UseGuards(AuthGuard('github'))
  @Get('/github')
  async githubAuth(@Req() req) {}

  @UseGuards(AuthGuard('github'))
  @Get('/github/callback')
  githubAuthCallback(@User() user) {
    return user;
  }

  @ApiOperation({ summary: '이메일 중복 확인' })
  @Post('/check/email')
  async checkEmail(@Body('email') email: string) {
    return await this.authSerivce.checkEmail(email);
  }

  @ApiOperation({ summary: '닉네임 중복 확인' })
  @Post('/check/nickname')
  async checkNickname(@Body('nickname') nickname: string) {
    return await this.authSerivce.checkNickname(nickname);
  }

  @ApiOperation({ summary: '회원가입 후 사용자 프로필 만들기' })
  @Serialize(ReturnUserDto)
  @UseGuards(new LoggedInGuard())
  @Patch('/profile')
  async createUserProfile(
    @User() user: UserDto,
    @Body() data: CreateUserProfile,
  ) {
    return await this.authSerivce.createUserProfile(user.id, data);
  }
}

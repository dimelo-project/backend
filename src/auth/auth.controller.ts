import { CurrentUserDto } from './../common/dto/current-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { NotLoggedInGuard } from '../common/guards/not-logged-in.guard';
import { LoggedInGuard } from '../common/guards/logged-in.guard';
import { LocalLoginUserDto } from './dto/local-login-user.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LocalAuthGuard } from './guard/local.auth.guard';
import { ReturnUserDto } from '../common/dto/return-user.dto';
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
    return this.authSerivce.createUser(data.email, data.password);
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
  login(@CurrentUser() user: CurrentUserDto, @Body() data: LocalLoginUserDto) {
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
  googleAuthRedirect(@CurrentUser() user: CurrentUserDto) {
    return user;
  }

  @UseGuards(AuthGuard('github'))
  @Get('/github')
  async githubAuth(@Req() req) {}

  @UseGuards(AuthGuard('github'))
  @Get('/github/callback')
  githubAuthCallback(@CurrentUser() user: CurrentUserDto) {
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
    return this.authSerivce.checkNickname(nickname);
  }

  @ApiOperation({ summary: '비밀번호 찾기' })
  @Serialize(ReturnUserDto)
  @Post('/find/password')
  findMyPassword(@Body('email') email: string) {
    return this.authSerivce.sendMail(email);
  }
}

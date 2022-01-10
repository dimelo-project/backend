import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './../users/dto/create-user.dto';
import { NotLoggedInGuard } from './not-logged-in.guard';
import { LoggedInGuard } from './logged-in.guard';
import { LoginUserDto } from './../users/dto/login-user.dto';
import { User } from './../common/decorators/user.decorator';
import { LocalAuthGuard } from './local.auth.guard';
import { ReturnUserDto } from './../users/dto/return-user.dto';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authSerivce: AuthService) {}

  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
  })
  @ApiOperation({ summary: '회원 가입' })
  @UseGuards(new NotLoggedInGuard())
  @Post('/signup')
  async signup(@Body() data: CreateUserDto) {
    await this.authSerivce.createUser(data.email, data.nickname, data.password);
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
  login(@User() user, @Body() data: LoginUserDto) {
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
  googleAuthRedirect(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('github'))
  @Get('/github')
  async githubAuth(@Req() req) {}

  @UseGuards(AuthGuard('github'))
  @Get('/github/callback')
  githubAuthCallback(@Req() req) {
    return req.user;
  }
}

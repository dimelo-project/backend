import { CheckEmailDto } from './dto/check-email.dto';
import { CheckNicknameDto } from './dto/check-nickname.dto';
import { ReturnUserDto } from './../common/dto/return-user.dto';
import { CurrentUserDto } from './../common/dto/current-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { NotLoggedInGuard } from '../common/guards/not-logged-in.guard';
import { LoggedInGuard } from '../common/guards/logged-in.guard';
import { LocalLoginUserDto } from './dto/local-login-user.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LocalAuthGuard } from './guard/local.auth.guard';
import { AuthService } from './auth.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Serialize } from '../common/interceptors/serialize.interceptor';

@ApiTags('AUTH')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authSerivce: AuthService) {}

  @ApiOkResponse({
    description: '회원가입 성공',
    type: ReturnUserDto,
  })
  @ApiResponse({
    status: 400,
    description: '비밀번호가 8자 이하거나 영문, 숫자를 포함하지 않은 경우',
  })
  @ApiResponse({
    status: 409,
    description: '이미 해당하는 아이디가 있을 경우',
  })
  @ApiOperation({ summary: '회원 가입' })
  @UseGuards(new NotLoggedInGuard())
  @Serialize(ReturnUserDto)
  @Post('/signup')
  async signup(@Body() body: CreateUserDto) {
    return this.authSerivce.createUser(body.email, body.password);
  }

  @ApiResponse({
    status: 201,
    description: '로그인 성공',
    type: CurrentUserDto,
  })
  @ApiResponse({
    status: 401,
    description: '이메일이나 비밀번호가 일치하지 않은 경우',
  })
  @ApiOperation({ summary: '로그인' })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  login(@CurrentUser() user: CurrentUserDto, @Body() body: LocalLoginUserDto) {
    return user;
  }

  @ApiResponse({
    status: 201,
    description: '로그아웃 성공',
  })
  @ApiResponse({
    status: 403,
    description: '로그인을 하지 않았는데 로그아웃 시도한 경우',
  })
  @UseGuards(new LoggedInGuard())
  @ApiOperation({ summary: '로그아웃' })
  @Post('/logout')
  logout(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('로그아웃 되었습니다');
  }

  @ApiResponse({
    status: 200,
    description: '구글 로그인 화면으로 이동함',
  })
  @ApiOperation({ summary: '구글 로그인 하기' })
  @UseGuards(AuthGuard('google'))
  @Get('/google')
  async googleAuth(@Req() req) {}

  @ApiResponse({
    status: 301,
    description: '로그인 성공 후 메인 페이지로 이동',
  })
  @Redirect('http://www.dimelo.com', 301)
  @ApiOperation({ summary: '구글 로그인이 성공되었을 경우 메인페이지로 경로' })
  @UseGuards(AuthGuard('google'))
  @Get('/google/redirect')
  googleAuthRedirect() {}

  @ApiResponse({
    status: 200,
    description: '구글 로그인 화면으로 이동함',
  })
  @ApiOperation({ summary: '깃헙 로그인 하기' })
  @UseGuards(AuthGuard('github'))
  @Get('/github')
  async githubAuth(@Req() req) {}

  @ApiResponse({
    status: 301,
    description: '로그인 성공 후 메인 페이지로 이동',
  })
  @ApiOperation({ summary: '깃헙 로그인이 성공되었을 경우 메인페이지로 이동' })
  @Redirect('http://www.dimelo.com', 301)
  @UseGuards(AuthGuard('github'))
  @Get('/github/callback')
  githubAuthCallback() {}

  @ApiResponse({
    status: 201,
    description: '해당 이메일을 사용할 수 있음',
  })
  @ApiResponse({
    status: 400,
    description: '이메일이 잘못된 형식일 때',
  })
  @ApiResponse({
    status: 409,
    description: '해당 이메일이 이미 사용중인 경우',
  })
  @ApiOperation({ summary: '이메일 중복 확인' })
  @Post('/check/email')
  async checkEmail(@Body() body: CheckEmailDto) {
    return await this.authSerivce.checkEmail(body.email);
  }

  @ApiResponse({
    status: 201,
    description: '해당 닉네임을 사용할 수 있음',
  })
  @ApiResponse({
    status: 400,
    description: '닉네임을 전달하지 않았거나 닉네임이 10자 이상일 때',
  })
  @ApiResponse({
    status: 409,
    description: '해당 닉네임이 이미 사용중인 경우',
  })
  @ApiBody({})
  @ApiOperation({ summary: '닉네임 중복 확인' })
  @Post('/check/nickname')
  async checkNickname(@Body() body: CheckNicknameDto) {
    return this.authSerivce.checkNickname(body.nickname);
  }

  @ApiResponse({
    status: 201,
    description: '임시 비밀번호 해당 이메일로 발급',
  })
  @ApiResponse({
    status: 400,
    description: '이메일이 잘못된 형식일 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 유저를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '비밀번호 찾기' })
  @Serialize(ReturnUserDto)
  @Post('/find/password')
  findMyPassword(@Body() body: CheckEmailDto) {
    return this.authSerivce.sendMail(body.email);
  }
}

import { GithubAuthGuard } from './guard/github.auth.guard';
import { GoogleAuthGuard } from './guard/google.auth.guard';
import { CheckEmailDto } from './dto/check-email.dto';
import { ReturnUserDto } from './../common/dto/return-user.dto';
import { CurrentUserDto } from './../common/dto/current-user.dto';
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
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Serialize } from '../common/interceptors/serialize.interceptor';
import { MailService } from '../mail/mail.service';
import { config } from 'dotenv';
config();

@ApiTags('AUTH')
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authSerivce: AuthService,
    private readonly maileService: MailService,
  ) {}

  @ApiOkResponse({
    description: '회원가입 성공',
    type: ReturnUserDto,
  })
  @ApiResponse({
    status: 400,
    description: '비밀번호가 8자 이하거나 영문, 숫자를 포함하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '로그인한 상태에서 회원가입을 하려고한 경우',
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
    return this.authSerivce.createUser(
      body.email,
      body.password,
      body.passwordConfirm,
    );
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
  @UseGuards(GoogleAuthGuard)
  @Get('/google')
  async googleAuth() {}

  @ApiResponse({
    status: 301,
    description: '구글 로그인 성공시 메인/프로필 설정 페이지로 이동 시킴',
  })
  @ApiOperation({ summary: '구글 로그인 성공시 프로필 설정 페이지로 이동' })
  @UseGuards(GoogleAuthGuard)
  @Redirect(process.env.CLIENT_URL, 302)
  @Get('/google/redirect')
  googleAuthRedirect(@CurrentUser() user: CurrentUserDto) {
    if (user && !user.nickname) {
      return { url: `${process.env.CLIENT_URL}/profileset` };
    }
  }

  @ApiResponse({
    status: 200,
    description: '구글 로그인 화면으로 이동함',
  })
  @ApiOperation({ summary: '깃헙 로그인 하기' })
  @UseGuards(GithubAuthGuard)
  @Get('/github')
  async githubAuth() {}

  @ApiResponse({
    status: 301,
    description: '깃허브 로그인 성공시 메인/프로필 설정 페이지로 이동 시킴',
  })
  @ApiOperation({ summary: '깃허브 로그인 성공시 프로필 설정 페이지로 이동' })
  @UseGuards(GithubAuthGuard)
  @Redirect(process.env.CLIENT_URL, 302)
  @Get('/github/callback')
  githubAuthCallback(@CurrentUser() user: CurrentUserDto) {
    if (user && !user.nickname) {
      return { url: `${process.env.CLIENT_URL}/profileset` };
    }
  }

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
    description: '임시 비밀번호 해당 이메일로 발급',
  })
  @ApiResponse({
    status: 400,
    description: '이메일이 잘못된 형식일 경우',
  })
  @ApiResponse({
    status: 403,
    description: 'Oauth회원 비밀번호를 찾으려고 했을 경우',
  })
  @ApiResponse({
    status: 404,
    description: '해당 유저를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '비밀번호 찾기' })
  @Serialize(ReturnUserDto)
  @Post('/find/password')
  findMyPassword(@Body() body: CheckEmailDto) {
    return this.maileService.sendPassword(body.email);
  }
}

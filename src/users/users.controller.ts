import { CheckPasswordDto } from './dto/check-password.dto';
import { CheckNicknameDto } from './dto/check-nickname.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { ReturnUserDto } from './../common/dto/return-user.dto';
import { CurrentUserDto } from './../common/dto/current-user.dto';
import { CurrentUser } from './../common/decorators/current-user.decorator';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UndefinedToNullInterceptor } from './../common/interceptors/undefinedToNull.interceptor';
import { LoggedInGuard } from './../common/guards/logged-in.guard';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { UpdateUserDto } from './dto/update-user-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import { config } from 'dotenv';
config();

const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

@ApiTags('USER')
@UseInterceptors(UndefinedToNullInterceptor)
@UseGuards(new LoggedInGuard())
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    description: '내 프로필 받아오기 성공',
    type: ReturnUserDto,
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiOperation({ summary: '내 정보 받아오기' })
  @Serialize(ReturnUserDto)
  @Get('/me')
  async getMyInfo(@CurrentUser() user: CurrentUserDto) {
    return this.usersService.getMyInfo(user.id);
  }

  @ApiOkResponse({
    description: '내가 쓴 모든 댓글 받아오기 성공',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiOperation({ summary: '내가 쓴 모든 댓글 받아오기' })
  @Get('/me/comments')
  async getAllMyComments(@CurrentUser() user: CurrentUserDto) {
    return this.usersService.getMyComments(user.id);
  }

  @ApiResponse({
    status: 201,
    description: '해당 닉네임을 사용할 수 있음. true 반환',
  })
  @ApiResponse({
    status: 400,
    description: '닉네임을 전달하지 않았거나 닉네임이 10자 이상일 때',
  })
  @ApiResponse({
    status: 409,
    description: '해당 닉네임이 이미 사용중인 경우',
  })
  @ApiOperation({ summary: '닉네임 중복 확인' })
  @Post('/check/nickname')
  async checkNickname(
    @Body() body: CheckNicknameDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.usersService.checkNickname(body.nickname, user.id);
  }

  @ApiResponse({
    status: 200,
    type: ReturnUserDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'nickname, job, career 값을 제대로 보내지 않은 경우, 닉네임이 10자 이상인 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '이미 프로필 생성을 한 적이 있는 경우',
  })
  @ApiResponse({
    status: 409,
    description: '이미 해당하는 닉네임이 있을 경우',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '회원가입 후 사용자 프로필 만들기' })
  @Serialize(ReturnUserDto)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        key: function (request, file, cb) {
          cb(null, `${Date.now().toString()}-${file.originalname}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @Patch('/profile')
  async createUserProfile(
    @CurrentUser() user: CurrentUserDto,
    @Body() body: CreateUserProfileDto,
    @UploadedFile() file?: Express.MulterS3.File,
  ) {
    return this.usersService.createProfile(user.id, body, file);
  }

  @ApiOkResponse({
    description: '프로필 수정 성공',
    type: ReturnUserDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'nickname, job, career 값을 전달 하지 않은 경우, 닉네임이 10자 이상인 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiResponse({
    status: 409,
    description: '이미 해당하는 닉네임이 있을 경우',
  })
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: '내 정보 수정하기' })
  @Serialize(ReturnUserDto)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        key: function (request, file, cb) {
          cb(null, `${Date.now().toString()}-${file.originalname}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  @Patch('/me')
  async updateMyInfo(
    @CurrentUser() user: CurrentUserDto,
    @Body() body: UpdateUserDto,
    @UploadedFile() file?: Express.MulterS3.File,
  ) {
    return this.usersService.updateProfile(user.id, body, file);
  }

  @ApiResponse({
    status: 201,
    description: '회원 탈퇴 성공',
  })
  @ApiResponse({
    status: 400,
    description: '비밀번호 형식을 지키지 않은 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '비밀번호를 틀려 탈퇴 권한이 없을 경우',
  })
  @ApiOperation({ summary: '회원 탈퇴' })
  @Post('/delete/me')
  async deleteMyAccount(
    @CurrentUser() user: CurrentUserDto,
    @Body() body: DeleteUserDto,
    @Res() res,
  ) {
    if (this.usersService.delete(user.id, body.password)) {
      res.clearCookie('connect.sid', { httpOnly: true });
      res.send('탈퇴성공');
    }
  }

  @ApiResponse({
    status: 201,
    description: '회원 탈퇴 성공',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '비밀번호가 존재할 경우: 잘못된 경로',
  })
  @ApiOperation({ summary: 'Oauth 회원 탈퇴' })
  @Post('/deactivate/me')
  async deactivateMyAccount(@CurrentUser() user: CurrentUserDto, @Res() res) {
    if (this.usersService.deactivate(user.id)) {
      res.clearCookie('connect.sid', { httpOnly: true });
      res.send('탈퇴성공');
    }
  }

  @ApiOkResponse({
    description: '비밀번호 존재 여부: true/false',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @Get('/password')
  async checkIfIhavePassword(@CurrentUser() user: CurrentUserDto) {
    return this.usersService.checkPassword(user.id);
  }

  @ApiOkResponse({
    description: '비밀번호 변경 성공',
  })
  @ApiResponse({
    status: 400,
    description: '비밀번호 형식이 잘못되었거나 일치하지 않을 경우',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '비밀번호를 틀려 변경 권한이 없을 경우',
  })
  @ApiResponse({
    status: 409,
    description: '이전 비밀번호와 같은 비밀번호를 설정하려는 경우',
  })
  @ApiOperation({ summary: '비밀번호 변경하기' })
  @Patch('/change/password')
  async updateMyPassword(
    @CurrentUser() user: CurrentUserDto,
    @Body() body: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      user.id,
      body.password,
      body.newPassword,
      body.passwordConfirm,
    );
  }

  @ApiResponse({
    status: 201,
    description: '비밀번호 일치함 true',
  })
  @ApiResponse({
    status: 400,
    description: '비밀번호 형식을 잘못 보냈을 경우 (빈 문자열, number)',
  })
  @ApiResponse({
    status: 401,
    description: '로그인을 하지 않은 경우',
  })
  @ApiResponse({
    status: 403,
    description: '비밀번호를 틀린 경우',
  })
  @ApiOperation({ summary: '비밀번호 일치하는지 체크하기' })
  @Post('/check/password')
  async checkMyPassword(
    @CurrentUser() user: CurrentUserDto,
    @Body() body: CheckPasswordDto,
  ) {
    return this.usersService.checkMyPassword(user.id, body.password);
  }
}

import { DeleteUserDto } from './dto/delete-user.dto';
import { ReturnUserDto } from './../common/dto/return-user.dto';
import { SetPasswordDto } from './dto/set-password.dto';
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
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
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
    status: 404,
    description: '로그인을 하지 않은 경우',
  })
  @ApiOperation({ summary: '내 정보 받아오기' })
  @Serialize(ReturnUserDto)
  @Get('/me')
  async getMyInfo(@CurrentUser() user: CurrentUserDto) {
    return this.usersService.findById(user.id);
  }

  @ApiOkResponse({
    description: '프로필 생성 성공',
    type: ReturnUserDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'nickname, job, career 값을 제대로 보내지 않은 경우, 닉네임이 10자 이상인 경우',
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
    description: 'nickname, job, career 값을 전달 하지 않은 경우',
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
    console.log(file);
    return this.usersService.updateProfile(user.id, body, file);
  }

  @ApiOkResponse({
    description: '회원가입 탈퇴 성공',
  })
  @ApiResponse({
    status: 400,
    description: '비밀번호 형식을 지키지 않은 경우',
  })
  @ApiResponse({
    status: 401,
    description: '비밀번호를 틀려 탈퇴 권한이 없을 경우',
  })
  @ApiOperation({ summary: '회원 탈퇴' })
  @Post('/delete/me')
  async deleteMyAccount(
    @CurrentUser() user: CurrentUserDto,
    @Body() body: DeleteUserDto,
  ) {
    return this.usersService.delete(user.id, body.password);
  }

  @ApiOkResponse({
    description: '비밀번호 설정 성공',
    type: ReturnUserDto,
  })
  @ApiResponse({
    status: 400,
    description: '비밀번호 형식을 지키지 않은 경우',
  })
  @ApiOperation({ summary: '구글, 깃허브 회원 비밀번호 설정하기' })
  @Serialize(ReturnUserDto)
  @Patch('/set/password')
  async setNewPassword(
    @CurrentUser() user: CurrentUserDto,
    @Body() body: SetPasswordDto,
  ) {
    return this.usersService.setPassword(
      user.id,
      body.newPassword,
      body.passwordConfirm,
    );
  }

  @ApiOkResponse({
    description: '비밀번호 변경 성공',
    type: ReturnUserDto,
  })
  @ApiResponse({
    status: 400,
    description: '비밀번호 형식을 지키지 않은 경우',
  })
  @ApiResponse({
    status: 401,
    description: '비밀번호를 틀려 탈퇴 권한이 없을 경우',
  })
  @ApiOperation({ summary: '비밀번호 변경하기' })
  @Serialize(ReturnUserDto)
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

  @ApiOkResponse({
    description: '회원 프로필 받아오기 성공',
    type: ReturnUserDto,
  })
  @ApiResponse({
    status: 404,
    description: '해당 유저를 찾을 수 없는 경우',
  })
  @ApiOperation({ summary: '특정 회원 정보 받아오기' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'user id',
  })
  @Serialize(ReturnUserDto)
  @Get('/:id')
  async getUserInfo(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findById(id);
  }
}

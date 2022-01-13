import { SetPasswordDto } from './dto/set-password.dto';
import { CurrentUserDto } from './../common/dto/current-user.dto';
import { CurrentUser } from './../common/decorators/current-user.decorator';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UndefinedToNullInterceptor } from './../common/interceptors/undefinedToNull.interceptor';
import { ReturnUserDto } from '../common/dto/return-user.dto';
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
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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

  @ApiOperation({ summary: '내 정보 받아오기' })
  @Serialize(ReturnUserDto)
  @Get('/me')
  async getMyInfo(@CurrentUser() user: CurrentUserDto) {
    return this.usersService.findById(user.id);
  }

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
    @Body() body: Partial<UpdateUserDto>,
    @UploadedFile() file?: Express.MulterS3.File,
  ) {
    console.log(file);
    return this.usersService.updateProfile(user.id, body, file);
  }

  @ApiOperation({ summary: '회원 탈퇴' })
  @Post('/delete/me')
  async deleteMyAccount(
    @CurrentUser() user: CurrentUserDto,
    @Body('password') password: string,
  ) {
    return this.usersService.delete(user.id, password);
  }

  @ApiOperation({ summary: '비밀번호 설정하기' })
  @Serialize(ReturnUserDto)
  @Patch('/set/password')
  async setNewPassword(
    @CurrentUser() user: CurrentUserDto,
    @Body() body: SetPasswordDto,
  ) {
    return this.usersService.setPassword(
      user.id,
      body.newPassword,
      body.checkPassword,
    );
  }

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
      body.checkPassword,
    );
  }

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

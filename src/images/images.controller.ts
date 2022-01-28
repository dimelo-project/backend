import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ImagesService } from './images.service';
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import { config } from 'dotenv';
config();

const s3 = new AWS.S3();

export const multerConfig = {
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    key: function (request, file, cb) {
      cb(null, `${Date.now().toString()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
};

@ApiTags('IMAGE')
@Controller('/api/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
  @ApiResponse({
    status: 201,
    description: '이미지 url 받아오기 성공',
  })
  @ApiOperation({ summary: '사진 업로드 하기' })
  @ApiProperty({
    type: 'file',
    format: 'binary',
    required: true,
    description: '프로필 사진을 올릴 때 file로 들어가는 key',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @Post()
  async uploadImage(@UploadedFile() file: Express.MulterS3.File) {
    return this.imagesService.upload(file);
  }
}

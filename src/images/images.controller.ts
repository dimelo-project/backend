import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
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

@Controller('/api/images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @ApiOperation({ summary: '사진 업로드 하기' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @Post()
  async uploadImage(@UploadedFile() file: Express.MulterS3.File) {
    return this.imagesService.upload(file);
  }
}

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
  ConflictException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import AWS from 'aws-sdk';
import { config } from 'dotenv';
config();

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
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(@UploadedFile() file) {
    AWS.config.update({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    try {
      const objectName = `${Date.now()}_${file.originalname}`;
      await new AWS.S3()
        .putObject({
          Key: objectName,
          Body: file.buffer,
          Bucket: process.env.AWS_BUCKET_NAME,
          ACL: 'public-read',
        })
        .promise();
      const url = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${objectName}`;
      return { url };
    } catch (error) {
      throw new ConflictException('다시 시도해 주세요');
    }
  }
}

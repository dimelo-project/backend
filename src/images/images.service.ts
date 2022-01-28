import * as path from 'path';
import * as AWS from 'aws-sdk';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PromiseResult } from 'aws-sdk/lib/request';

@Injectable()
export class ImagesService {
  private readonly awsS3: AWS.S3;
  public readonly S3_BUCKET_NAME: string;

  constructor(private readonly configService: ConfigService) {
    this.awsS3 = new AWS.S3({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_BUCKET_REGION'),
    });
    this.S3_BUCKET_NAME = this.configService.get('AWS_BUCKET_NAME');
  }

  async upload(file: Express.MulterS3.File) {
    return file.location;
  }
}

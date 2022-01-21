import { Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';

@Injectable()
export class ImagesService {
  private readonly s3;
  constructor(
    @Inject('ACCESSKEYID') private readonly accessKeyId,
    @Inject('SECRETACCESSKEY') private readonly secretAccessKey,
    @Inject('REGION') private readonly region,
  ) {
    AWS.config.update({ accessKeyId, secretAccessKey, region });
    this.s3 = new AWS.S3();
  }

  async upload(file: Express.MulterS3.File) {
    return file.location;
  }
}

import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { config } from 'dotenv';
config();

@Module({
  controllers: [ImagesController],
  providers: [
    ImagesService,
    {
      provide: 'ACCESSKEYID',
      useValue: process.env.AWS_ACCESS_KEY,
    },
    {
      provide: 'SECRETACCESSKEY',
      useValue: process.env.AWS_SECRET_ACCESS_KEY,
    },
    {
      provide: 'REGION',
      useValue: process.env.AWS_BUCKET_REGION,
    },
  ],
})
export class ImagesModule {}

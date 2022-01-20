import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { Users } from 'src/entities/Users';

import { config } from 'dotenv';
config();

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    MailerModule.forRoot({
      transport: {
        service: process.env.NODEMAILER_SERVICE,
        host: process.env.NODEMAILER_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.NODEMAILER_USER,
          pass: process.env.NODEMAILER_PASS,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

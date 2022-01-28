import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { Users } from 'src/entities/Users';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          transport: {
            service: config.get('NODEMAILER_SERVICE'),
            host: config.get('NODEMAILER_HOST'),
            port: 587,
            secure: false,
            auth: {
              user: config.get('NODEMAILER_USER'),
              pass: config.get('NODEMAILER_PASS'),
            },
          },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

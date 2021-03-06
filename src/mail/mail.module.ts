import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { Users } from '../entities/Users';
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
            service: config.get<string>('NODEMAILER_SERVICE'),
            host: config.get<string>('NODEMAILER_HOST'),
            port: config.get<number>('NODEMAILER_PORT'),
            secure: true,
            auth: {
              type: 'OAuth2',
              user: config.get<string>('OAUTH_USER'),
              clientId: config.get<string>('OAUTH_CLIENT_ID'),
              clientSecret: config.get<string>('OAUTH_CLIENT_SECRET'),
              refreshToken: config.get<string>('OAUTH_REFRESH_TOKEN'),
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

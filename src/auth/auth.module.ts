import { MailModule } from './../mail/mail.module';
import { GithubStrategy } from './passport/github.strategy';
import { GoogleStrategy } from './passport/google.strategy';
import { AuthController } from './auth.controller';
import { LocalSerializer } from './passport/local.serializer';
import { LocalStrategy } from './passport/local.strategy';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
@Module({
  imports: [
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([Users]),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    GithubStrategy,
    LocalStrategy,
    LocalSerializer,
  ],
})
export class AuthModule {}

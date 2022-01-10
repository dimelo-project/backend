import { GithubStrategy } from './github.strategy';
import { GoogleStrategy } from './google.strategy';
import { AuthController } from './auth.controller';
import { LocalSerializer } from './local.serializer';
import { LocalStrategy } from './local.strategy';
import { AuthService } from './auth.service';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([Users]),
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

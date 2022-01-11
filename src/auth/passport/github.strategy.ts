import { GithubLoginUserDto } from '../dto/github-login-user.dto';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Strategy, VerifyCallback } from 'passport-github2';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, avatar_url, name, email } = profile._json;
    const githubUser: GithubLoginUserDto = {
      githubId: +id,
      email,
      imageUrl: avatar_url,
    };
    const user = await this.authService.githubSignUp(githubUser);
    done(null, user);
  }
}
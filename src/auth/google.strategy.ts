import { AuthService } from './auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';
import { Injectable } from '@nestjs/common';
import { GoogleCreateUserDto } from './dto/google-create-user.dto';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, photos } = profile;
    const googleUser: GoogleCreateUserDto = {
      googleId: profile.id,
      email: emails[0].value,
      imageUrl: photos[0].value,
    };
    const user = await this.authService.googleSignUp(googleUser);
    done(null, user);
  }
}

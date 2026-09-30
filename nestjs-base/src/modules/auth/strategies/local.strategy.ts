import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LOCAL_STRATEGY } from '../../../common/constants';
import { User } from '../../users/entities/user.entity';
import { AuthService } from '../auth.service';

/** Xác thực email + password cho POST /auth/login */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, LOCAL_STRATEGY) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }

  validate(email: string, password: string): Promise<User> {
    return this.authService.validateCredentials(email, password);
  }
}

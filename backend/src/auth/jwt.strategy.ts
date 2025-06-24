import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.schema';

interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'default',
    });
  }

  async validate(
    payload: JwtPayload,
  ): Promise<{ id: string; email: string } | null> {
    const user: User | null = await this.usersService.findByEmail(
      payload.email,
    );
    if (!user) {
      return null;
    }
    return { id: user._id.toString(), email: user.email };
  }
}

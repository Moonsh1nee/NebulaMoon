import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user: User | null = await this.usersService.validateUser(
      email,
      password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user._id.toString(), email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user._id.toString(), email: user.email, name: user.name },
    };
  }

  async register(email: string, password: string, name?: string) {
    const user = await this.usersService.create(email, password, name);
    const payload = { sub: user._id.toString(), email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user._id.toString(), email: user.email, name: user.name },
    };
  }
}

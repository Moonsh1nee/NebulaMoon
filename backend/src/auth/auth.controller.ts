import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(200)
  async signUp(
    @Body() body: { email: string; password: string; name?: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!body.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new BadRequestException('Invalid email format');
    }
    if (body.password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }
    const { access_token } = await this.authService.signUp(
      body.email,
      body.password,
      body.name,
    );
    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });
    return { message: 'User registered successfully' };
  }

  @Post('login')
  @HttpCode(200)
  async signIn(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!body.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new BadRequestException('Invalid email format');
    }
    if (body.password.length < 8) {
      throw new BadRequestException(
        'Password must be at least 8 characters long',
      );
    }
    const { access_token } = await this.authService.signIn(
      body.email,
      body.password,
    );
    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });
    return { message: 'User logged in successfully' };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return { message: 'User logged out successfully' };
  }
}

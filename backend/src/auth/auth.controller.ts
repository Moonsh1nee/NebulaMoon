import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Response, Request as ExpressRequest } from 'express';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserDocument } from 'src/users/user.schema';
import { ConfigService } from '@nestjs/config';

interface AuthenticatedRequest {
  user: UserDocument;
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, userId, email } =
      await this.authService.register(registerDto);

    const payload = { sub: userId, email };
    const refreshToken = this.authService['jwtService'].sign(payload, {
      expiresIn: '7d',
    });

    await this.authService.saveRefreshToken(userId, refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { message: 'Registration successful', userId, email };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, user } = await this.authService.login(loginDto);

    const payload = { sub: user.userId, email: user.email };
    const refreshToken = this.authService['jwtService'].sign(payload, {
      expiresIn: '7d',
    });

    await this.authService.saveRefreshToken(user.userId, refreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { message: 'Login successful' };
  }

  @Post('refresh')
  async refresh(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken || '';
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const { accessToken, userId, email } =
      await this.authService.refresh(refreshToken);

    const newPayload = { sub: userId, email };
    const newRefreshToken = this.authService['jwtService'].sign(newPayload, {
      expiresIn: '7d',
    });

    await this.authService.saveRefreshToken(userId, newRefreshToken);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { message: 'Token refreshed successfully' };
  }

  @Post('logout')
  async logout(
    @Request() req: ExpressRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await this.authService.clearRefreshToken(refreshToken);
    }
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
    });
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
    });
    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: AuthenticatedRequest) {
    const { _id, email, name } = req.user;
    return { userId: _id.toString(), email, name };
  }
}

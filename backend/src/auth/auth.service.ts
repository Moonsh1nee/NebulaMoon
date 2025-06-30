import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(
    registerDto: RegisterDto,
  ): Promise<{ accessToken: string; userId: string; email: string }> {
    const { email, password, name } = registerDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userModel.create({
      email,
      password: hashedPassword,
      name,
      refreshToken: null,
    });

    const payload = { sub: newUser._id.toString(), email: newUser.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      userId: newUser._id.toString(),
      email: newUser.email,
    };
  }

  async login(loginDto: LoginDto): Promise<{
    accessToken: string;
    user: { name?: string; email: string; userId: string };
  }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = { sub: user._id.toString(), email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: { name: user.name, email: user.email, userId: user._id.toString() },
    };
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ accessToken: string; userId: string; email: string }> {
    try {
      const payload = this.jwtService.verify<{ sub: string; email: string }>(
        refreshToken,
      );
      if (!payload || !payload.sub || !payload.email) {
        throw new BadRequestException('Invalid refresh token');
      }
      const user = await this.userModel.findById(payload.sub);

      if (!user || user.refreshToken !== refreshToken) {
        throw new BadRequestException('Invalid refresh token');
      }

      const newPayload = { sub: user._id.toString(), email: user.email };
      const accessToken = this.jwtService.sign(newPayload);
      return { accessToken, userId: user._id.toString(), email: user.email };
    } catch (err) {
      console.error('Refresh token error:', err);
      throw new BadRequestException('Invalid refresh token');
    }
  }

  async saveRefreshToken(userId: string, refreshToken: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(
      userId,
      { refreshToken },
      { new: true },
    );
  }

  async clearRefreshToken(refreshToken: string): Promise<void> {
    const user = await this.userModel.findOne({ refreshToken });
    if (user) {
      await this.userModel.findByIdAndUpdate(user._id, {
        refreshToken: null,
      });
    }
  }

  async validateUser(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }
}

import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    email: string,
    password: string,
    name?: string,
  ): Promise<{ access_token: string }> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      email,
      password: hashedPassword,
      name,
    });

    const payload = { email: user.email, sub: user._id.toString() };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user._id.toString() };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }

  async validateUser(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId);
  }
}

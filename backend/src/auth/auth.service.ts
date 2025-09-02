import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/user.schema';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Session, SessionDocument } from './session.schema';
import { TokenService } from './token.service';
import { TokenPayload } from './token-payload';
import { UAParser } from 'ua-parser-js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private readonly MAX_ACTIVE_SESSIONS = 5;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto, userAgent?: string, ip?: string) {
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
    });

    const accessToken = this.tokenService.generateAccessToken(
      newUser._id.toString(),
      newUser.email,
    );
    const refreshToken = this.tokenService.generateRefreshToken(
      newUser._id.toString(),
      newUser.email,
    );
    await this.createSession(
      newUser._id.toString(),
      refreshToken,
      userAgent,
      ip,
    );

    await this.revokeByFingerprint(newUser._id.toString(), userAgent, ip);
    await this.enforceSessionLimit(newUser._id.toString(), 1);

    return {
      accessToken,
      refreshToken,
      userId: newUser._id.toString(),
      email: newUser.email,
    };
  }

  async login(loginDto: LoginDto, userAgent?: string, ip?: string) {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = this.tokenService.generateAccessToken(
      user._id.toString(),
      user.email,
    );
    const refreshToken = this.tokenService.generateRefreshToken(
      user._id.toString(),
      user.email,
    );

    await this.revokeByFingerprint(user._id.toString(), userAgent, ip);
    await this.enforceSessionLimit(user._id.toString(), 1);

    await this.createSession(user._id.toString(), refreshToken, userAgent, ip);

    return {
      accessToken,
      refreshToken,
      userId: user._id.toString(),
      email: user.email,
    };
  }

  async refresh(refreshToken: string, userAgent?: string, ip?: string) {
    this.logger.log(
      'Refreshing token for userAgent: ' + userAgent + ', ip: ' + ip,
    );

    let payload: TokenPayload;
    try {
      payload = this.tokenService.verifyToken(refreshToken);
    } catch (error) {
      this.logger.warn(`Invalid refresh token: ${error.message}`);
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (payload.type !== 'refresh') {
      this.logger.warn('Token type is not refresh');
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userModel.findById(payload.sub);
    if (!user) {
      this.logger.warn(`User not found for ID: ${payload.sub}`);
      throw new UnauthorizedException('User not found');
    }

    const session = await this.findValidSession(
      user._id.toString(),
      refreshToken,
      userAgent,
      ip,
    );
    if (!session) {
      this.logger.warn(`No valid session found for user: ${user._id}`);
      throw new UnauthorizedException('Session not found or revoked');
    }

    const newAccessToken = this.tokenService.generateAccessToken(
      user._id.toString(),
      user.email,
    );
    const newRefreshToken = this.tokenService.generateRefreshToken(
      user._id.toString(),
      user.email,
    );

    await this.revokeSession(session._id.toString());
    await this.enforceSessionLimit(user._id.toString(), 1);
    await this.createSession(
      user._id.toString(),
      newRefreshToken,
      userAgent,
      ip,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      userId: user._id.toString(),
      email: user.email,
    };
  }

  async logout(refreshToken: string, userAgent?: string, ip?: string) {
    try {
      const payload = this.tokenService.verifyToken(refreshToken);
      const session = await this.findValidSession(
        payload.sub,
        refreshToken,
        userAgent,
        ip,
      );
      if (session) {
        await this.revokeSession(session._id.toString());
      } else {
        await this.revokeByFingerprint(payload.sub, userAgent, ip);
      }
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async profile(accessToken: string) {
    const payload = this.tokenService.verifyToken(accessToken);
    const user = await this.userModel.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return {
      userId: user._id.toString(),
      email: user.email,
    };
  }

  async logoutBySessionId(userId: string, sessionId: string) {
    const session = await this.sessionModel.findOne({
      _id: new Types.ObjectId(sessionId),
      userId: new Types.ObjectId(userId),
    });
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    session.revoked = true;
    session.revokedAt = new Date();
    await session.save();
  }

  async listUserSessions(userId: string) {
    const sessions = await this.sessionModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean();
    return sessions.map((s) => ({
      sessionId: s._id.toString(),
      userAgent: s.userAgent,
      ip: s.ip,
      revoked: s.revoked,
      deviceName: s.deviceName,
      browser: s.browser,
      os: s.os,
      platform: s.platform,
    }));
  }

  async validateUser(id: string) {
    return this.userModel.findById(id);
  }

  // Session helpers
  private parseUserAgent(userAgent?: string) {
    const parser = new UAParser(userAgent || undefined);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    const deviceName =
      [device.vendor, device.model].filter(Boolean).join(' ').trim() ||
      'Unknown Device';

    return {
      browser: browser.name
        ? `${browser.name} ${browser.version || ''}`.trim()
        : 'Unknown Browser',
      os: os.name ? `${os.name} ${os.version || ''}`.trim() : 'Unknown OS',
      platform: device.type || 'Unknown Platform',
      deviceName,
    };
  }

  private async createSession(
    userId: string,
    refreshToken: string,
    userAgent?: string,
    ip?: string,
  ) {
    const hash = await bcrypt.hash(refreshToken, 10);
    const { browser, os, platform, deviceName } =
      this.parseUserAgent(userAgent);

    return this.sessionModel.create({
      userId: new Types.ObjectId(userId),
      refreshTokenHash: hash,
      userAgent,
      ip,
      deviceName,
      browser,
      os,
      platform,
      lastUsedAt: new Date(),
    });
  }

  private async findValidSession(
    userId: string,
    refreshToken: string,
    userAgent?: string,
    ip?: string,
  ) {
    const session = await this.sessionModel.find({
      userId: new Types.ObjectId(userId),
      revoked: false,
      userAgent,
      ip,
    });
    for (const s of session) {
      if (await bcrypt.compare(refreshToken, s.refreshTokenHash)) {
        s.lastUsedAt = new Date();
        await s.save();
        return s;
      }
    }
    return null;
  }

  private async updateSessionToken(
    sessionId: string,
    newRefreshToken: string,
    userAgent?: string,
    ip?: string,
  ) {
    const hash = await bcrypt.hash(newRefreshToken, 10);
    await this.sessionModel.findByIdAndUpdate(
      sessionId,
      {
        refreshTokenHash: hash,
        userAgent,
        ip,
        updatedAt: new Date(),
      },
      { new: true },
    );
  }

  private async revokeByFingerprint(
    userId: string,
    userAgent?: string,
    ip?: string,
  ) {
    await this.sessionModel.updateMany(
      {
        userId: new Types.ObjectId(userId),
        userAgent,
        ip,
        revoked: false,
      },
      { $set: { revoked: true, revokedAt: new Date() } },
    );
  }

  private async enforceSessionLimit(userId: string, willCreate = 1) {
    const activeCount = await this.sessionModel.countDocuments({
      userId: new Types.ObjectId(userId),
      revoked: false,
    });

    const targetMax = this.MAX_ACTIVE_SESSIONS - willCreate;
    if (activeCount > targetMax) {
      const toRevoke = activeCount - targetMax;
      const oldest = await this.sessionModel
        .find({
          userId: new Types.ObjectId(userId),
          revoked: false,
        })
        .sort({ createdAt: 1 })
        .limit(toRevoke)
        .select('_id');

      const ids = oldest.map((s) => s._id);
      if (ids.length) {
        await this.sessionModel.updateMany(
          { _id: { $in: ids } },
          { $set: { revoked: true, revokedAt: new Date() } },
        );
      }
    }
  }

  private async revokeSession(sessionId: string) {
    await this.sessionModel.findByIdAndUpdate(sessionId, {
      revoked: true,
      revokedAt: new Date(),
    });
  }
}

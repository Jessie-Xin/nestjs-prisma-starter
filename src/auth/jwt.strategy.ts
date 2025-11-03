import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { JwtDto } from './dto/jwt.dto';

/**
 * JWT 策略
 * 用于验证 JWT 令牌的 Passport 策略
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // 认证服务，用于验证用户
    private readonly authService: AuthService,
    // 配置服务，用于获取 JWT 密钥
    readonly configService: ConfigService,
  ) {
    // 调用父类构造函数，配置 JWT 提取和验证选项
    super({
      // 从请求头的 Authorization 字段中提取 JWT
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 使用配置中的 JWT 访问密钥进行验证
      secretOrKey: configService.get('JWT_ACCESS_SECRET'),
    });
  }

  /**
   * 验证 JWT 令牌载荷
   * @param payload JWT 令牌载荷
   * @returns 验证通过的用户对象
   */
  async validate(payload: JwtDto): Promise<User> {
    // 根据载荷中的用户ID验证用户
    const user = await this.authService.validateUser(payload.userId);
    if (!user) {
      // 用户不存在时抛出未授权异常
      throw new UnauthorizedException();
    }
    // 返回验证通过的用户对象
    return user;
  }
}

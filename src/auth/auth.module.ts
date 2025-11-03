import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { PasswordService } from './password.service';
import { GqlAuthGuard } from './gql-auth.guard';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { SecurityConfig } from '../common/configs/config.interface';

/**
 * 认证模块
 * 配置 JWT 认证和 Passport 策略
 */
@Module({
  imports: [
    // 注册 Passport 模块并设置默认策略为 JWT
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // 异步配置 JWT 模块，从配置中获取密钥和过期时间
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: securityConfig.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    // 认证服务
    AuthService,
    // GraphQL 认证解析器
    AuthResolver,
    // JWT 策略
    JwtStrategy,
    // GraphQL 认证守卫
    GqlAuthGuard,
    // 密码服务
    PasswordService,
  ],
  exports: [
    // 导出 GraphQL 认证守卫供其他模块使用
    GqlAuthGuard,
  ],
})
export class AuthModule {}

import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './models/auth.model';
import { Token } from './models/token.model';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { User } from '../users/models/user.model';

/**
 * 认证解析器
 * 处理 GraphQL 认证相关的请求
 */
@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  /**
   * 用户注册
   * @param data 注册输入数据
   * @returns 访问令牌和刷新令牌
   */
  @Mutation(() => Auth)
  async signup(@Args('data') data: SignupInput) {
    // 将邮箱转换为小写
    data.email = data.email.toLowerCase();
    const { accessToken, refreshToken } = await this.auth.createUser(data);
    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 用户登录
   * @param email 邮箱
   * @param password 密码
   * @returns 访问令牌和刷新令牌
   */
  @Mutation(() => Auth)
  async login(@Args('data') { email, password }: LoginInput) {
    const { accessToken, refreshToken } = await this.auth.login(
      email.toLowerCase(),
      password,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * 刷新令牌
   * @param token 刷新令牌
   * @returns 新的访问令牌和刷新令牌
   */
  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    return this.auth.refreshToken(token);
  }

  /**
   * 解析 Auth 对象中的用户字段
   * @param auth 认证对象
   * @returns 用户对象
   */
  @ResolveField('user', () => User)
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.accessToken);
  }
}

import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLJWT } from 'graphql-scalars';

/**
 * 令牌模型
 * 定义 JWT 访问令牌和刷新令牌的结构
 */
@ObjectType()
export class Token {
  /**
   * 访问令牌
   * 用于访问受保护资源的 JWT 令牌
   */
  @Field(() => GraphQLJWT, { description: 'JWT access token' })
  accessToken: string;

  /**
   * 刷新令牌
   * 用于获取新的访问令牌的 JWT 令牌
   */
  @Field(() => GraphQLJWT, { description: 'JWT refresh token' })
  refreshToken: string;
}

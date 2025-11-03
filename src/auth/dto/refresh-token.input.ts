import { ArgsType, Field } from '@nestjs/graphql';
import { IsJWT, IsNotEmpty } from 'class-validator';
import { GraphQLJWT } from 'graphql-scalars';

/**
 * 刷新令牌输入数据
 * 定义刷新令牌时需要提供的信息，包含 JWT 令牌
 */
@ArgsType()
export class RefreshTokenInput {
  /**
   * 刷新令牌
   * 非空且必须是有效的 JWT 格式
   */
  @IsNotEmpty()
  @IsJWT()
  @Field(() => GraphQLJWT)
  token: string;
}

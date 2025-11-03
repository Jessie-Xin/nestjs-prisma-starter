import { ObjectType } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { Token } from './token.model';

/**
 * 认证模型
 * 继承自 Token 模型，包含用户信息
 */
@ObjectType()
export class Auth extends Token {
  /**
   * 用户对象
   * 包含认证用户的详细信息
   */
  user: User;
}

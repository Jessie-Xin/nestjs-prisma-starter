import { ArgsType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

/**
 * 用户ID参数类
 * 用于接收用户ID参数，验证其非空性
 */
@ArgsType()
export class UserIdArgs {
  /**
   * 用户ID
   * 非空字段，用于标识特定用户
   */
  @IsNotEmpty()
  userId: string;
}

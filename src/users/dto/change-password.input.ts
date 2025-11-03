import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, MinLength } from 'class-validator';

/**
 * 更改密码输入数据
 * 定义更改用户密码时需要提供的信息，包括旧密码和新密码
 */
@InputType()
export class ChangePasswordInput {
  /**
   * 旧密码
   * 非空且至少包含8个字符
   */
  @Field()
  @IsNotEmpty()
  @MinLength(8)
  oldPassword: string;

  /**
   * 新密码
   * 非空且至少包含8个字符
   */
  @Field()
  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}

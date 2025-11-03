import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

/**
 * 登录输入数据
 * 定义用户登录时需要提供的信息，包括邮箱和密码
 */
@InputType()
export class LoginInput {
  /**
   * 用户邮箱
   * 需要是一个有效的邮箱地址
   */
  @Field()
  @IsEmail()
  email: string;

  /**
   * 用户密码
   * 非空且至少包含8个字符
   */
  @Field()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

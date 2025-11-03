import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

/**
 * 注册输入数据
 * 定义用户注册时需要提供的信息，包括邮箱、密码和可选的姓名
 */
@InputType()
export class SignupInput {
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

  /**
   * 用户名（可选）
   * 可选的用户名字
   */
  @Field({ nullable: true })
  firstname?: string;

  /**
   * 用户姓（可选）
   * 可选的用户姓氏
   */
  @Field({ nullable: true })
  lastname?: string;
}

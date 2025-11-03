import { InputType, Field } from '@nestjs/graphql';

/**
 * 更新用户输入数据
 * 定义更新用户信息时可以提供的字段
 */
@InputType()
export class UpdateUserInput {
  /**
   * 用户名
   * 可选字段，用于更新用户名字
   */
  @Field({ nullable: true })
  firstname?: string;

  /**
   * 用户姓
   * 可选字段，用于更新用户姓氏
   */
  @Field({ nullable: true })
  lastname?: string;
}

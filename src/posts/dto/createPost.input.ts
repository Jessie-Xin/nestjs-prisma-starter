import { IsNotEmpty } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

/**
 * 创建文章输入数据
 * 定义创建文章时需要提供的信息，包括标题和内容
 */
@InputType()
export class CreatePostInput {
  /**
   * 文章内容
   * 非空字段，包含文章的详细内容
   */
  @Field()
  @IsNotEmpty()
  content: string;

  /**
   * 文章标题
   * 非空字段，包含文章的标题
   */
  @Field()
  @IsNotEmpty()
  title: string;
}

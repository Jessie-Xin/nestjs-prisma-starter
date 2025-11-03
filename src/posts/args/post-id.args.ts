import { ArgsType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

/**
 * 文章ID参数类
 * 用于接收文章ID参数，验证其非空性
 */
@ArgsType()
export class PostIdArgs {
  /**
   * 文章ID
   * 非空字段，用于标识特定文章
   */
  @IsNotEmpty()
  postId: string;
}

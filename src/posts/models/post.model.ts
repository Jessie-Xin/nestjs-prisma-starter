import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/models/user.model';
import { BaseModel } from '../../common/models/base.model';

/**
 * 文章模型
 * 继承自基础模型，包含文章的属性和关联信息
 */
@ObjectType()
export class Post extends BaseModel {
  /**
   * 文章标题
   * 文章的标题
   */
  @Field()
  title: string;

  /**
   * 文章内容
   * 文章的详细内容，可为空
   */
  @Field(() => String, { nullable: true })
  content?: string | null;

  /**
   * 发布状态
   * 标识文章是否已发布
   */
  @Field(() => Boolean)
  published: boolean;

  /**
   * 文章作者
   * 关联的文章作者信息，可为空
   */
  @Field(() => User, { nullable: true })
  author?: User | null;
}

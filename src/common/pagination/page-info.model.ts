import { Field, ObjectType } from '@nestjs/graphql';

/**
 * 分页信息模型
 * 包含分页查询的元信息，如是否有下一页、上一页以及游标信息
 */
@ObjectType()
export class PageInfo {
  /**
   * 结束游标
   * 指向当前页最后一个元素的游标，可能为空
   */
  @Field(() => String, { nullable: true })
  endCursor?: string;

  /**
   * 是否有下一页
   * 表示查询结果中是否还有更多数据
   */
  @Field(() => Boolean)
  hasNextPage: boolean;

  /**
   * 是否有上一页
   * 表示查询结果中是否有前一页数据
   */
  @Field(() => Boolean)
  hasPreviousPage: boolean;

  /**
   * 开始游标
   * 指向当前页第一个元素的游标，可能为空
   */
  @Field(() => String, { nullable: true })
  startCursor?: string;
}

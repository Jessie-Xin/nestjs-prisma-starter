import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { Order } from '../../common/order/order';

/**
 * 文章排序字段枚举
 * 定义文章可以按哪些字段进行排序
 */
export enum PostOrderField {
  /** 文章ID */
  id = 'id',
  /** 创建时间 */
  createdAt = 'createdAt',
  /** 更新时间 */
  updatedAt = 'updatedAt',
  /** 发布状态 */
  published = 'published',
  /** 标题 */
  title = 'title',
  /** 内容 */
  content = 'content',
}

// 注册 GraphQL 枚举类型
registerEnumType(PostOrderField, {
  name: 'PostOrderField', // 枚举名称
  description: 'Properties by which post connections can be ordered.', // 枚举描述
});

/**
 * 文章排序输入
 * 继承自基础排序类，指定文章排序的字段和方向
 */
@InputType()
export class PostOrder extends Order {
  /**
   * 排序字段
   * 指定按哪个字段进行排序
   */
  @Field(() => PostOrderField)
  field: PostOrderField;
}

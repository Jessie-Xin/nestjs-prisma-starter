import { registerEnumType } from '@nestjs/graphql';

/**
 * 排序方向枚举
 * 定义列表排序的可能方向
 */
export enum OrderDirection {
  /** 指定给定 `orderBy` 参数的升序 */
  asc = 'asc',
  /** 指定给定 `orderBy` 参数的降序 */
  desc = 'desc',
}

// 注册 GraphQL 枚举类型
registerEnumType(OrderDirection, {
  name: 'OrderDirection', // 枚举名称
  description:
    'Possible directions in which to order a list of items when provided an `orderBy` argument.', // 枚举描述
});

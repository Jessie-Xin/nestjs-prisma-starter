import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { PageInfo } from './page-info.model';

/**
 * 分页泛型函数
 * 创建一个分页类型，用于分页查询结果
 * @param TItemClass 要分页的项的类型
 * @returns 分页类型
 */
export default function Paginated<TItem>(TItemClass: Type<TItem>) {
  // 创建边缘类型，包含游标和节点
  @ObjectType(`${TItemClass.name}Edge`)
  abstract class EdgeType {
    /**
     * 游标
     * 指向节点的游标，用于分页
     */
    @Field(() => String)
    cursor: string;

    /**
     * 节点
     * 包含的实际数据项
     */
    @Field(() => TItemClass)
    node: TItem;
  }

  // `isAbstract` 装饰器选项是必需的，以防止在模式中注册
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    /**
     * 边缘列表
     * 包含带有游标的节点列表
     */
    @Field(() => [EdgeType], { nullable: true })
    edges: Array<EdgeType>;

    // @Field((type) => [TItemClass], { nullable: true })
    // nodes: Array<TItem>;

    /**
     * 页面信息
     * 包含分页相关的元信息
     */
    @Field(() => PageInfo)
    pageInfo: PageInfo;

    /**
     * 总计数
     * 查询结果的总数量
     */
    @Field(() => Int)
    totalCount: number;
  }
  return PaginatedType;
}

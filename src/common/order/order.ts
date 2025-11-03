import { Field, InputType } from '@nestjs/graphql';
import { OrderDirection } from './order-direction';

/**
 * 排序抽象类
 * 为排序输入提供基础结构，包含排序方向
 */
@InputType({ isAbstract: true })
export abstract class Order {
  /**
   * 排序方向
   * 指定列表排序的方向（升序或降序）
   */
  @Field(() => OrderDirection)
  direction: OrderDirection;
}

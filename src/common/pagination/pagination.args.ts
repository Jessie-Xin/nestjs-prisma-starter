import { ArgsType } from '@nestjs/graphql';

/**
 * 分页参数类
 * 定义分页查询所需的参数
 */
@ArgsType()
export class PaginationArgs {
  /**
   * 跳过的记录数
   * 从结果集开头跳过的记录数量
   */
  skip?: number;

  /**
   * 在指定游标之后的记录
   * 从指定游标位置之后开始获取记录
   */
  after?: string;

  /**
   * 在指定游标之前的记录
   * 在指定游标位置之前结束获取记录
   */
  before?: string;

  /**
   * 获取的记录数量（向前）
   * 从当前点向前获取的记录数量
   */
  first?: number;

  /**
   * 获取的记录数量（向后）
   * 从当前点向后获取的记录数量
   */
  last?: number;
}

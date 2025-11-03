import { Field, ObjectType, ID } from '@nestjs/graphql';

/**
 * 基础模型抽象类
 * 为所有实体模型提供通用字段，包括ID、创建时间和更新时间
 */
@ObjectType({ isAbstract: true })
export abstract class BaseModel {
  /**
   * 唯一标识符
   * 实体的唯一ID
   */
  @Field(() => ID)
  id: string;
  /**
   * 创建时间
   * 记录实体创建的日期和时间
   */
  @Field({
    description: 'Identifies the date and time when the object was created.',
  })
  createdAt: Date;

  /**
   * 更新时间
   * 记录实体最后更新的日期和时间
   */
  @Field({
    description:
      'Identifies the date and time when the object was last updated.',
  })
  updatedAt: Date;
}

import { ObjectType } from '@nestjs/graphql';
import PaginatedResponse from '../../common/pagination/pagination';
import { Post } from './post.model';

/**
 * 文章连接模型
 * 用于分页查询文章列表，继承自分页响应类型
 */
@ObjectType()
export class PostConnection extends PaginatedResponse(Post) {}

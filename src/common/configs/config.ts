import type { Config } from './config.interface';

/**
 * 应用程序配置对象
 * 包含应用程序的所有配置选项
 */
const config: Config = {
  nest: {
    // NestJS 应用程序配置
    port: 3000, // 应用程序运行端口
  },
  cors: {
    // CORS 配置
    enabled: true, // 启用跨源资源共享
  },
  swagger: {
    // Swagger API 文档配置
    enabled: true, // 启用 Swagger 文档
    title: 'NestJS Prisma Starter API', // API 文档标题
    description:
      'NestJS Prisma Starter 的 REST API 文档。\n\n' +
      '注意：本项目主要使用 GraphQL API，请访问 /graphql 使用 GraphQL Playground。\n' +
      '此处的 REST API 仅用于健康检查和基本操作。', // API 文档描述
    version: '1.5', // API 版本号
    path: 'api', // API 文档访问路径
  },
  graphql: {
    // GraphQL 配置
    playgroundEnabled: true, // 启用 GraphQL Playground
    debug: true, // 启用调试模式
    schemaDestination: './src/schema.graphql', // GraphQL 模式文件目标路径
    sortSchema: true, // 对模式进行排序
  },
  security: {
    // 安全配置
    expiresIn: 120, // 访问令牌过期时间（秒）- 2分钟
    refreshIn: 604800, // 刷新令牌过期时间（秒）- 7天 (7 * 24 * 60 * 60)
    bcryptSaltOrRound: 10, // bcrypt 哈希轮数
  },
};

/**
 * 默认配置导出函数
 * 返回应用程序配置对象
 * @returns 应用程序配置
 */
export default (): Config => config;

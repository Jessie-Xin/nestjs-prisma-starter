/**
 * 应用程序配置接口
 * 定义应用程序的所有配置选项
 */
export interface Config {
  /** NestJS 配置 */
  nest: NestConfig;
  /** CORS 配置 */
  cors: CorsConfig;
  /** Swagger 配置 */
  swagger: SwaggerConfig;
  /** GraphQL 配置 */
  graphql: GraphqlConfig;
  /** 安全配置 */
  security: SecurityConfig;
}

/**
 * NestJS 配置接口
 * 定义 NestJS 应用程序的配置选项
 */
export interface NestConfig {
  /** 应用程序端口 */
  port: number;
}

/**
 * CORS 配置接口
 * 定义跨源资源共享的配置选项
 */
export interface CorsConfig {
  /** 是否启用 CORS */
  enabled: boolean;
}

/**
 * Swagger 配置接口
 * 定义 Swagger API 文档的配置选项
 */
export interface SwaggerConfig {
  /** 是否启用 Swagger */
  enabled: boolean;
  /** API 文档标题 */
  title: string;
  /** API 文档描述 */
  description: string;
  /** API 版本 */
  version: string;
  /** API 文档路径 */
  path: string;
}

/**
 * GraphQL 配置接口
 * 定义 GraphQL 服务的配置选项
 */
export interface GraphqlConfig {
  /** 是否启用 GraphQL Playground */
  playgroundEnabled: boolean;
  /** 是否启用调试模式 */
  debug: boolean;
  /** GraphQL 模式文件目标路径 */
  schemaDestination: string;
  /** 是否对模式进行排序 */
  sortSchema: boolean;
}

/**
 * 安全配置接口
 * 定义应用程序安全相关的配置选项
 */
export interface SecurityConfig {
  /** 访问令牌过期时间（秒） */
  expiresIn: number;
  /** 刷新令牌过期时间（秒） */
  refreshIn: number;
  /** bcrypt 盐值或轮数 */
  bcryptSaltOrRound: string | number;
}

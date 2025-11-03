/**
 * JWT 令牌数据传输对象
 * 定义 JWT 令牌的结构，包含用户ID、签发时间和过期时间
 */
export interface JwtDto {
  userId: string;
  /**
   * 签发时间 (Issued at)
   */
  iat: number;
  /**
   * 过期时间 (Expiration time)
   */
  exp: number;
}

import { PrismaService } from '../prisma/prisma.service';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PasswordService } from '../auth/password.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';

/**
 * 用户服务
 * 提供用户相关的业务逻辑，如更新用户信息和更改密码
 */
@Injectable()
export class UsersService {
  constructor(
    // Prisma 服务，用于数据库操作
    private prisma: PrismaService,
    // 密码服务，用于密码验证和哈希
    private passwordService: PasswordService,
  ) {}

  /**
   * 更新用户信息
   * 根据用户ID更新用户信息
   * @param userId 用户ID
   * @param newUserData 新的用户数据
   * @returns 更新后的用户对象
   */
  updateUser(userId: string, newUserData: UpdateUserInput) {
    return this.prisma.user.update({
      data: newUserData, // 要更新的数据
      where: {
        id: userId, // 根据ID查找用户
      },
    });
  }

  /**
   * 更改用户密码
   * 验证旧密码后更新为新密码
   * @param userId 用户ID
   * @param userPassword 用户当前密码（已哈希）
   * @param changePassword 包含旧密码和新密码的输入数据
   * @returns 更新后的用户对象
   */
  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput,
  ) {
    // 验证提供的旧密码是否正确
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword,
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password'); // 旧密码不正确时抛出异常
    }

    // 对新密码进行哈希处理
    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword,
    );

    // 更新用户密码
    return this.prisma.user.update({
      data: {
        password: hashedPassword, // 设置为新哈希密码
      },
      where: { id: userId }, // 根据ID查找用户
    });
  }
}

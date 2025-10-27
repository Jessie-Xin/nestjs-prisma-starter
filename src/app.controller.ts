import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('健康检查')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: '健康检查',
    description: '检查应用是否正常运行',
  })
  @ApiResponse({
    status: 200,
    description: '应用运行正常',
    schema: {
      type: 'string',
      example: 'Hello World!',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('hello/:name')
  @ApiOperation({
    summary: '个性化问候',
    description: '返回带有指定名称的问候语',
  })
  @ApiParam({
    name: 'name',
    description: '用户名称',
    example: 'John',
  })
  @ApiResponse({
    status: 200,
    description: '返回问候语',
    schema: {
      type: 'string',
      example: 'Hello John',
    },
  })
  getHelloName(@Param('name') name: string): string {
    return this.appService.getHelloName(name);
  }
}

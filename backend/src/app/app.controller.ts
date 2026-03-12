import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return { message: 'Backend is up' };
  }

  @Post('api')
  async handleApi(@Body('index') index: number) {
    const numericIndex = Number(index);
    return this.appService.handleRequest(numericIndex);
  }
}

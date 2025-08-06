import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return "GET / ";
  }

  @Post()
  postNothing(): string{
    return "POST /"
  }
}

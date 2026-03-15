import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import Redis from 'ioredis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        const host = process.env.REDIS_HOST || 'localhost';
        const port = Number(process.env.REDIS_PORT || 6379);
        return new Redis({ host, port });
      },
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

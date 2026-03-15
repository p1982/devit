import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import type Redis from 'ioredis';

@Injectable()
export class AppService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis.Redis,
  ) {}

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async handleRequest(index: number): Promise<{ index: number }> {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const key = `rate:${nowInSeconds}`;

    const currentCount = await this.redisClient.incr(key);
    if (currentCount === 1) {
      await this.redisClient.expire(key, 2);
    }

    if (currentCount > 50) {
      throw new HttpException(
        'Rate limit of 50 requests per second exceeded',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const delay = Math.floor(Math.random() * 2000) + 1;
    await this.sleep(delay);

    return { index };
  }
}

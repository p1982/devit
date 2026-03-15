import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;
  let redisClientMock: { incr: jest.Mock; expire: jest.Mock };

  beforeEach(async () => {
    redisClientMock = {
      incr: jest.fn(),
      expire: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: 'REDIS_CLIENT',
          useValue: redisClientMock,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    (service as any).sleep = jest.fn().mockResolvedValue(undefined);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleRequest', () => {
    it('should return the index if limit is not exceeded', async () => {
      redisClientMock.incr.mockResolvedValue(10);
      
      const result = await service.handleRequest(1);
      
      expect(result).toEqual({ index: 1 });
      expect(redisClientMock.incr).toHaveBeenCalled();
      expect((service as any).sleep).toHaveBeenCalled();
    });

    it('should set expiration time on the first request in a second window', async () => {
      redisClientMock.incr.mockResolvedValue(1);
      redisClientMock.expire.mockResolvedValue(1);

      await service.handleRequest(2);

      expect(redisClientMock.incr).toHaveBeenCalled();
      expect(redisClientMock.expire).toHaveBeenCalledWith(expect.any(String), 2);
    });

    it('should throw HttpException if rate limit is exceeded', async () => {
      redisClientMock.incr.mockResolvedValue(51);

      await expect(service.handleRequest(3)).rejects.toThrow(HttpException);
      expect(redisClientMock.incr).toHaveBeenCalled();
      expect(redisClientMock.expire).not.toHaveBeenCalled();
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            handleRequest: jest.fn().mockResolvedValue({ index: 5 }),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getData', () => {
    it('should return "Backend is up" message', () => {
      expect(appController.getData()).toEqual({ message: 'Backend is up' });
    });
  });

  describe('handleApi', () => {
    it('should pass numeric index to appService and return the result', async () => {
      const result = await appController.handleApi(5 as any);
      expect(appService.handleRequest).toHaveBeenCalledWith(5);
      expect(result).toEqual({ index: 5 });
    });

    it('should convert string index to number', async () => {
      await appController.handleApi('10' as any);
      expect(appService.handleRequest).toHaveBeenCalledWith(10);
    });
  });
});

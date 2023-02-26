import { Test, TestingModule } from '@nestjs/testing';
import { CashInRequestController } from './cash-in-request.controller';

describe('CashInRequestController', () => {
  let controller: CashInRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashInRequestController],
    }).compile();

    controller = module.get<CashInRequestController>(CashInRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

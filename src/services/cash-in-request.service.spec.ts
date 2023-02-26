import { Test, TestingModule } from '@nestjs/testing';
import { CashInRequestService } from './cash-in-request.service';

describe('CashInRequestService', () => {
  let service: CashInRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CashInRequestService],
    }).compile();

    service = module.get<CashInRequestService>(CashInRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

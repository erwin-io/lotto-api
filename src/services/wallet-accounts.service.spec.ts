import { Test, TestingModule } from '@nestjs/testing';
import { WalletAccountsService } from './wallet-accounts.service';

describe('WalletAccountsService', () => {
  let service: WalletAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletAccountsService],
    }).compile();

    service = module.get<WalletAccountsService>(WalletAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

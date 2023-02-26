import { Test, TestingModule } from '@nestjs/testing';
import { WalletAccountsController } from './wallet-accounts.controller';

describe('WalletAccountsController', () => {
  let controller: WalletAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletAccountsController],
    }).compile();

    controller = module.get<WalletAccountsController>(WalletAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { WalletAccountsService } from 'src/services/wallet-accounts.service';
import { WalletAccounts } from 'src/shared/entities/WalletAccounts';
import { WalletAccountsController } from './wallet-accounts.controller';

@Module({
    imports: [TypeOrmModule.forFeature([WalletAccounts])],
    controllers: [WalletAccountsController],
    providers: [WalletAccountsService],
    exports: [WalletAccountsService],
  })
  export class WalletAccountsModule {}
  
import { WalletAccounts } from "src/shared/entities/WalletAccounts";
import { WalletType } from "src/shared/entities/WalletType";

export class WalletAccountsViewModel {
  walletAccountId: string;
  accountName: string;
  accountNumber: string;
  walletType: WalletTypeViewModel;
  constructor(model: WalletAccounts | undefined) {
    if (!model || model === null) {
      return null;
    }
    this.walletAccountId = model.walletAccountId;
    this.accountName = model.accountName;
    this.accountNumber = model.accountNumber;
    this.walletType = new WalletTypeViewModel(model.walletType);
  }
}

export class WalletTypeViewModel {
  walletTypeId: string;
  name: string;
  constructor(model: WalletType | undefined) {
    if (!model || model === null) {
      return null;
    }
    this.walletTypeId = model.walletTypeId;
    this.name = model.name;
  }
}
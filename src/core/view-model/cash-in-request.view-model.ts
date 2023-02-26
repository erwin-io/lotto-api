import { CashInRequest } from "src/shared/entities/CashInRequest";
import { CashInRequestStatus } from "src/shared/entities/CashInRequestStatus";
import { WalletType } from "src/shared/entities/WalletType";
import { ClientViewModel } from "./client.view-model";
import { WalletAccountsViewModel } from "./wallet-accounts.view-model";

export class CashInRequestViewModel {
  cashInRequestId: string;
  requestDate: string;
  amount: string;
  referenceNumber: string;
  comments: string;
  isCancelledByAdmin: boolean;
  adminRemarks: string;
  client: ClientViewModel;
  cashInRequestStatus: CashInRequestStatusViewModel;
  walletAccount: WalletAccountsViewModel;
  constructor(model: CashInRequest | undefined) {
    if (!model || model === null) {
      return null;
    }
    this.cashInRequestId = model.cashInRequestId;
    this.requestDate = model.requestDate;
    this.amount = model.amount;
    this.referenceNumber = model.referenceNumber;
    this.comments = model.comments;
    this.isCancelledByAdmin = model.isCancelledByAdmin;
    this.adminRemarks = model.adminRemarks;
    this.client = new ClientViewModel(model.client);
    this.cashInRequestStatus = new CashInRequestStatusViewModel(model.cashInRequestStatus);
    this.walletAccount = new WalletAccountsViewModel(model.walletAccount);
  }
}

export class CashInRequestStatusViewModel {
  cashInRequestStatusId: string;
  name: string;
  constructor(model: CashInRequestStatus | undefined) {
    if (!model || model === null) {
      return null;
    }
    this.cashInRequestStatusId = model.cashInRequestStatusId;
    this.name = model.name;
  }
}
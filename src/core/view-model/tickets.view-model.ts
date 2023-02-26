import { CashInRequest } from "src/shared/entities/CashInRequest";
import { CashInRequestStatus } from "src/shared/entities/CashInRequestStatus";
import { Tickets } from "src/shared/entities/Tickets";
import { WalletType } from "src/shared/entities/WalletType";
import { ClientViewModel } from "./client.view-model";
import { DrawTimeViewModel } from "./draw-time.view-model";
import { EntityStatusViewModel } from "./entity-status.view-model";
import { GameViewModel } from "./game.view-model";
import { WalletAccountsViewModel } from "./wallet-accounts.view-model";

export class TicketsViewModel {
  ticketId: string;
  game: GameViewModel;
  amount: string;
  drawDate: string;
  numberCombination: string;
  ticketReferenceNumber: string;
  drawTime: DrawTimeViewModel;
  client: ClientViewModel;
  entityStatus: EntityStatusViewModel;
  constructor(model: Tickets | undefined) {
    if (!model || model === null) {
      return null;
    }
    this.ticketId = model.ticketId;
    this.amount = model.amount;
    this.drawDate = model.drawDate;
    this.drawTime = model.drawTime;
    this.game = new GameViewModel(model.game);
    this.numberCombination = model.numberCombination;
    this.client = new ClientViewModel(model.client);
    this.entityStatus = model.entityStatus;
  }
}
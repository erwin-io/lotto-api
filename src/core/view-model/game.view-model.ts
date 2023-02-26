import { CashInRequest } from "src/shared/entities/CashInRequest";
import { CashInRequestStatus } from "src/shared/entities/CashInRequestStatus";
import { Game } from "src/shared/entities/Game";
import { Tickets } from "src/shared/entities/Tickets";
import { WalletType } from "src/shared/entities/WalletType";
import { ClientViewModel } from "./client.view-model";
import { EntityStatusViewModel } from "./entity-status.view-model";
import { FilesViewModel } from "./file.view.mode";
import { WalletAccountsViewModel } from "./wallet-accounts.view-model";

export class GameViewModel {
  gameId: string;
  name: string;
  estJockpotPrize: string;
  ticketRate: string;
  description: string;
  thumbnailFile: FilesViewModel;
  entityStatus: EntityStatusViewModel;
  constructor(model: Game | undefined) {
    if (!model || model === null) {
      return null;
    }
    this.gameId = model.gameId;
    this.name = model.name;
    this.estJockpotPrize = model.estJockpotPrize;
    this.ticketRate = model.ticketRate;
    this.description = model.description;
    this.thumbnailFile = model.thumbnailFile;
    this.entityStatus = model.entityStatus;
  }
}
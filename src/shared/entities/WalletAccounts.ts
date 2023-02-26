import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CashInRequest } from "./CashInRequest";
import { EntityStatus } from "./EntityStatus";
import { WalletType } from "./WalletType";

@Index("pk_walletaccounts", ["walletAccountId"], { unique: true })
@Entity("WalletAccounts", { schema: "dbo" })
export class WalletAccounts {
  @PrimaryGeneratedColumn({ type: "bigint", name: "WalletAccountId" })
  walletAccountId: string;

  @Column("character varying", { name: "AccountName" })
  accountName: string;

  @Column("character varying", { name: "AccountNumber" })
  accountNumber: string;

  @OneToMany(
    () => CashInRequest,
    (cashInRequest) => cashInRequest.walletAccount
  )
  cashInRequests: CashInRequest[];

  @ManyToOne(() => EntityStatus, (entityStatus) => entityStatus.walletAccounts)
  @JoinColumn([
    { name: "EntityStatusId", referencedColumnName: "entityStatusId" },
  ])
  entityStatus: EntityStatus;

  @ManyToOne(() => WalletType, (walletType) => walletType.walletAccounts)
  @JoinColumn([{ name: "WalletTypeId", referencedColumnName: "walletTypeId" }])
  walletType: WalletType;
}

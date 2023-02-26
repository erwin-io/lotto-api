import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CashInRequestStatus } from "./CashInRequestStatus";
import { Clients } from "./Clients";
import { WalletAccounts } from "./WalletAccounts";

@Index("CashInRequest_pkey", ["cashInRequestId"], { unique: true })
@Entity("CashInRequest", { schema: "dbo" })
export class CashInRequest {
  @PrimaryGeneratedColumn({ type: "bigint", name: "CashInRequestId" })
  cashInRequestId: string;

  @Column("date", { name: "RequestDate" })
  requestDate: string;

  @Column("numeric", { name: "Amount", default: () => "'0'" })
  amount: string;

  @Column("character varying", { name: "ReferenceNumber" })
  referenceNumber: string;

  @Column("character varying", { name: "Comments" })
  comments: string;

  @Column("boolean", { name: "IsCancelledByAdmin", default: () => "false" })
  isCancelledByAdmin: boolean;

  @Column("character varying", { name: "AdminRemarks", nullable: true })
  adminRemarks: string | null;

  @ManyToOne(
    () => CashInRequestStatus,
    (cashInRequestStatus) => cashInRequestStatus.cashInRequests
  )
  @JoinColumn([
    {
      name: "CashInRequestStatusId",
      referencedColumnName: "cashInRequestStatusId",
    },
  ])
  cashInRequestStatus: CashInRequestStatus;

  @ManyToOne(() => Clients, (clients) => clients.cashInRequests)
  @JoinColumn([{ name: "ClientId", referencedColumnName: "clientId" }])
  client: Clients;

  @ManyToOne(
    () => WalletAccounts,
    (walletAccounts) => walletAccounts.cashInRequests
  )
  @JoinColumn([
    { name: "WalletAccountId", referencedColumnName: "walletAccountId" },
  ])
  walletAccount: WalletAccounts;
}

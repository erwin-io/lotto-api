import { Column, Entity, Index, OneToMany } from "typeorm";
import { WalletAccounts } from "./WalletAccounts";

@Index("WalletType_pkey", ["walletTypeId"], { unique: true })
@Entity("WalletType", { schema: "dbo" })
export class WalletType {
  @Column("bigint", { primary: true, name: "WalletTypeId" })
  walletTypeId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @OneToMany(
    () => WalletAccounts,
    (walletAccounts) => walletAccounts.walletType
  )
  walletAccounts: WalletAccounts[];
}

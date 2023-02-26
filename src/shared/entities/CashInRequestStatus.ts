import { Column, Entity, Index, OneToMany } from "typeorm";
import { CashInRequest } from "./CashInRequest";

@Index("CashInRequestStatus_pkey", ["cashInRequestStatusId"], { unique: true })
@Entity("CashInRequestStatus", { schema: "dbo" })
export class CashInRequestStatus {
  @Column("bigint", { primary: true, name: "CashInRequestStatusId" })
  cashInRequestStatusId: string;

  @Column("character varying", { name: "Name", nullable: true })
  name: string | null;

  @OneToMany(
    () => CashInRequest,
    (cashInRequest) => cashInRequest.cashInRequestStatus
  )
  cashInRequests: CashInRequest[];
}

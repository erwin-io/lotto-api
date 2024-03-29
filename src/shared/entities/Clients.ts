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
import { Gender } from "./Gender";
import { Users } from "./Users";
import { Notifications } from "./Notifications";
import { Tickets } from "./Tickets";

@Index("pk_clients_741577680", ["clientId"], { unique: true })
@Entity("Clients", { schema: "dbo" })
export class Clients {
  @PrimaryGeneratedColumn({ type: "bigint", name: "ClientId" })
  clientId: string;

  @Column("character varying", { name: "FirstName", length: 250 })
  firstName: string;

  @Column("character varying", {
    name: "MiddleName",
    nullable: true,
    length: 250,
  })
  middleName: string | null;

  @Column("character varying", { name: "LastName", length: 250 })
  lastName: string;

  @Column("character varying", { name: "Email", length: 250 })
  email: string;

  @Column("character varying", { name: "MobileNumber", length: 250 })
  mobileNumber: string;

  @Column("text", { name: "Address" })
  address: string;

  @Column("date", { name: "BirthDate" })
  birthDate: string;

  @Column("bigint", { name: "Age" })
  age: string;

  @Column("timestamp without time zone", {
    name: "LastCancelledDate",
    nullable: true,
  })
  lastCancelledDate: Date | null;

  @Column("bigint", { name: "NumberOfCancelledAttempt", default: () => "0" })
  numberOfCancelledAttempt: string;

  @Column("numeric", { name: "WalletBalance", default: () => "0" })
  walletBalance: string;

  @OneToMany(() => CashInRequest, (cashInRequest) => cashInRequest.client)
  cashInRequests: CashInRequest[];

  @ManyToOne(() => Gender, (gender) => gender.clients)
  @JoinColumn([{ name: "GenderId", referencedColumnName: "genderId" }])
  gender: Gender;

  @ManyToOne(() => Users, (users) => users.clients)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;

  @OneToMany(() => Notifications, (notifications) => notifications.client)
  notifications: Notifications[];

  @OneToMany(() => Tickets, (tickets) => tickets.client)
  tickets: Tickets[];
}

import { Column, Entity, Index, OneToMany } from "typeorm";
import { Game } from "./Game";
import { GameResult } from "./GameResult";
import { Notifications } from "./Notifications";
import { Reminder } from "./Reminder";
import { Tickets } from "./Tickets";
import { Users } from "./Users";
import { WalletAccounts } from "./WalletAccounts";

@Index("pk_entitystatus_869578136", ["entityStatusId"], { unique: true })
@Entity("EntityStatus", { schema: "dbo" })
export class EntityStatus {
  @Column("bigint", { primary: true, name: "EntityStatusId" })
  entityStatusId: string;

  @Column("character varying", { name: "Name", length: 100 })
  name: string;

  @OneToMany(() => Game, (game) => game.entityStatus)
  games: Game[];

  @OneToMany(() => GameResult, (gameResult) => gameResult.entityStatus)
  gameResults: GameResult[];

  @OneToMany(() => Notifications, (notifications) => notifications.entityStatus)
  notifications: Notifications[];

  @OneToMany(() => Reminder, (reminder) => reminder.entityStatus)
  reminders: Reminder[];

  @OneToMany(() => Tickets, (tickets) => tickets.entityStatus)
  tickets: Tickets[];

  @OneToMany(() => Users, (users) => users.entityStatus)
  users: Users[];

  @OneToMany(
    () => WalletAccounts,
    (walletAccounts) => walletAccounts.entityStatus
  )
  walletAccounts: WalletAccounts[];
}

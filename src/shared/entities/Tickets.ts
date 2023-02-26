import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Clients } from "./Clients";
import { DrawTime } from "./DrawTime";
import { EntityStatus } from "./EntityStatus";
import { Game } from "./Game";

@Index("pk_ticketid", ["ticketId"], { unique: true })
@Entity("Tickets", { schema: "dbo" })
export class Tickets {
  @PrimaryGeneratedColumn({ type: "bigint", name: "TicketId" })
  ticketId: string;

  @Column("numeric", { name: "Amount", default: () => "'0'" })
  amount: string;

  @Column("date", { name: "DrawDate" })
  drawDate: string;

  @Column("character varying", { name: "NumberCombination" })
  numberCombination: string;

  @Column("character varying", { name: "TicketReferenceNumber" })
  ticketReferenceNumber: string;

  @ManyToOne(() => Clients, (clients) => clients.tickets)
  @JoinColumn([{ name: "ClientId", referencedColumnName: "clientId" }])
  client: Clients;

  @ManyToOne(() => DrawTime, (drawTime) => drawTime.tickets)
  @JoinColumn([{ name: "DrawTimeId", referencedColumnName: "drawTimeId" }])
  drawTime: DrawTime;

  @ManyToOne(() => EntityStatus, (entityStatus) => entityStatus.tickets)
  @JoinColumn([
    { name: "EntityStatusId", referencedColumnName: "entityStatusId" },
  ])
  entityStatus: EntityStatus;

  @ManyToOne(() => Game, (game) => game.tickets)
  @JoinColumn([{ name: "GameId", referencedColumnName: "gameId" }])
  game: Game;
}

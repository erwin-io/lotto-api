import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EntityStatus } from "./EntityStatus";
import { Files } from "./Files";
import { GameResult } from "./GameResult";
import { Tickets } from "./Tickets";

@Index("pk_game", ["gameId"], { unique: true })
@Entity("Game", { schema: "dbo" })
export class Game {
  @PrimaryGeneratedColumn({ type: "bigint", name: "GameId" })
  gameId: string;

  @Column("character varying", { name: "Name" })
  name: string;

  @Column("numeric", { name: "EstJockpotPrize" })
  estJockpotPrize: string;

  @Column("numeric", { name: "TicketRate" })
  ticketRate: string;

  @Column("character varying", { name: "Description" })
  description: string;

  @ManyToOne(() => EntityStatus, (entityStatus) => entityStatus.games)
  @JoinColumn([
    { name: "EntityStatusId", referencedColumnName: "entityStatusId" },
  ])
  entityStatus: EntityStatus;

  @ManyToOne(() => Files, (files) => files.games)
  @JoinColumn([{ name: "ThumbnailFileId", referencedColumnName: "fileId" }])
  thumbnailFile: Files;

  @OneToMany(() => GameResult, (gameResult) => gameResult.game)
  gameResults: GameResult[];

  @OneToMany(() => Tickets, (tickets) => tickets.game)
  tickets: Tickets[];
}

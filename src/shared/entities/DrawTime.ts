import { Column, Entity, Index, OneToMany } from "typeorm";
import { GameResult } from "./GameResult";
import { Tickets } from "./Tickets";

@Index("pk_drawtimeid", ["drawTimeId"], { unique: true })
@Entity("DrawTime", { schema: "dbo" })
export class DrawTime {
  @Column("bigint", { primary: true, name: "DrawTimeId" })
  drawTimeId: string;

  @Column("character varying", { name: "DisplayTime" })
  displayTime: string;

  @OneToMany(() => GameResult, (gameResult) => gameResult.drawTime)
  gameResults: GameResult[];

  @OneToMany(() => Tickets, (tickets) => tickets.drawTime)
  tickets: Tickets[];
}

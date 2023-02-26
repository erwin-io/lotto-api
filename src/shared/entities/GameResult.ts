import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DrawTime } from "./DrawTime";
import { EntityStatus } from "./EntityStatus";
import { Game } from "./Game";

@Index("GameResult_pkey", ["gameResultId"], { unique: true })
@Entity("GameResult", { schema: "dbo" })
export class GameResult {
  @PrimaryGeneratedColumn({ type: "bigint", name: "GameResultId" })
  gameResultId: string;

  @Column("numeric", { name: "JockpotPrize" })
  jockpotPrize: string;

  @Column("character varying", { name: "NumberCombination" })
  numberCombination: string;

  @Column("date", { name: "DrawDate" })
  drawDate: string;

  @ManyToOne(() => DrawTime, (drawTime) => drawTime.gameResults)
  @JoinColumn([{ name: "DrawTimeId", referencedColumnName: "drawTimeId" }])
  drawTime: DrawTime;

  @ManyToOne(() => EntityStatus, (entityStatus) => entityStatus.gameResults)
  @JoinColumn([
    { name: "EntityStatusId", referencedColumnName: "entityStatusId" },
  ])
  entityStatus: EntityStatus;

  @ManyToOne(() => Game, (game) => game.gameResults)
  @JoinColumn([{ name: "GameId", referencedColumnName: "gameId" }])
  game: Game;
}

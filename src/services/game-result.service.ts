import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { CreateGameResultDto } from 'src/core/dto/game-result/game-result.create.dto';
import { GameResultDto } from 'src/core/dto/game-result/game-result.update.dtos';
import { Clients } from 'src/shared/entities/Clients';
import { DrawTime } from 'src/shared/entities/DrawTime';
import { EntityStatus } from 'src/shared/entities/EntityStatus';
import { Game } from 'src/shared/entities/Game';
import { GameResult } from 'src/shared/entities/GameResult';
import { Repository } from 'typeorm';

@Injectable()
export class GameResultService {
    constructor(
      @InjectRepository(GameResult)
      private readonly gameResultRepo: Repository<GameResult>
    ) {}
  
    async findByFilter(
      advanceSearch: boolean,
      keyword: string,
      gameName: string,
      drawTime: string[],
      drawDateFrom: Date,
      drawDateTo: Date
    ) {
      try {
        const params: any = {
          keyword: `%${keyword}%`,
          gameName: `%${gameName}%`,
          drawTime:
          drawTime.length === 0
              ? ["11 AM","4 PM","9 PM"]
              : drawTime,
        };
        let query = await this.gameResultRepo.manager
          .createQueryBuilder("GameResult", "gr")
          .innerJoinAndSelect("gr.game", "g")
          .innerJoinAndSelect("gr.drawTime", "dt");
        if (advanceSearch) {
          if (
            !(drawDateFrom instanceof Date) ||
            drawDateFrom.toDateString() === "Invalid Date" ||
            !(drawDateTo instanceof Date) ||
            drawDateTo.toDateString() === "Invalid Date"
          ) {
            throw new HttpException(
              "Invalid date format drawDate field",
              HttpStatus.BAD_REQUEST
            );
          } else {
            params.drawDateFrom = moment(drawDateFrom).format("YYYY-MM-DD");
            params.drawDateTo = moment(drawDateTo).format("YYYY-MM-DD");
          }
          query
            .where(
                "g.name LIKE :gameName AND " +
                "dt.displayTime IN(:...drawTime) AND " +
                "gr.drawDate >= :drawDateFrom and gr.drawDate <= :drawDateTo"
            )
            .setParameters(params);
        } else {
          query
            .where(
                "g.name LIKE :keyword OR " +
                "dt.displayTime LIKE :keyword OR " +
                "CAST(gr.drawDate as character varying) LIKE :keyword"
            )
            .setParameters(params);
        }
        return await query.getMany();
      } catch (e) {
        throw e;
      }
    }
  
    async findOne(options?: any) {
      try {
        const result: any = await this.gameResultRepo.findOne({
          where: options,
          relations: {
            game: true,
            entityStatus: true,
            drawTime: true
          },
        });
        return result;
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  
    async findById(gameResultId: string) {
      try {
        const gameResultsCategory: GameResult = await this.findOne({
          gameResultId,
        });
        if (!gameResultsCategory) {
          throw new HttpException(
            "Game result not found",
            HttpStatus.NOT_FOUND
          );
        }
        return gameResultsCategory;
      } catch (e) {
        throw e;
      }
    }
  
    async add(createGameResultDto: CreateGameResultDto) {
      try {
        return await this.gameResultRepo.manager.transaction(
          async (entityManager) => {
            const { gameId, drawTimeId, drawDate } = createGameResultDto;

            const isInDb = await entityManager.findOne(GameResult,
                { where: { game: { gameId}, drawTime: { drawTimeId}, entityStatus: { entityStatusId: "1"} } }
            );
            if (isInDb && moment(isInDb.drawDate).format("YYYY-MM-DD") === moment(drawDate).format("YYYY-MM-DD")) {
                throw new HttpException("Game result already exists", HttpStatus.NOT_FOUND);
            }
            const gameResults = new GameResult();
            gameResults.game = await entityManager.findOne(
              Game,
              {
                where: {
                  gameId,
                },
              }
            );
            gameResults.drawTime = await entityManager.findOne(
              DrawTime,
              {
                where: {
                  drawTimeId,
                },
              }
            );
            gameResults.entityStatus = await entityManager.findOne(
              EntityStatus,
              {
                where: {
                  entityStatusId: "1",
                },
              }
            );
            gameResults.jockpotPrize = createGameResultDto.jockpotPrize;
            gameResults.drawDate = moment(drawDate).format("YYYY-MM-DD");
            gameResults.numberCombination = createGameResultDto.numberCombination;
            return await entityManager.save(gameResults);
          }
        );
      } catch (e) {
        throw e;
      }
    }

    async update(gameResultDto: GameResultDto) {
      try {
        return await this.gameResultRepo.manager.transaction(async (entityManager) => {
          const { gameResultId, gameId, drawTimeId, drawDate } = gameResultDto;
  
          const gameResult = await entityManager.findOne(GameResult, {
            where: { gameResultId, entityStatus: { entityStatusId: "1"}},
          });
          if (!gameResult) {
            throw new HttpException("Game result not found", HttpStatus.NOT_FOUND);
          }
  
          const inDb = await await entityManager.findOne(GameResult, {
            where: { game: {gameId}, drawTime: { drawTimeId }, entityStatus: { entityStatusId: "1"}},
          });
          if (inDb && gameResultId !== inDb.gameResultId && moment(inDb.drawDate).format("YYYY-MM-DD") === moment(drawDate).format("YYYY-MM-DD")) {
            throw new HttpException("Game result already exists", HttpStatus.CONFLICT);
          }
          gameResult.game = await entityManager.findOne(
            Game,
            {
              where: {
                gameId,
              },
            }
          );
          gameResult.drawTime = await entityManager.findOne(
            DrawTime,
            {
              where: {
                drawTimeId,
              },
            }
          );
          gameResult.entityStatus = await entityManager.findOne(
            EntityStatus,
            {
              where: {
                entityStatusId: "1",
              },
            }
          );
          gameResult.drawDate = moment(drawDate).format("YYYY-MM-DD");
          gameResult.numberCombination = gameResultDto.numberCombination;
          return await entityManager.save(gameResult);
        });
      } catch (e) {
        throw e;
      }
    }
}

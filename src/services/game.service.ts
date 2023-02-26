import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGameDto } from 'src/core/dto/game/game.create.dto';
import { GameDto } from 'src/core/dto/game/game.update.dtos';
import { CreateWalletAccountDto } from 'src/core/dto/wallet-accounts/wallet-accounts.create.dto';
import { WalletAccountDto } from 'src/core/dto/wallet-accounts/wallet-accounts.update.dtos';
import { EntityStatus } from 'src/shared/entities/EntityStatus';
import { Game } from 'src/shared/entities/Game';
import { WalletType } from 'src/shared/entities/WalletType';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
    
    constructor(
      @InjectRepository(Game)
      private readonly gameRepo: Repository<Game>
    ) {}
  
    async findAll() {
      try {
          const result: any = await this.gameRepo.find({
            where: {
              entityStatus: {
                entityStatusId: "1"
              }
            },
            relations: {
                thumbnailFile: true,
                entityStatus: true,
            }
          });
          return result;
      } catch (e) {
        throw e;
      }
    }
  
    async findOne(options?: any) {
      try {
        const result: any = await this.gameRepo.findOne({
          where: options,
          relations: {
            thumbnailFile: true,
            entityStatus: true,
          }
        });
        return result;
      } catch (e) {
        console.log(e);
        throw e;
      }
    }
  
    async findById(gameId: string) {
      try {
        const gameCategory: Game = await this.findOne({
          gameId,
          entityStatus: {entityStatusId: "1"},
        });
        if (!gameCategory) {
          throw new HttpException("Game not found", HttpStatus.NOT_FOUND);
        }
        return gameCategory;
      } catch (e) {
        throw e;
      }
    }
  
    async add(createGameDto: CreateGameDto) {
      try {
        return await this.gameRepo.manager.transaction(async (entityManager) => {
          const { name } = createGameDto;
          const inDb = await this.findOne(
            { 
                name, 
                entityStatus:  {
                    entityStatusId: "1",
                } 
            });
          if (inDb) {
            throw new HttpException("Game already exist", HttpStatus.CONFLICT);
          }
          
          let game = new Game();
          game.entityStatus = await entityManager.findOne(EntityStatus, {
          where: {
              entityStatusId: "1",
          },
          });
          game.name = createGameDto.name;
          game.estJockpotPrize = createGameDto.estJockpotPrize;
          game.ticketRate = createGameDto.ticketRate;
          game.description = createGameDto.description;
          return await entityManager.save(game);
        });
      } catch (e) {
        throw e;
      }
    }
  
    async update(gameDto: GameDto) {
      try {
        return await this.gameRepo.manager.transaction(async (entityManager) => {
          const { gameId, name } = gameDto;
  
          const game = await entityManager.findOne(Game, {
            where: { gameId: gameId, entityStatus: { entityStatusId: "1"}},
          });
          if (!game) {
            throw new HttpException("Game not found", HttpStatus.NOT_FOUND);
          }
  
          const inDb = await this.findOne({ 
              name, 
              entityStatus: { entityStatusId: "1", }});
          if (inDb && gameId !== inDb.gameId) {
            throw new HttpException("Game already exist", HttpStatus.CONFLICT);
          }
          game.name = gameDto.name;
          game.estJockpotPrize = gameDto.estJockpotPrize;
          game.ticketRate = gameDto.ticketRate;
          game.description = gameDto.description;
          return await entityManager.save(game);
        });
      } catch (e) {
        throw e;
      }
    }
  
    async delete(gameId: string) {
      try {
        const game: Game = await this.findOne({
          gameId: gameId,
          entityStatus: {entityStatusId: "1"},
        });
        if (!game) {
          throw new HttpException("Game not found", HttpStatus.NOT_FOUND);
        }
        game.entityStatus.entityStatusId = "2";
        return await this.gameRepo.save(game);
      } catch (e) {
        throw e;
      }
    }
  }
  
import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameResultService } from 'src/services/game-result.service';
import { GameResult } from 'src/shared/entities/GameResult';
import { GameResultController } from './game-result.controller';

@Module({
  imports: [TypeOrmModule.forFeature([GameResult])],
  controllers: [GameResultController],
  providers: [GameResultService],
  exports: [GameResultService],
})
export class GameResultModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameService } from 'src/services/game.service';
import { Game } from 'src/shared/entities/Game';
import { GameController } from './game.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Game])],
  controllers: [GameController],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
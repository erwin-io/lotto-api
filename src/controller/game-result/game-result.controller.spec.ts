import { Test, TestingModule } from '@nestjs/testing';
import { GameResultController } from './game-result.controller';

describe('GameResultController', () => {
  let controller: GameResultController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameResultController],
    }).compile();

    controller = module.get<GameResultController>(GameResultController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

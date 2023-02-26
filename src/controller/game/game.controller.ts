import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { JwtAuthGuard } from "src/core/auth/jwt.auth.guard";
import { CreateGameDto } from "src/core/dto/game/game.create.dto";
import { GameDto } from "src/core/dto/game/game.update.dtos";
import { GameService } from "src/services/game.service";

@ApiTags("game")
@Controller("game")
@ApiBearerAuth("jwt")
export class GameController {
  constructor(private readonly gamesService: GameService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    const res: CustomResponse = {};
    try {
      res.data = await this.gamesService.findAll();
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get(":gameId")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("gameId") gameId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.gamesService.findById(gameId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("")
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateGameDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.gamesService.add(dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("")
  @UseGuards(JwtAuthGuard)
  async update(@Body() dto: GameDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.gamesService.update(dto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete(":gameId")
  @UseGuards(JwtAuthGuard)
  async delete(@Param("gameId") gameId: string) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.gamesService.delete(gameId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}

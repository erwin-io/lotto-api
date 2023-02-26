import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CustomResponse } from 'src/common/helper/customresponse.helpers';
import { JwtAuthGuard } from 'src/core/auth/jwt.auth.guard';
import { CreateGameResultDto } from 'src/core/dto/game-result/game-result.create.dto';
import { GameResultDto } from 'src/core/dto/game-result/game-result.update.dtos';
import { GameResultService } from 'src/services/game-result.service';

@ApiTags("game-result")
@Controller("game-result")
@ApiBearerAuth("jwt")
export class GameResultController {
    constructor(private readonly gameResultService: GameResultService) {}
  
    @Get("getByAdvanceSearch")
    @ApiQuery({ name: "isAdvance", required: false })
    @ApiQuery({ name: "keyword", required: false })
    @ApiQuery({ name: "gameName", required: false })
    @ApiQuery({ name: "drawTime", required: false })
    @ApiQuery({ name: "drawDateFrom", type: Date, required: false })
    @ApiQuery({ name: "drawDateTo", type: Date, required: false })
    @UseGuards(JwtAuthGuard)
    async getByAdvanceSearch(
      @Query("isAdvance") isAdvance: boolean = false,
      @Query("keyword") keyword: string = "",
      @Query("gameName") gameName: string = "",
      @Query("drawTime") drawTime: string = "",
      @Query("drawDateFrom") drawDateFrom: Date,
      @Query("drawDateTo") drawDateTo: Date
    ) {
      const res: CustomResponse = {};
      try {
        res.data = await this.gameResultService.findByFilter(
          isAdvance,
          keyword,
          gameName,
          drawTime.trim() === "" ? [] : drawTime.split(","),
          drawDateFrom,
          drawDateTo
        );
        res.success = true;
        return res;
      } catch (e) {
        res.success = false;
        res.message = e.message !== undefined ? e.message : e;
        return res;
      }
    }

    @Get(":gameResultId")
    @UseGuards(JwtAuthGuard)
    async findOne(@Param("gameResultId") gameResultId: string) {
      const res: CustomResponse = {};
      try {
        res.data = await this.gameResultService.findById(gameResultId);
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
    async create(@Body() dto: CreateGameResultDto) {
      const res: CustomResponse = {};
      try {
        const res: CustomResponse = {};
        res.data = await this.gameResultService.add(dto);
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
    async update(@Body() dto: GameResultDto) {
      const res: CustomResponse = {};
      try {
        const res: CustomResponse = {};
        res.data = await this.gameResultService.update(dto);
        res.success = true;
        return res;
      } catch (e) {
        res.success = false;
        res.message = e.message !== undefined ? e.message : e;
        return res;
      }
    }
}

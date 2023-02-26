import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { JwtAuthGuard } from "src/core/auth/jwt.auth.guard";
import { CreateTicketDto } from "src/core/dto/tickets/tickets.create.dto";
import { TicketsService } from "src/services/tickets.service";

@ApiTags("tickets")
@Controller("tickets")
@ApiBearerAuth("jwt")
export class TicketsController {
  constructor(private readonly ticketService: TicketsService) {}

  @Get("getByAdvanceSearch")
  @ApiQuery({ name: "isAdvance", required: false })
  @ApiQuery({ name: "keyword", required: false })
  @ApiQuery({ name: "ticketId", required: false })
  @ApiQuery({ name: "ticketReferenceNumber", required: false })
  @ApiQuery({ name: "clientName", required: false })
  @ApiQuery({ name: "gameName", required: false })
  @ApiQuery({ name: "drawTime", required: false })
  @ApiQuery({ name: "drawDateFrom", type: Date, required: false })
  @ApiQuery({ name: "drawDateTo", type: Date, required: false })
  @UseGuards(JwtAuthGuard)
  async getByAdvanceSearch(
    @Query("isAdvance") isAdvance: boolean = false,
    @Query("keyword") keyword: string = "",
    @Query("ticketId") ticketId: string = "",
    @Query("ticketReferenceNumber") ticketReferenceNumber: string = "",
    @Query("clientName") clientName: string = "",
    @Query("gameName") gameName: string = "",
    @Query("drawTime") drawTime: string = "",
    @Query("drawDateFrom") drawDateFrom: Date,
    @Query("drawDateTo") drawDateTo: Date
  ) {
    const res: CustomResponse = {};
    try {
      res.data = await this.ticketService.findByFilter(
        isAdvance,
        keyword,
        ticketId,
        ticketReferenceNumber,
        clientName,
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

  @Get("getByClient")
  @ApiQuery({ name: "clientId", required: false })
  @UseGuards(JwtAuthGuard)
  async getByClient(@Query("clientId") clientId: string = "") {
    const res: CustomResponse = {};
    try {
      res.data = await this.ticketService.findByClient(clientId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get(":ticketId")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("ticketId") ticketId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.ticketService.findById(ticketId);
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
  async create(@Body() roleDto: CreateTicketDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.ticketService.add(roleDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}

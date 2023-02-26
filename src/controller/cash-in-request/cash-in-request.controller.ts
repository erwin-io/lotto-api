import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CustomResponse } from 'src/common/helper/customresponse.helpers';
import { JwtAuthGuard } from 'src/core/auth/jwt.auth.guard';
import { CreateCashInRequestDto } from 'src/core/dto/cash-in-request/cash-in-request.create.dto';
import { CashInRequestDto, UpdateCashInRequestStatusDto } from 'src/core/dto/cash-in-request/cash-in-request.update.dtos';
import { CashInRequestService } from 'src/services/cash-in-request.service';

@ApiTags("cash-in-request")
@Controller("cash-in-request")
@ApiBearerAuth("jwt")
export class CashInRequestController {
    constructor(private readonly cashInRequestService: CashInRequestService) {}
  
    @Get("getByAdvanceSearch")
    @ApiQuery({ name: "isAdvance", required: false })
    @ApiQuery({ name: "keyword", required: false })
    @ApiQuery({ name: "cashInRequestId", required: false })
    @ApiQuery({ name: "referenceNumber", required: false })
    @ApiQuery({ name: "clientName", required: false })
    @ApiQuery({ name: "accountName", required: false })
    @ApiQuery({ name: "accountNumber", required: false })
    @ApiQuery({ name: "cashInRequestStatus", required: false })
    @ApiQuery({ name: "walletType", required: false })
    @ApiQuery({ name: "requestDateFrom", type: Date, required: false })
    @ApiQuery({ name: "requestDateTo", type: Date, required: false })
    @UseGuards(JwtAuthGuard)
    async getByAdvanceSearch(
        @Query("isAdvance") isAdvance: boolean = false,
        @Query("keyword") keyword: string = "",
        @Query("cashInRequestId") cashInRequestId: string = "",
        @Query("referenceNumber") referenceNumber: string = "",
        @Query("clientName") clientName: string = "",
        @Query("accountName") accountName: string = "",
        @Query("accountNumber") accountNumber: string = "",
        @Query("cashInRequestStatus") cashInRequestStatus: string = "",
        @Query("walletType") walletType: string = "",
        @Query("requestDateFrom") requestDateFrom: Date,
        @Query("requestDateTo") requestDateTo: Date
        ) {
      const res: CustomResponse = {};
      try {
        res.data = await this.cashInRequestService.findByFilter(
            isAdvance,
            keyword,
            cashInRequestId,
            referenceNumber,
            clientName,
            accountName,
            accountNumber,
            cashInRequestStatus.trim() === "" ? [] : cashInRequestStatus.split(","),
            walletType.trim() === "" ? [] : walletType.split(","),
            requestDateFrom,
            requestDateTo
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
    @ApiQuery({ name: "cashInRequestStatus", required: false })
    @UseGuards(JwtAuthGuard)
    async getByClient(
        @Query("clientId") clientId: string = "",
        @Query("cashInRequestStatus") cashInRequestStatus: string = ""
        ) {
      const res: CustomResponse = {};
      try {
        res.data = await this.cashInRequestService.findByClient(
            clientId,
            cashInRequestStatus.trim() === "" ? [] : cashInRequestStatus.split(",")
            );
        res.success = true;
        return res;
      } catch (e) {
        res.success = false;
        res.message = e.message !== undefined ? e.message : e;
        return res;
      }
    }

    @Get(":cashInRequestId")
    @UseGuards(JwtAuthGuard)
    async findOne(@Param("cashInRequestId") cashInRequestId: string) {
      const res: CustomResponse = {};
      try {
        res.data = await this.cashInRequestService.findById(cashInRequestId);
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
    async create(@Body() roleDto: CreateCashInRequestDto) {
      const res: CustomResponse = {};
      try {
        const res: CustomResponse = {};
        res.data = await this.cashInRequestService.add(roleDto);
        res.success = true;
        return res;
      } catch (e) {
        res.success = false;
        res.message = e.message !== undefined ? e.message : e;
        return res;
      }
    }
  
    @Put("updateRequestStatus")
    @UseGuards(JwtAuthGuard)
    async updateRequestStatus(@Body() dto: UpdateCashInRequestStatusDto) {
      const res: CustomResponse = {};
      try {
        const res: CustomResponse = {};
        res.data = await this.cashInRequestService.updateRequestStatus(dto);
        res.success = true;
        return res;
      } catch (e) {
        res.success = false;
        res.message = e.message !== undefined ? e.message : e;
        return res;
      }
    }
  }
  
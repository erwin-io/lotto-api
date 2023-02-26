import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CustomResponse } from 'src/common/helper/customresponse.helpers';
import { JwtAuthGuard } from 'src/core/auth/jwt.auth.guard';
import { CreateWalletAccountDto } from 'src/core/dto/wallet-accounts/wallet-accounts.create.dto';
import { WalletAccountDto } from 'src/core/dto/wallet-accounts/wallet-accounts.update.dtos';
import { WalletAccountsService } from 'src/services/wallet-accounts.service';

@ApiTags("wallet-accounts")
@Controller("wallet-accounts")
@ApiBearerAuth("jwt")
export class WalletAccountsController {
    constructor(private readonly walletAccountsService: WalletAccountsService) {}
  
    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll() {
      const res: CustomResponse = {};
      try {
        res.data = await this.walletAccountsService.findAll();
        res.success = true;
        return res;
      } catch (e) {
        res.success = false;
        res.message = e.message !== undefined ? e.message : e;
        return res;
      }
    }

    @Get(":walletAccountId")
    @UseGuards(JwtAuthGuard)
    async findOne(@Param("walletAccountId") walletAccountId: string) {
      const res: CustomResponse = {};
      try {
        res.data = await this.walletAccountsService.findById(walletAccountId);
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
    async create(@Body() dto: CreateWalletAccountDto) {
      const res: CustomResponse = {};
      try {
        const res: CustomResponse = {};
        res.data = await this.walletAccountsService.add(dto);
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
    async update(@Body() dto: WalletAccountDto) {
      const res: CustomResponse = {};
      try {
        const res: CustomResponse = {};
        res.data = await this.walletAccountsService.update(dto);
        res.success = true;
        return res;
      } catch (e) {
        res.success = false;
        res.message = e.message !== undefined ? e.message : e;
        return res;
      }
    }
  
    @Delete(":walletAccountId")
    @UseGuards(JwtAuthGuard)
    async delete(@Param("walletAccountId") walletAccountId: string) {
      const res: CustomResponse = {};
      try {
        const res: CustomResponse = {};
        res.data = await this.walletAccountsService.delete(walletAccountId);
        res.success = true;
        return res;
      } catch (e) {
        res.success = false;
        res.message = e.message !== undefined ? e.message : e;
        return res;
      }
    }
  }
  
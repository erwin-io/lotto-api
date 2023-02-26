import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CustomResponse } from 'src/common/helper/customresponse.helpers';
import { JwtAuthGuard } from 'src/core/auth/jwt.auth.guard';
import { UsersService } from 'src/services/users.service';

@ApiTags("client")
@Controller("client")
@ApiBearerAuth("jwt")
export class ClientController {
    constructor(private readonly userService: UsersService) {}
    @Get("getClientWalletBalance/:clientId")
    @UseGuards(JwtAuthGuard)
    async findOne(@Param("clientId") clientId: string) {
      const res: CustomResponse = {};
      try {
        res.data = await this.userService.getClientWalletBalance(clientId);
        res.success = true;
        return res;
      } catch (e) {
        res.success = false;
        res.message = e.message !== undefined ? e.message : e;
        return res;
      }
    }
}

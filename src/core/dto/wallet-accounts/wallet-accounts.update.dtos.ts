import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import * as moment from "moment";

export class WalletAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  walletAccountId: string;

  @ApiProperty()
  @IsNotEmpty()
  walletTypeId: string;

  @ApiProperty()
  @IsNotEmpty()
  accountName: string;

  @ApiProperty()
  @IsNotEmpty()
  accountNumber: string;
}
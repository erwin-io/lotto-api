import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import * as moment from "moment";

export class CreateWalletAccountDto {
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

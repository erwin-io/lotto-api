import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import * as moment from "moment";

export class CashInRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  cashInRequestId: string;
}

export class UpdateCashInRequestStatusDto extends CashInRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  cashInRequestStatusId: string;

  @ApiProperty()
  @IsOptional()
  adminRemarks;
}

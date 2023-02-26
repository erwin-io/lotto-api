import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import * as moment from "moment";

export class CreateCashInRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  walletAccountId: string;

  @ApiProperty()
  @IsNotEmpty()
  clientId: string;

  @ApiProperty({
    type: Date,
    default: moment().format("YYYY-MM-DD"),
  })
  @IsDateString()
  @Type(() => Date)
  @Transform((value) => moment(new Date(value.value)).format("YYYY-MM-DD"))
  @IsNotEmpty()
  requestDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  amount: string;

  @ApiProperty()
  @IsNotEmpty()
  referenceNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  comments: string;
}

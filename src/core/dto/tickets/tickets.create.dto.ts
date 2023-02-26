import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";
import { IsDateString, IsMilitaryTime, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import * as moment from "moment";

export class CreateTicketDto {
  @ApiProperty()
  @IsNotEmpty()
  amount: string;

  @ApiProperty()
  @IsNotEmpty()
  gameId: string;

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
  drawDate: Date;
  
  @ApiProperty()
  @IsNotEmpty()
  drawTimeId: string;

  @ApiProperty()
  @IsNotEmpty()
  numberCombination: string;

  @ApiProperty()
  @IsNotEmpty()
  ticketReferenceNumber: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { Type, Transform } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import * as moment from "moment";

export class CreateGameDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  estJockpotPrize: string;

  @ApiProperty()
  @IsNotEmpty()
  ticketRate: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsOptional()
  thumbnailFile: any;
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketsService } from 'src/services/tickets.service';
import { Tickets } from 'src/shared/entities/Tickets';
import { TicketsController } from './tickets.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Tickets])],
    controllers: [TicketsController],
    providers: [TicketsService],
    exports: [TicketsService],
  })
export class TicketsModule {}

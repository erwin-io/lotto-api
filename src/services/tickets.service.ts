import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import * as moment from "moment";
import { CreateTicketDto } from "src/core/dto/tickets/tickets.create.dto";
import { TicketsViewModel } from "src/core/view-model/tickets.view-model";
import { Clients } from "src/shared/entities/Clients";
import { DrawTime } from "src/shared/entities/DrawTime";
import { EntityStatus } from "src/shared/entities/EntityStatus";
import { Game } from "src/shared/entities/Game";
import { Tickets } from "src/shared/entities/Tickets";
import { WalletAccounts } from "src/shared/entities/WalletAccounts";
import { Repository } from "typeorm";

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Tickets)
    private readonly ticketRepo: Repository<Tickets>
  ) {}

  async findByFilter(
    advanceSearch: boolean,
    keyword: string,
    ticketId: string,
    ticketReferenceNumber: string,
    clientName: string,
    gameName: string,
    drawTime: string[],
    drawDateFrom: Date,
    drawDateTo: Date
  ) {
    try {
      const params: any = {
        keyword: `%${keyword}%`,
        ticketId: `%${ticketId}%`,
        ticketReferenceNumber: `%${ticketReferenceNumber}%`,
        clientName: `%${clientName}%`,
        gameName: `%${gameName}%`,
        drawTime:
        drawTime.length === 0
            ? ["11 AM","4 PM","9 PM"]
            : drawTime,
      };
      let query = await this.ticketRepo.manager
        .createQueryBuilder("Tickets", "t")
        .innerJoinAndSelect("t.game", "g")
        .innerJoinAndSelect("t.drawTime", "dt")
        .innerJoinAndSelect("t.client", "c");
      if (advanceSearch) {
        if (
          !(drawDateFrom instanceof Date) ||
          drawDateFrom.toDateString() === "Invalid Date" ||
          !(drawDateTo instanceof Date) ||
          drawDateTo.toDateString() === "Invalid Date"
        ) {
          throw new HttpException(
            "Invalid date format drawDate field",
            HttpStatus.BAD_REQUEST
          );
        } else {
          params.drawDateFrom = moment(drawDateFrom).format("YYYY-MM-DD");
          params.drawDateTo = moment(drawDateTo).format("YYYY-MM-DD");
        }
        query
          .where(
            "cast(t.ticketId as character varying) LIKE :ticketId AND " +
              "t.ticketReferenceNumber LIKE :ticketReferenceNumber AND " +
              "CONCAT(c.firstName, ' ', c.middleName, ' ', c.lastName) LIKE :clientName AND " +
              "g.name LIKE :gameName AND " +
              "dt.displayTime IN(:...drawTime) AND " +
              "t.drawDate >= :drawDateFrom and t.drawDate <= :drawDateTo"
          )
          .setParameters(params);
      } else {
        query
          .where(
            "cast(t.ticketId as character varying) LIKE :keyword OR " +
              "t.ticketReferenceNumber LIKE :keyword OR " +
              "CONCAT(c.firstName, ' ', c.middleName, ' ', c.lastName) LIKE :keyword OR " +
              "g.name LIKE :keyword OR " +
              "dt.displayTime LIKE :keyword OR " +
              "CAST(t.drawDate as character varying) LIKE :keyword"
          )
          .setParameters(params);
      }
      return <TicketsViewModel[]>(await query.getMany()).map(
        (r: Tickets) => {
          return new TicketsViewModel(r);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async findByClient(
    clientId: string
  ) {
    try {
      let query = await this.ticketRepo.manager
        .createQueryBuilder("Tickets", "t")
        .innerJoinAndSelect("t.game", "g")
        .innerJoinAndSelect("t.drawTime", "dt")
        .innerJoinAndSelect("t.client", "c")
        .where(
          "CAST(c.clientId as character varying) = :clientId"
        )
        .setParameters({
          clientId,
        });

      return <TicketsViewModel[]>(await query.getMany()).map(
        (r: Tickets) => {
          return new TicketsViewModel(r);
        }
      );
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      const result: any = await this.ticketRepo.findOne({
        where: options,
        relations: {
          client: true,
          game: true,
          entityStatus: true,
          drawTime: true
        },
      });
      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findById(ticketId: string) {
    try {
      const ticketsCategory: Tickets = await this.findOne({
        ticketId,
      });
      if (!ticketsCategory) {
        throw new HttpException(
          "Ticket not found",
          HttpStatus.NOT_FOUND
        );
      }
      return ticketsCategory;
    } catch (e) {
      throw e;
    }
  }

  async add(createTicketsDto: CreateTicketDto) {
    try {
      return await this.ticketRepo.manager.transaction(
        async (entityManager) => {
          const { gameId, clientId, drawTimeId, drawDate } = createTicketsDto;
          const amount = Number(createTicketsDto.amount);
          if (Number(amount) <= 0) {
            throw new HttpException(
              "Unable to process request, invalid amount, minimum amount is 1",
              HttpStatus.BAD_REQUEST
            );
          }
          const tickets = new Tickets();
          tickets.game = await entityManager.findOne(
            Game,
            {
              where: {
                gameId,
              },
            }
          );
          tickets.client = await entityManager.findOne(Clients, {
            where: {
              clientId,
            },
          });
          tickets.drawTime = await entityManager.findOne(
            DrawTime,
            {
              where: {
                drawTimeId,
              },
            }
          );
          tickets.entityStatus = await entityManager.findOne(
            EntityStatus,
            {
              where: {
                entityStatusId: "1",
              },
            }
          );
          tickets.amount = createTicketsDto.amount;
          tickets.drawDate = moment(drawDate).format("YYYY-MM-DD");
          tickets.numberCombination = createTicketsDto.numberCombination;
          tickets.ticketReferenceNumber = createTicketsDto.ticketReferenceNumber;
          return await entityManager.save(tickets);
        }
      );
    } catch (e) {
      throw e;
    }
  }
}

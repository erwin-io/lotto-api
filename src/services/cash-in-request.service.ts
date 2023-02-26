import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { CashInRequestStatusEnum } from 'src/common/enums/cash-in-request-status.enum';
import { CreateCashInRequestDto } from 'src/core/dto/cash-in-request/cash-in-request.create.dto';
import { CashInRequestDto, UpdateCashInRequestStatusDto } from 'src/core/dto/cash-in-request/cash-in-request.update.dtos';
import { CashInRequestViewModel } from 'src/core/view-model/cash-in-request.view-model';
import { CashInRequest } from 'src/shared/entities/CashInRequest';
import { CashInRequestStatus } from 'src/shared/entities/CashInRequestStatus';
import { Clients } from 'src/shared/entities/Clients';
import { EntityStatus } from 'src/shared/entities/EntityStatus';
import { WalletAccounts } from 'src/shared/entities/WalletAccounts';
import { WalletType } from 'src/shared/entities/WalletType';
import { Repository } from 'typeorm';

@Injectable()
export class CashInRequestService {
    
  constructor(
    @InjectRepository(CashInRequest)
    private readonly cashInRequestRepo: Repository<CashInRequest>
  ) {}

  async findByFilter(
    advanceSearch: boolean,
    keyword: string,
    cashInRequestId: string,
    referenceNumber: string,
    clientName: string,
    accountName: string,
    accountNumber: string,
    cashInRequestStatus: string[],
    walletType: string[],
    requestDateFrom: Date,
    requestDateTo: Date) {
    try {
        const params: any = {
          keyword: `%${keyword}%`,
          cashInRequestId: `%${cashInRequestId}%`,
          referenceNumber: `%${referenceNumber}%`,
          clientName: `%${clientName}%`,
          accountName: `%${accountName}%`,
          accountNumber: `%${accountNumber}%`,
          cashInRequestStatus:
          cashInRequestStatus.length === 0
              ? ["Pending", "Approved", "Cancelled"]
              : cashInRequestStatus,
          walletType:
          walletType.length === 0
              ? ["GCash", "Paymaya", "Palawan", "7/11"]
              : walletType,
        };
        let query = await this.cashInRequestRepo.manager
        .createQueryBuilder("CashInRequest", "cr")
        .innerJoinAndSelect("cr.cashInRequestStatus", "crs")
        .innerJoinAndSelect("cr.client", "c")
        .innerJoinAndSelect("cr.walletAccount", "wa")
        .innerJoinAndSelect("wa.walletType", "wt");
        if(advanceSearch) {
          if (
              !(requestDateFrom instanceof Date) || requestDateFrom.toDateString() === "Invalid Date" ||
              !(requestDateTo instanceof Date) || requestDateTo.toDateString() === "Invalid Date"
            ) {
              throw new HttpException("Invalid date format requestDate field", HttpStatus.BAD_REQUEST);
          } else {
              params.requestDateFrom = moment(requestDateFrom).format("YYYY-MM-DD");
              params.requestDateTo = moment(requestDateTo).format("YYYY-MM-DD");
          }
            query.where(
                "cast(cr.cashInRequestId as character varying) LIKE :cashInRequestId AND " +
                "cr.referenceNumber LIKE :referenceNumber AND " +
                "CONCAT(c.firstName, ' ', c.middleName, ' ', c.lastName) LIKE :clientName AND " +
                "wa.accountName LIKE :accountName AND " +
                "wa.accountNumber LIKE :accountNumber AND " +
                "crs.name IN(:...cashInRequestStatus) AND " +
                "wt.name IN(:...walletType) AND " +
                "cr.requestDate >= :requestDateFrom and cr.requestDate <= :requestDateTo"
            )
            .setParameters(params);
        } else {
            query.where(
                "CAST(cr.cashInRequestId as character varying) LIKE :keyword OR " +
                "cr.referenceNumber LIKE :keyword OR " +
                "CONCAT(c.firstName, ' ', c.middleName, ' ', c.lastName) LIKE :keyword OR " +
                "wa.accountName LIKE :keyword OR " +
                "wa.accountNumber LIKE :keyword OR " +
                "crs.name LIKE :keyword OR " +
                "wt.name LIKE :keyword OR " +
                "CAST(cr.requestDate as character varying) LIKE :keyword"
            )
            .setParameters(params);
        }
        return <CashInRequestViewModel[]>(await query.getMany()).map((r: CashInRequest) => {
          return new CashInRequestViewModel(r);
        });
    } catch (e) {
      throw e;
    }
  }

  async findByClient(
    clientId: string,
    cashInRequestStatus: string[]) {
    try {
        let query = await this.cashInRequestRepo.manager
        .createQueryBuilder("CashInRequest", "cr")
        .innerJoinAndSelect("cr.cashInRequestStatus", "crs")
        .innerJoinAndSelect("cr.client", "c")
        .innerJoinAndSelect("cr.walletAccount", "wa")
        .innerJoinAndSelect("wa.walletType", "wt")
        .where(
            "CAST(c.clientId as character varying) = :clientId AND " +
            "crs.name IN(:...cashInRequestStatus) "
        ).setParameters({
            clientId,
            cashInRequestStatus: cashInRequestStatus.length === 0
            ? ["Pending", "Approved", "Cancelled"]
            : cashInRequestStatus,
        });
        
      return <CashInRequestViewModel[]>(await query.getMany()).map((r: CashInRequest) => {
        return new CashInRequestViewModel(r);
      });
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      const result: any = await this.cashInRequestRepo.findOne({
        where: options,
        relations: {
            client: true,
            cashInRequestStatus: true,
            walletAccount: {
                walletType: true
            }
        }
      });
      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findById(cashInRequestId: string) {
    try {
      const cashInRequestsCategory: CashInRequest = await this.findOne({
        cashInRequestId,
      });
      if (!cashInRequestsCategory) {
        throw new HttpException("Cash in request not found", HttpStatus.NOT_FOUND);
      }
      return cashInRequestsCategory;
    } catch (e) {
      throw e;
    }
  }

  async add(createCashInRequestDto: CreateCashInRequestDto) {
    try {
      return await this.cashInRequestRepo.manager.transaction(async (entityManager) => {
        const { walletAccountId, clientId } = createCashInRequestDto;
        const amount = Number(createCashInRequestDto.amount);
        if(Number(amount) <= 0) {
            throw new HttpException(
              "Unable to process request, invalid amount, minimum amount is 1",
              HttpStatus.BAD_REQUEST
            );
        }
        const cashInRequests = new CashInRequest();
        cashInRequests.walletAccount = await entityManager.findOne(WalletAccounts, {
            where: {
              walletAccountId,
            },
        });
        cashInRequests.client = await entityManager.findOne(Clients, {
            where: {
                clientId,
            },
        });
        cashInRequests.cashInRequestStatus = await entityManager.findOne(CashInRequestStatus, {
            where: {
                cashInRequestStatusId: "1",
            },
        });
        cashInRequests.requestDate = moment(createCashInRequestDto.requestDate).format("YYYY-MM-DD");
        cashInRequests.amount = createCashInRequestDto.amount;
        cashInRequests.referenceNumber = createCashInRequestDto.referenceNumber;
        cashInRequests.comments = createCashInRequestDto.comments;
        return await entityManager.save(cashInRequests);
      });
    } catch (e) {
      throw e;
    }
  }

  async updateRequestStatus(cashInRequestDto: UpdateCashInRequestStatusDto) {
    try {
      return await this.cashInRequestRepo.manager.transaction(async (entityManager) => {
        const { cashInRequestId, cashInRequestStatusId } = cashInRequestDto;
        let cashInRequest = await entityManager.findOne(CashInRequest, {
          where: { cashInRequestId },
          relations: {
            cashInRequestStatus: true,
            walletAccount: {
                walletType: true
            },
            client: true
          },
        });
        if (
            cashInRequest.cashInRequestStatus.cashInRequestStatusId ===
            CashInRequestStatusEnum.APPROVED.toString() &&
            cashInRequestStatusId === CashInRequestStatusEnum.APPROVED.toString()
        ) {
          throw new HttpException(
            "Unable to change status, request was already been appproved",
            HttpStatus.BAD_REQUEST
          );
        }
        if (
            cashInRequest.cashInRequestStatus.cashInRequestStatusId ===
            CashInRequestStatusEnum.APPROVED.toString() &&
            cashInRequestStatusId === CashInRequestStatusEnum.PENDING.toString()
        ) {
          throw new HttpException(
            "Unable to change status, request was already been appproved",
            HttpStatus.BAD_REQUEST
          );
        }
        if (
            cashInRequest.cashInRequestStatus.cashInRequestStatusId ===
            CashInRequestStatusEnum.APPROVED.toString() &&
            cashInRequestStatusId === CashInRequestStatusEnum.CANCELLED.toString()
        ) {
          throw new HttpException(
            "Unable to change status, request was already been appproved",
            HttpStatus.BAD_REQUEST
          );
        }
        if (
            cashInRequest.cashInRequestStatus.cashInRequestStatusId ===
            CashInRequestStatusEnum.CANCELLED.toString() &&
            cashInRequestStatusId === CashInRequestStatusEnum.PENDING.toString()
        ) {
          throw new HttpException(
            "Unable to change status, request was already been cancelled",
            HttpStatus.BAD_REQUEST
          );
        }
        if (
            cashInRequest.cashInRequestStatus.cashInRequestStatusId ===
            CashInRequestStatusEnum.CANCELLED.toString() &&
            cashInRequestStatusId === CashInRequestStatusEnum.APPROVED.toString()
        ) {
          throw new HttpException(
            "Unable to change status, request was already been cancelled",
            HttpStatus.BAD_REQUEST
          );
        }
        if (cashInRequestStatusId === CashInRequestStatusEnum.APPROVED.toString()) {
          cashInRequest.adminRemarks = cashInRequestDto.adminRemarks;
        }
        cashInRequest.cashInRequestStatus = await entityManager.findOne(CashInRequestStatus, {
          where: { cashInRequestStatusId },
        });
        cashInRequest = await entityManager.save(CashInRequest, cashInRequest);
        const client = await entityManager.findOne(Clients, {
            where: { 
                clientId: cashInRequest.client.clientId
             },
        });
        const newWalletBalance = (Number(client.walletBalance) > 0 ? Number(client.walletBalance) : 0) + Number(cashInRequest.amount);
        client.walletBalance = newWalletBalance.toString();
        await entityManager.save(Clients, client);
        return cashInRequest;
      });
    } catch (e) {
      throw e;
    }
  }
}

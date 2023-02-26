import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CashInRequestService } from 'src/services/cash-in-request.service';
import { CashInRequest } from 'src/shared/entities/CashInRequest';
import { CashInRequestController } from './cash-in-request.controller';

@Module({
    imports: [TypeOrmModule.forFeature([CashInRequest])],
    controllers: [CashInRequestController],
    providers: [CashInRequestService],
    exports: [CashInRequestService],
  })
  export class CashInRequestModule {}
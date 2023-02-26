import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { extname } from 'path';
import { CreateWalletAccountDto } from 'src/core/dto/wallet-accounts/wallet-accounts.create.dto';
import { WalletAccountDto } from 'src/core/dto/wallet-accounts/wallet-accounts.update.dtos';
import { WalletAccountsViewModel } from 'src/core/view-model/wallet-accounts.view-model';
import { Clients } from 'src/shared/entities/Clients';
import { EntityStatus } from 'src/shared/entities/EntityStatus';
import { Files } from 'src/shared/entities/Files';
import { Gender } from 'src/shared/entities/Gender';
import { WalletAccounts } from 'src/shared/entities/WalletAccounts';
import { WalletType } from 'src/shared/entities/WalletType';
import { Repository } from 'typeorm';

@Injectable()
export class WalletAccountsService {
    
  constructor(
    @InjectRepository(WalletAccounts)
    private readonly walletAccountsRepo: Repository<WalletAccounts>
  ) {}

  async findAll() {
    try {
        const result: any = await this.walletAccountsRepo.find({
          where: {
            entityStatus: {
              entityStatusId: "1"
            }
          },
          relations: {
              walletType: true
          }
        });
        return result;
    } catch (e) {
      throw e;
    }
  }

  async findOne(options?: any) {
    try {
      const result: any = await this.walletAccountsRepo.findOne({
        where: options,
        relations: {
            walletType: true,
            entityStatus: true
        }
      });
      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findById(walletAccountId: string) {
    try {
      const walletAccountsCategory: WalletAccounts = await this.findOne({
        walletAccountId,
        entityStatus: {entityStatusId: "1"},
      });
      if (!walletAccountsCategory) {
        throw new HttpException("Wallet account not found", HttpStatus.NOT_FOUND);
      }
      return walletAccountsCategory;
    } catch (e) {
      throw e;
    }
  }

  async add(createWalletAccountDto: CreateWalletAccountDto) {
    try {
      return await this.walletAccountsRepo.manager.transaction(async (entityManager) => {
        const { accountName, accountNumber} = createWalletAccountDto;
        const inDb = await this.findOne({ accountName, accountNumber, entityStatus:  {
            entityStatusId: "1",
        } });
        if (inDb) {
          throw new HttpException("Wallet account already exist", HttpStatus.CONFLICT);
        }
        
        let walletAccounts = new WalletAccounts();
        walletAccounts.walletType = await entityManager.findOne(WalletType, {
            where: {
              walletTypeId: createWalletAccountDto.walletTypeId,
            },
          });
        
        walletAccounts.entityStatus = await entityManager.findOne(EntityStatus, {
        where: {
            entityStatusId: "1",
        },
        });
        walletAccounts.accountName = createWalletAccountDto.accountName;
        walletAccounts.accountNumber = createWalletAccountDto.accountNumber;
        return await entityManager.save(walletAccounts);
      });
    } catch (e) {
      throw e;
    }
  }

  async update(walletAccountDto: WalletAccountDto) {
    try {
      return await this.walletAccountsRepo.manager.transaction(async (entityManager) => {
        const { walletAccountId, accountName, accountNumber } = walletAccountDto;

        const walletAccounts = await entityManager.findOne(WalletAccounts, {
          where: { walletAccountId: walletAccountId, entityStatus: { entityStatusId: "1"}},
        });
        if (!walletAccounts) {
          throw new HttpException("Wallet account not found", HttpStatus.NOT_FOUND);
        }

        const inDb = await this.findOne({ 
            accountName, 
            accountNumber, 
            entityStatus: { entityStatusId: "1", }});
        if (inDb && walletAccountId !== inDb.walletAccountId) {
          throw new HttpException("Wallet account already exist", HttpStatus.CONFLICT);
        }
        
        walletAccounts.walletType = await entityManager.findOne(WalletType, {
            where: {
              walletTypeId: walletAccountDto.walletTypeId,
            },
          });
        walletAccounts.accountName = walletAccountDto.accountName;
        walletAccounts.accountNumber = walletAccountDto.accountNumber;
        return await entityManager.save(walletAccounts);
      });
    } catch (e) {
      throw e;
    }
  }

  async delete(walletAccountId: string) {
    try {
      const walletAccounts: WalletAccounts = await this.findOne({
        walletAccountId: walletAccountId,
        entityStatus: {entityStatusId: "1"},
      });
      if (!walletAccounts) {
        throw new HttpException("Wallet accounts not found", HttpStatus.NOT_FOUND);
      }
      walletAccounts.entityStatus.entityStatusId = "2";
      return await this.walletAccountsRepo.save(walletAccounts);
    } catch (e) {
      throw e;
    }
  }
}

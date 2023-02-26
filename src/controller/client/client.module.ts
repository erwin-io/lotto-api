import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseProviderModule } from 'src/core/provider/firebase/firebase-provider.module';
import { UsersService } from 'src/services/users.service';
import { Users } from 'src/shared/entities/Users';
import { ClientController } from './client.controller';

@Module({
  imports: [FirebaseProviderModule, TypeOrmModule.forFeature([Users])],
  controllers: [ClientController],
  providers: [UsersService],
  exports: [UsersService],
})
export class ClientModule {}

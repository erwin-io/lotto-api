import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { UsersModule } from "./controller/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./shared/typeorm/typeorm.service";
import { getEnvPath } from "./common/helper/env.helper";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./controller/auth/auth.module";
import { RolesModule } from "./controller/roles/roles.module";
import { FileModule } from "./controller/file/file.module";
import { DashboardModule } from "./controller/dashboard/dashboard.module";
import { FirebaseProviderModule } from "./core/provider/firebase/firebase-provider.module";
import { WalletAccountsModule } from './controller/wallet-accounts/wallet-accounts.module';
import { CashInRequestModule } from './controller/cash-in-request/cash-in-request.module';
import { ClientModule } from './controller/client/client.module';
import { GameService } from './services/game.service';
import { TicketsService } from './services/tickets.service';
import { GameResultService } from './services/game-result.service';
import { GameModule } from './controller/game/game.module';
import { TicketsModule } from './controller/tickets/tickets.module';
import { GameResultModule } from './controller/game-result/game-result.module';
import * as Joi from "@hapi/joi";
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      validationSchema: Joi.object({
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    UsersModule,
    ClientModule,
    RolesModule,
    FileModule,
    DashboardModule,
    FirebaseProviderModule,
    WalletAccountsModule,
    CashInRequestModule,
    GameModule,
    TicketsModule,
    GameResultModule,
  ],
  providers: [AppService],
  controllers: [],
})
export class AppModule {}

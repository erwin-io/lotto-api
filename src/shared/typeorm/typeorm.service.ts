import { EntityStatus } from "../entities/EntityStatus";
import { UserType } from "../entities/UserType";
import { Gender } from "../entities/Gender";
import { Staff } from "../entities/Staff";
import { Clients } from "../entities/Clients";
import { Users } from "../entities/Users";
import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Roles } from "../entities/Roles";
import { Messages } from "../entities/Messages";
import { Notifications } from "../entities/Notifications";
import { GatewayConnectedUsers } from "../entities/GatewayConnectedUsers";
import { Reminder } from "../entities/Reminder";
import { Files } from "../entities/Files";
import { UserProfilePic } from "../entities/UserProfilePic";
import { CashInRequest } from "../entities/CashInRequest";
import { CashInRequestStatus } from "../entities/CashInRequestStatus";
import { WalletAccounts } from "../entities/WalletAccounts";
import { WalletType } from "../entities/WalletType";
import { Game } from "../entities/Game";
import { Tickets } from "../entities/Tickets";
import { GameResult } from "../entities/GameResult";
import { DrawTime } from "../entities/DrawTime";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    const ssl = this.config.get<string>("SSL");
    let config: TypeOrmModuleOptions = {
      type: "postgres",
      host: this.config.get<string>("DATABASE_HOST"),
      port: Number(this.config.get<number>("DATABASE_PORT")),
      database: this.config.get<string>("DATABASE_NAME"),
      username: this.config.get<string>("DATABASE_USER"),
      password: this.config.get<string>("DATABASE_PASSWORD"),
      entities: [
        Users,
        Roles,
        Clients,
        Staff,
        Gender,
        UserType,
        EntityStatus,
        Notifications,
        Messages,
        GatewayConnectedUsers,
        Reminder,
        Files,
        UserProfilePic,
        CashInRequest,
        CashInRequestStatus,
        WalletAccounts,
        WalletType,
        Game,
        Tickets,
        GameResult,
        DrawTime,
      ],
      synchronize: false, // never use TRUE in production!
      ssl: ssl.toLocaleLowerCase().includes("true"),
      extra: {

      }
    };
    if(config.ssl) {
      config.extra.ssl = {
        require: true,
        rejectUnauthorized: false,
      }
    }
    return config;
  }
}

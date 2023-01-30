import { ServicesService } from "@app/services/services.service";
import { ServicesModule } from "@app/services/services.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./users.entity";
import { CreateUser } from "./use-cases/create-user";
import { FindUser } from "./use-cases/find-user";
import { FindAllUsers } from "./use-cases/find-all-user";
import { UserPermission } from "@auth/use-cases/userPermission.auth";
import { AuthModule } from "@auth/auth.module";
import { Service } from "@app/services/entities/services.entity";

@Module({
	imports: [TypeOrmModule.forFeature([User, Service]), AuthModule],
	providers: [
		UsersService,
		CreateUser,
		FindUser,
		FindAllUsers,
		UserPermission,
	],
	controllers: [UsersController],
})
export class UsersModule {}

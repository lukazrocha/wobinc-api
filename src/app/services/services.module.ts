import { FindAllServices } from "./use-cases/find-all-services";
import { UsersService } from "@app/users/users.service";
import { CreateService } from "./use-cases/create-service";
import { Module } from "@nestjs/common";
import { ServicesService } from "./services.service";
import { ServicesController } from "./services.controller";
import { Service } from "./entities/services.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserPermission } from "@auth/use-cases/userPermission.auth";
import { AuthModule } from "@auth/auth.module";
import { User } from "@app/users/users.entity";
import { FindService } from "./use-cases/find-service";

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([Service, User])],
	providers: [
		ServicesService,
		UserPermission,
		CreateService,
		FindAllServices,
		FindService,
		UsersService,
	],
	controllers: [ServicesController],
})
export class ServicesModule {}

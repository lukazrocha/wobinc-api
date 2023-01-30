import { FindUser } from "./../users/use-cases/find-user";
import { UsersService } from "@app/users/users.service";
import { Module } from "@nestjs/common";
import { ScheduleService } from "./schedule.service";
import { ScheduleController } from "./schedule.controller";
import { ServicesService } from "@app/services/services.service";
import { ServicesModule } from "@app/services/services.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Service } from "@app/services/entities/services.entity";
import { User } from "@app/users/users.entity";
import { UserPermission } from "@auth/use-cases/userPermission.auth";
import { AuthModule } from "@auth/auth.module";
import { EmployeeAvailability } from "./use-cases/employee-availability";
import { UsersModule } from "@app/users/users.module";

@Module({
	imports: [
		AuthModule,
		ServicesModule,
		TypeOrmModule.forFeature([Service, User]),
	],
	providers: [
		ScheduleService,
		ServicesService,
		UsersService,
		UserPermission,
		EmployeeAvailability,
		FindUser,
	],
	controllers: [ScheduleController],
})
export class ScheduleModule {}

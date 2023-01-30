import { UsersService } from "@app/users/users.service";
import { AuthService } from "@auth/auth.service";
import { Module } from "@nestjs/common";
import { LoginService } from "./login.service";
import { LoginController } from "./login.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@app/users/users.entity";
import { LoginValidation } from "./use-cases/login-validation";
import { AuthModule } from "@auth/auth.module";
import { UserPermission } from "@auth/use-cases/userPermission.auth";
import { Service } from "@app/services/entities/services.entity";

@Module({
	imports: [AuthModule, TypeOrmModule.forFeature([User, Service])],
	providers: [
		LoginService,
		LoginValidation,
		UsersService,
		AuthService,
		UserPermission,
	],
	controllers: [LoginController],
})
export class LoginModule {}

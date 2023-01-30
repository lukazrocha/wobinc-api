import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "@app/users/users.entity";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { UsersService } from "@app/users/users.service";
import { AuthService } from "./auth.service";
import { Service } from "@app/services/entities/services.entity";

@Module({
	imports: [
		JwtModule.register({
			secret: "secretKey",
			signOptions: { expiresIn: "1h" },
		}),
		TypeOrmModule.forFeature([User, Service]),
	],
	providers: [AuthService, UsersService],
	exports: [JwtModule],
})
export class AuthModule {}

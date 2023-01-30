import { UsersService } from "@app/users/users.service";
import { UserRole } from "@app/users/enums/user-role.enum";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserNotFoundError } from "@app/users/use-cases/errors/user-not-found-error";
import { User } from "@app/users/users.entity";

@Injectable()
export class UserPermission {
	constructor(
		private jwtService: JwtService,
		private usersService: UsersService
	) {}

	async isAdmin(authorization: string) {
		const token = authorization.split(" ")[1]; // Retira o token do padrão "Bearer Token"

		const profile = this.jwtService.decode(token);
		return profile["role"] == UserRole.EMPLOYEE_ADMIN;
	}

	async isEmployee(authorization: string) {
		const token = authorization.split(" ")[1];

		const profile = this.jwtService.decode(token);
		return (
			profile["role"] == UserRole.EMPLOYEE ||
			profile["role"] == UserRole.EMPLOYEE_ADMIN
		);
	}

	async isCustomer(authorization: string) {
		const token = authorization.split(" ")[1];

		const profile = this.jwtService.decode(token);
		return profile["role"] == UserRole.CUSTOMER;
	}

	async isTokenValid(authorization: string) {
		const token = authorization.split(" ")[1];
		try {
			await this.jwtService.verifyAsync(token);

			return true;
		} catch (error) {
			throw new UnauthorizedException("Token expired");
		}
	}

	async getLoggedInUserId(authorization: string) {
		const token = authorization.split(" ")[1];

		const profile = await this.jwtService.decode(token);

		return profile["sub"];
	}

	async getLoggedInUserRole(authorization: string) {
		const token = authorization.split(" ")[1];

		const profile = await this.jwtService.decode(token);

		return profile["role"];
	}

	async getLoggedUser(authorization: string): Promise<User> {
		const token = authorization.split(" ")[1];

		const profile = await this.jwtService.decode(token);
		const userId = profile["sub"];

		try {
			return await this.usersService.findById(userId);
		} catch (error) {
			throw new UserNotFoundError(error.message);
		}
	}
}

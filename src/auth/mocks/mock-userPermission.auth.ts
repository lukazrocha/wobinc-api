import { randomUUID } from "node:crypto";
import { UnauthorizedException } from "@nestjs/common";
import { MockedJwtService } from "./mock-jwt.service";
import { UserRole } from "@app/users/enums/user-role.enum";
import { User } from "@app/users/users.entity";

export class MockedUserPermission {
	constructor(private jwtService: MockedJwtService) {
		this.jwtService = new MockedJwtService();
	}

	async isTokenValid(authorization: string) {
		const token = authorization.split(" ")[1];

		try {
			await this.jwtService.verifyAsync(token);
			return true;
		} catch (error) {
			throw new UnauthorizedException(error.message);
		}
	}

	async isAdmin(authorization: string) {
		const token = authorization.split(" ")[1];

		return token.includes("Admin");
	}

	async isEmployee(authorization: string) {
		const token = authorization.split(" ")[1];

		return token.includes("Employee") || token.includes("Admin");
	}

	async isCustomer(authorization: string) {
		const token = authorization.split(" ")[1];

		return token.includes("Customer");
	}

	async getLoggedInUserId(authorization: string) {
		const token = authorization.split(" ")[1];

		const profile = {
			sub: randomUUID(),
			email: "johndoe@mock.com",
			role: UserRole.CUSTOMER,
		};

		return profile["sub"];
	}

	async getLoggedInUserRole(authorization: string) {
		const token = authorization.split(" ")[1];

		const profile = {
			sub: randomUUID(),
			email: "johndoe@mock.com",
			role: UserRole.CUSTOMER,
		};

		return profile["role"];
	}

	async getLoggedUser(authorization: string) {
		const profile: User = {
			id: randomUUID(),
			name: "John Doe",
			email: "johndoe@mock.com",
			role: UserRole.CUSTOMER,
			services: [],
			password: "hash",
		};

		return profile;
	}
}

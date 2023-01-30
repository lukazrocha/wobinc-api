import { randomUUID } from "node:crypto";
import { UserRole } from "@app/users/enums/user-role.enum";
import { Injectable } from "@nestjs/common";
import { CreateUserBody } from "../dtos/create-user-body";
import { UserNotFoundError } from "../use-cases/errors/user-not-found-error";
import { User } from "../users.entity";
import { Service } from "@app/services/entities/services.entity";

@Injectable()
export class MockedUsersService {
	private usersRepository: Array<User> = [];
	private serrvicesRepository: Array<Service> = [];

	constructor() {
		this.usersRepository.push({
			id: "b5df9d16-99d3-48dc-bf58-c9ed6347a614",
			name: "John Doe",
			email: "johndoe@test.com",
			password:
				"$2b$10$or4/Llz5Ym6P4poE3FGjMO3r1yczSe.CCcKTdjxYGhPLcZlnmEMce",
			role: UserRole.CUSTOMER,
			services: [],
		});

		this.usersRepository.push({
			id: "5e0b0e24-8b55-4360-9df4-688812dcb9fc",
			name: "John Doe Employee",
			email: "johndoe@wobinc.com",
			password:
				"$2b$10$or4/Llz5Ym6P4poE3FGjMO3r1yczSe.CCcKTdjxYGhPLcZlnmEMce",
			role: UserRole.EMPLOYEE,
			services: [],
		});
	}

	async create(user: CreateUserBody): Promise<any> {
		let userToSave = { id: randomUUID(), ...user, services: [] };
		this.usersRepository.push(userToSave);
		return userToSave;
	}

	async findAll(): Promise<User[]> {
		return this.usersRepository;
	}

	async findById(userId: string): Promise<User> {
		const user = this.usersRepository.find((user) => user.id === userId);

		if (user === null || user === undefined) {
			throw new UserNotFoundError(
				`User with id: ${userId} doesn't exist.`
			);
		}

		return user;
	}

	async findUserByEmail(email: string): Promise<User> {
		const user = this.usersRepository.find((user) => user.email === email);

		return user;
	}
}

import { ServicesService } from "@app/services/services.service";
import { UserRole } from "@app/users/enums/user-role.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { User } from "./users.entity";
import { CreateUserBody } from "./dtos/create-user-body";
import { UserNotFoundError } from "./use-cases/errors/user-not-found-error";
import { Service } from "@app/services/entities/services.entity";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User) private usersRepository: Repository<User>,
		@InjectRepository(Service)
		private servicesRepository: Repository<Service>
	) {}

	async create(user: CreateUserBody): Promise<User> {
		return await this.save(this.usersRepository.create(user));
	}

	async findAll(): Promise<User[]> {
		return await this.usersRepository.find();
	}

	async findById(userId: string): Promise<User> {
		const user = await this.usersRepository.findOne({
			where: {
				id: userId,
			},
		});

		if (user === null) {
			throw new UserNotFoundError(
				`User with id: ${userId} doesn't exist.`
			);
		}

		return user;
	}

	async findUserByEmail(email: string): Promise<User> {
		return await this.usersRepository.findOne({
			where: {
				email,
			},
		});
	}

	async findAllAvailableEmployeesByDate(date: string): Promise<User[]> {
		const qb = this.servicesRepository
			.createQueryBuilder("service")
			.select("service.employeeId")
			.where("service.scheduledTo = :date")
			.setParameter("date", date);

		return await this.usersRepository
			.createQueryBuilder("user")
			.select("user")
			.where("user.role = :role")
			.setParameter("role", UserRole.EMPLOYEE)
			.andWhere("user.id NOT IN (" + qb.getQuery() + ")")
			.setParameters(qb.getParameters())
			.getMany();
	}

	async save(user: User): Promise<User> {
		return await this.usersRepository.save(user);
	}
}

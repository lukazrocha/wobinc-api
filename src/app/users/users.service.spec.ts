import { ServicesService } from "@app/services/services.service";
import { UserRole } from "./enums/user-role.enum";
import { randomUUID } from "node:crypto";
import { Repository } from "typeorm";
import { User } from "./../users/users.entity";
import { UsersService } from "./users.service";
import { Service } from "@app/services/entities/services.entity";

describe("UsersService", () => {
	let usersRepository: Repository<User>;
	let servicesRepository: Repository<Service>;
	let usersService: UsersService;

	beforeEach(async () => {
		usersRepository = {
			create: jest.fn().mockReturnValue({}),
			save: jest.fn().mockReturnValue({ id: 1 }),
			find: jest.fn().mockReturnValue([{ id: 1 }]),
			findOne: jest.fn().mockReturnValue({ id: 1 }),
			createQueryBuilder: jest.fn().mockReturnValue({
				select: jest.fn().mockReturnValue({
					where: jest.fn().mockReturnValue({
						setParameter: jest.fn().mockReturnValue({
							andWhere: jest.fn().mockReturnValue({
								setParameters: jest.fn().mockReturnValue({
									getMany: jest.fn().mockReturnValue([
										{
											id: randomUUID(),
											name: "John Doe",
											email: "johndoe@test.com",
											role: UserRole.EMPLOYEE,
										},
										{
											id: randomUUID(),
											name: "Mary Christmas",
											email: "mary@test.com",
											role: UserRole.EMPLOYEE,
										},
									]),
								}),
							}),
						}),
					}),
				}),
			}),
		} as unknown as Repository<User>;

		servicesRepository = {
			createQueryBuilder: jest.fn().mockReturnValue({
				select: jest.fn().mockReturnValue({
					where: jest.fn().mockReturnValue({
						setParameter: jest.fn().mockReturnValue({
							getQuery: jest
								.fn()
								.mockReturnValue(
									"SELECT service.employeeId FROM Service service WHERE service.scheduledTo = :date"
								),
							getParameters: jest
								.fn()
								.mockReturnValue({ date: "2022-01-01" }),
						}),
					}),
				}),
			}),
		} as unknown as Repository<Service>;
		usersService = new UsersService(usersRepository, servicesRepository);
	});

	it("should be defined", () => {
		expect(usersService).toBeDefined();
	});

	it("should be able to create a user", async () => {
		const user = {
			id: randomUUID(),
			name: "John Doe",
			email: "johndoe@test.com",
			role: UserRole.CUSTOMER,
			password: "hashedpassword#",
			services: [],
		};

		jest.spyOn(usersRepository, "create").mockImplementation(() => user);
		jest.spyOn(usersRepository, "save").mockImplementation(
			async () => user
		);

		expect(await usersService.create(user)).toBeTruthy();
	});

	it("should be able to find all users", async () => {
		const users = [new User(), new User(), new User()];

		jest.spyOn(usersRepository, "find").mockImplementation(
			async () => users
		);

		expect(await usersService.findAll()).toHaveLength(3);
	});

	it("should be able to find an user by id", async () => {
		const user = {
			id: randomUUID(),
			name: "John Doe",
			email: "johndoe@mock.com",
			role: UserRole.CUSTOMER,
			password: "hash",
			services: [],
		};

		jest.spyOn(usersRepository, "findOne").mockImplementation(
			async () => user
		);

		const result = await usersService.findById(randomUUID());

		expect(result).toEqual(user);
		expect(result.id).toEqual(user.id);
	});

	it("should be able throw an error when couldn't to find an user by id", async () => {
		jest.spyOn(usersRepository, "findOne").mockImplementation(
			async () => null
		);

		try {
			await usersService.findById(randomUUID());
		} catch (error) {
			expect(error).toBeDefined();
		}
	});

	it("should be able to find an user by email", async () => {
		const user = {
			id: randomUUID(),
			name: "John Doe",
			email: "johndoe@mock.com",
			role: UserRole.CUSTOMER,
			password: "hash",
			services: [],
		};

		jest.spyOn(usersRepository, "findOne").mockImplementation(
			async () => user
		);

		const result = await usersService.findUserByEmail("johndoe@mock.com");

		expect(result).toEqual(user);
		expect(result.id).toEqual(user.id);
		expect(result.email).toEqual(user.email);
		expect(result.role).toEqual(user.role);
	});

	it("should be able to retrieve a list of available employees", async () => {
		const availableEmployees =
			await usersService.findAllAvailableEmployeesByDate(
				"2023-05-01 00:00:00.000"
			);

		expect(availableEmployees).toHaveLength(2);
		expect(availableEmployees[0].name).toEqual("John Doe");
		expect(availableEmployees[1].name).toEqual("Mary Christmas");
	});
});

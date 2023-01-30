import { VerifyIfEmailExists } from "./../../login/use-cases/verify-email";
import { randomUUID, verify } from "crypto";
import { Repository } from "typeorm";
import { UserRole } from "../enums/user-role.enum";
import { User } from "../users.entity";
import { UsersService } from "./../users.service";
import { CreateUser } from "./create-user";
import { rejects } from "assert";
import { Service } from "@app/services/entities/services.entity";
describe("Create User", () => {
	let repo: Repository<User>;
	let repoService: Repository<Service>;
	let usersService: UsersService;
	let createUser: CreateUser;
	let verifyEmail: VerifyIfEmailExists;

	beforeEach(() => {
		usersService = new UsersService(repo, repoService);
		createUser = new CreateUser(usersService);
	});

	it("should be defined", () => {
		expect(createUser).toBeDefined();
	});

	it("should be able to create a new User CUSTOMER", async () => {
		const request = {
			name: "John Doe",
			email: "johndoe@mock.com",
			password: "102953846",
		};

		const response = {
			id: randomUUID(),
			name: "John Doe",
			email: "johndoe@mock.com",
			role: UserRole.CUSTOMER,
			password: "hashedandsaltedpassword102953846",
			services: [],
		};

		jest.spyOn(usersService, "findUserByEmail").mockImplementation(
			async () => null
		);
		jest.spyOn(usersService, "create").mockImplementation(
			async () => response
		);

		const createdUser = await createUser.execute(request);

		expect(createdUser.user.name).toEqual("John Doe");
		expect(createdUser.user.email).toEqual("johndoe@mock.com");
		expect(createdUser.user.role).toEqual(UserRole.CUSTOMER);
	});

	it("should be able to create a new User EMPLOYEE", async () => {
		const request = {
			name: "John Doe",
			email: "johndoe@wobinc.com",
			password: "102953846",
		};

		const response = {
			id: randomUUID(),
			name: "John Doe",
			email: "johndoe@wobinc.com",
			role: UserRole.EMPLOYEE,
			password: "hashedandsaltedpassword102953846",
			services: [],
		};

		jest.spyOn(usersService, "findUserByEmail").mockImplementation(
			async () => null
		);
		jest.spyOn(usersService, "create").mockImplementation(
			async () => response
		);

		const createdUser = await createUser.execute(request);

		expect(createdUser.user.name).toEqual("John Doe");
		expect(createdUser.user.email).toEqual("johndoe@wobinc.com");
		expect(createdUser.user.role).toEqual(UserRole.EMPLOYEE);
	});

	it("shouldn't be able to create a new User [email already exist]", async () => {
		const request = {
			name: "John Doe",
			email: "johndoe@wobinc.com",
			password: "102953846",
		};

		const response = {
			id: randomUUID(),
			name: "John Doe",
			email: "johndoe@wobinc.com",
			role: UserRole.EMPLOYEE,
			password: "hashedandsaltedpassword102953846",
			services: [],
		};

		jest.spyOn(usersService, "findUserByEmail").mockImplementation(
			async () => response
		);
		jest.spyOn(usersService, "create").mockImplementation(
			async () => response
		);

		try {
			await createUser.execute(request);
		} catch (error) {
			expect(error.message).toBeTruthy();
			expect(error.message).toEqual("Email already registered.");
		}
	});

	it("shouldn't be able to create a new User", async () => {
		const request = {
			name: "Maryaa",
			email: "maryaa@wobinc.com",
			password: "102953846",
		};

		const response = {
			id: randomUUID(),
			name: "Maryaa",
			email: "maryaa@wobinc.com",
			role: UserRole.EMPLOYEE,
			password: "hashedandsaltedpassword102953846",
		};

		jest.spyOn(usersService, "findUserByEmail").mockImplementation(
			async () => null
		);
		jest.spyOn(usersService, "create").mockImplementation(() => {
			throw new Error("");
		});

		try {
			await createUser.execute(request);
		} catch (error) {
			expect(error.message).toBeTruthy();
			expect(error.message).toEqual("Not Acceptable");
		}
	});
});

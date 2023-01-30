import { randomUUID } from "node:crypto";
import { UserRole } from "./../users/enums/user-role.enum";
import { Repository } from "typeorm";
import { User } from "@app/users/users.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { LoginService } from "./login.service";

describe("LoginService", () => {
	let repo: Repository<User>;
	let loginService: LoginService;

	beforeEach(async () => {
		const modRef: TestingModule = await Test.createTestingModule({
			providers: [
				LoginService,
				{
					provide: getRepositoryToken(User),
					useClass: Repository,
				},
			],
		}).compile();

		loginService = modRef.get<LoginService>(LoginService);
		repo = modRef.get<Repository<User>>(getRepositoryToken(User));
	});

	it("should be defined", () => {
		expect(loginService).toBeDefined();
	});

	it("should be able to retrieve the hashed password from database", async () => {
		const user = {
			id: randomUUID(),
			name: "John Doe",
			email: "johndoe@test.com",
			role: UserRole.CUSTOMER,
			password: "hashed_password_from_database",
			services: [],
		};

		jest.spyOn(repo, "findOne").mockImplementation(async () => user);

		expect(await loginService.getHashedPass("johndoe@test.com")).toEqual(
			user.password
		);
	});

	it("shouldn't be able to retrieve the hashed password from database", async () => {
		jest.spyOn(repo, "findOne").mockImplementation(async () => null);

		expect(
			await loginService.getHashedPass("johndoe@test.com")
		).toBeFalsy();
	});
});

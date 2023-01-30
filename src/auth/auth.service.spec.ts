import { randomUUID } from "node:crypto";
import { Repository } from "typeorm";
import { User } from "@app/users/users.entity";
import { UsersService } from "@app/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { UserRole } from "@app/users/enums/user-role.enum";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Service } from "@app/services/entities/services.entity";

describe("AuthService", () => {
	let repo: Repository<User>;
	let jwtService: JwtService;
	let userService: UsersService;
	let authService: AuthService;

	beforeEach(async () => {
		const modRef = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: getRepositoryToken(User),
					useClass: Repository,
				},
				{
					provide: getRepositoryToken(Service),
					useClass: Repository,
				},
				AuthService,
				JwtService,
			],
		}).compile();
		userService = modRef.get(UsersService);
		authService = modRef.get(AuthService);
		jwtService = modRef.get(JwtService);
		repo = modRef.get<Repository<User>>(getRepositoryToken(User));
	});

	it("should be defined", () => {
		expect(authService).toBeDefined();
	});

	it("should be able to validate an user", async () => {
		const user = {
			id: randomUUID(),
			name: "John Doe",
			email: "johndoe@test.com",
			password:
				"$2b$10$or4/Llz5Ym6P4poE3FGjMO3r1yczSe.CCcKTdjxYGhPLcZlnmEMce",
			role: UserRole.CUSTOMER,
			services: [],
		};

		jest.spyOn(userService, "findUserByEmail").mockImplementation(
			async () => {
				return user;
			}
		);

		expect(
			await authService.validateUser("johndoe@test.com", "gui123")
		).toEqual(user);
	});

	it("should be able to throw an error when couldn't validate an user", async () => {
		const user = {
			id: randomUUID(),
			name: "John Doe",
			email: "johndoe@test.com",
			password:
				"$2b$10$or4/Llz5Ym6P4poE3FGjMO3r1yczSe.CCcKTdjxYGhPLcZlnmEMce",
			role: UserRole.CUSTOMER,
			services: [],
		};

		jest.spyOn(userService, "findUserByEmail").mockImplementation(
			async () => {
				return user;
			}
		);

		try {
			await authService.validateUser("johndoe@test.com", "gui12345");
		} catch (error) {
			expect(error.message).toBeTruthy();
		}
	});

	it("should be able to login", async () => {
		const user = {
			id: randomUUID(),
			name: "John Doe",
			email: "johndoe@test.com",
			password:
				"$2b$10$or4/Llz5Ym6P4poE3FGjMO3r1yczSe.CCcKTdjxYGhPLcZlnmEMce",
			role: UserRole.CUSTOMER,
		};

		jest.spyOn(jwtService, "sign").mockImplementation(() => {
			return "jwttokenprovided";
		});

		expect(await authService.login(user)).toEqual({
			access_token: "jwttokenprovided",
		});
	});
});

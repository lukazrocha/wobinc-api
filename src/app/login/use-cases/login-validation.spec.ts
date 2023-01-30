import { UnauthorizedException } from "@nestjs/common";
import { UserRole } from "@app/users/enums/user-role.enum";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "@app/users/users.service";
import { User } from "@app/users/users.entity";
import { AuthService } from "@auth/auth.service";
import { LoginValidation } from "./login-validation";
import { Service } from "@app/services/entities/services.entity";

describe("Login Validation", () => {
	let repo: Repository<User>;
	let repoService: Repository<Service>;
	let jwtService: JwtService;
	let userService: UsersService;
	let auth: AuthService;
	let service: LoginValidation;

	beforeEach(async () => {
		userService = new UsersService(repo, repoService);
		auth = new AuthService(userService, jwtService);
		service = new LoginValidation(auth);
	});

	it("should be defined", async () => {
		expect(service).toBeDefined();
	});

	it("should be able to validate an email and password", async () => {
		const user: User = {
			name: "MockUser",
			email: "mocktest@mail.com",
			id: "aslkjlakjdsdlkasjhdlksajl",
			password: "akahdlkaiwheloqiwhlgaklihila",
			role: UserRole.CUSTOMER,
			services: [],
		};

		const result = user;

		const spy = jest
			.spyOn(auth, "validateUser")
			.mockImplementation(async () => result);

		expect(await service.execute("mocktest@mail.com", "123456789")).toBe(
			result
		);

		spy.mockReset();
		spy.mockRestore();
	});

	it("should be able to throw an error when it couldn't validate an email and password", async () => {
		const user: User = {
			name: "MockUser",
			email: "mocktest@mail.com",
			id: "aslkjlakjdsdlkasjhdlksajl",
			password: "akahdlkaiwheloqiwhlgaklihila",
			role: UserRole.CUSTOMER,
			services: [],
		};

		const spy = jest
			.spyOn(userService, "findUserByEmail")
			.mockImplementation(async (email) => {
				if (email === "mocktest@mail.com") {
					return user;
				} else {
					return null;
				}
			});

		try {
			await service.execute("mock@mail.com", "123456789");
		} catch (error) {
			expect(error.message).toBe("email or password invalid");
		}

		spy.mockReset();
		spy.mockRestore();
	});
});

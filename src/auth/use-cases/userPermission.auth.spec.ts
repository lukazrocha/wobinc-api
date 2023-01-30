import { Repository } from "typeorm";
import { UsersService } from "@app/users/users.service";
import { randomUUID } from "node:crypto";
import { UserRole } from "@app/users/enums/user-role.enum";
import { JwtService } from "@nestjs/jwt";
import { User } from "@app/users/users.entity";
import { UserNotFoundError } from "@app/users/use-cases/errors/user-not-found-error";
import { UserPermission } from "./userPermission.auth";
import { Service } from "@app/services/entities/services.entity";

describe("User Permission", () => {
	let repo: Repository<User>;
	let repoService: Repository<Service>;
	let userService: UsersService;
	let jwtService: JwtService;
	let userPermission: UserPermission;

	beforeEach(() => {
		jwtService = new JwtService();
		userService = new UsersService(repo, repoService);
		userPermission = new UserPermission(jwtService, userService);
	});

	it("should be defined", () => {
		expect(userPermission).toBeDefined();
	});

	it("should be able to validate an ADMIN user", async () => {
		const user = {
			role: UserRole.EMPLOYEE_ADMIN,
		};

		jest.spyOn(jwtService, "decode").mockImplementation(() => user);

		expect(await userPermission.isAdmin("Bearer token+alskjlahdahg")).toBe(
			true
		);
	});

	it("should be able to validate an EMPLOYEE user", async () => {
		const user = {
			role: UserRole.EMPLOYEE,
		};

		jest.spyOn(jwtService, "decode").mockImplementation(() => user);

		expect(
			await userPermission.isEmployee("Bearer token+alskjlahdahg")
		).toBe(true);
	});

	it("should be able to validate an ADMIN user like EMPLOYEE", async () => {
		const user = {
			role: UserRole.EMPLOYEE_ADMIN,
		};

		jest.spyOn(jwtService, "decode").mockImplementation(() => user);

		expect(
			await userPermission.isEmployee("Bearer token+alskjlahdahg")
		).toBe(true);
	});

	it("should be able to validate a CUSTOMER user", async () => {
		const user = {
			role: UserRole.CUSTOMER,
		};

		jest.spyOn(jwtService, "decode").mockImplementation(() => user);

		expect(
			await userPermission.isCustomer("Bearer token+alskjlahdahg")
		).toBe(true);
	});

	it("should be able to validate a TOKEN", async () => {
		jest.spyOn(jwtService, "verifyAsync").mockImplementation(async () => {
			return {};
		});

		expect(
			await userPermission.isTokenValid("Bearer token+alskjlahdahg")
		).toBe(true);
	});

	it("should be able to throw an error when couldn't validate a TOKEN", async () => {
		jest.spyOn(jwtService, "verifyAsync").mockImplementation(async () => {
			throw new Error("");
		});

		try {
			await userPermission.isTokenValid("Bearer token+alskjlahdahg");
		} catch (error) {
			expect(error.message).toBeTruthy();
		}
	});

	it("should be able to get the role of an user throught a TOKEN", async () => {
		jest.spyOn(jwtService, "decode").mockImplementation(async () => {
			return {
				email: "mock@mail.com",
				sub: randomUUID(),
				role: "CUSTOMER",
			};
		});

		const role = await userPermission.getLoggedInUserRole(
			"Bearer token+alskjlahdahg"
		);

		expect(role).toBeTruthy();
		expect(role).toEqual("CUSTOMER");
	});

	it("should be able to get the id of an user throught a TOKEN", async () => {
		const randomid = randomUUID();
		jest.spyOn(jwtService, "decode").mockImplementation(async () => {
			return {
				email: "mock@mail.com",
				sub: randomid,
				role: "CUSTOMER",
			};
		});

		const id = await userPermission.getLoggedInUserId(
			"Bearer token+alskjlahdahg"
		);

		expect(id).toBeTruthy();
		expect(id).toEqual(randomid);
	});

	it("should be able to get the user throuht a TOKEN", async () => {
		const randomid = randomUUID();
		jest.spyOn(jwtService, "decode").mockImplementation(async () => {
			return {
				email: "mock@mail.com",
				sub: randomid,
				role: "CUSTOMER",
			};
		});

		jest.spyOn(userService, "findById").mockImplementation(async () => {
			return {
				id: randomid,
				email: "",
				role: UserRole.CUSTOMER,
				name: "Chico Oliveira",
				password: "hash",
				services: [],
			};
		});

		const user = await userPermission.getLoggedUser(
			"Bearer token+alskjlahdahg"
		);

		expect(user).toBeTruthy();
		expect(user.id).toEqual(randomid);
	});

	it("should be able to throw an error when trying to get the user throuht a TOKEN", async () => {
		const randomid = randomUUID();
		jest.spyOn(jwtService, "decode").mockImplementation(async () => {
			return {
				email: "mock@mail.com",
				sub: randomid,
				role: "CUSTOMER",
			};
		});

		jest.spyOn(userService, "findById").mockImplementation(async () => {
			throw new UserNotFoundError("user not found");
		});

		try {
			await userPermission.getLoggedUser("Bearer token+alskjlahdahg");
		} catch (error) {
			expect(error).toBeTruthy();
		}
	});
});

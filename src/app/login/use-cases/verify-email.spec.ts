import { User } from "@app/users/users.entity";
import { Repository } from "typeorm";
import { UsersService } from "@app/users/users.service";
import { VerifyIfEmailExists } from "./verify-email";
import { Service } from "@app/services/entities/services.entity";
describe("Verify Email", () => {
	let repo: Repository<User>;
	let repoService: Repository<Service>;
	let usersService: UsersService;
	let verifyIfEmailExists: VerifyIfEmailExists;

	beforeEach(() => {
		usersService = new UsersService(repo, repoService);
		verifyIfEmailExists = new VerifyIfEmailExists(usersService);
	});

	it("should be defined", async () => {
		expect(verifyIfEmailExists).toBeDefined();
	});

	it("should be able to find and validate an existing email, not allowing create a user with it", async () => {
		jest.spyOn(usersService, "findUserByEmail").mockImplementation(
			async () => new User()
		);

		try {
			await verifyIfEmailExists.execute("lkz@wobinc.com");
		} catch (error) {
			expect(error.message).toBeTruthy();
			expect(error.message).toEqual("Email already registered.");
		}
	});

	it("should be able to not find an existing email, and allow to create a new user with it", async () => {
		jest.spyOn(usersService, "findUserByEmail").mockImplementation(
			async () => null
		);

		expect(await verifyIfEmailExists.execute("lkz@wobinc.com")).toBe(true);
	});
});

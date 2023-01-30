import { UserNotFoundError } from "./errors/user-not-found-error";
import { randomUUID } from "crypto";
import { UsersService } from "./../users.service";
import { Repository } from "typeorm";
import { User } from "../users.entity";
import { FindUser } from "./find-user";
import { Service } from "@app/services/entities/services.entity";
describe("Find User", () => {
	let repo: Repository<User>;
	let repoService: Repository<Service>;
	let usersService: UsersService;
	let findUser: FindUser;

	beforeEach(() => {
		usersService = new UsersService(repo, repoService);
		findUser = new FindUser(usersService);
	});

	it("should be defined", () => {
		expect(findUser).toBeDefined();
	});

	it("should be able to find a user by id", async () => {
		jest.spyOn(usersService, "findById").mockImplementation(
			async () => new User()
		);

		const response = await findUser.execute(randomUUID());
		expect(response.user).toBeDefined();
	});

	it("shouldn't be able to find a user by id", async () => {
		jest.spyOn(usersService, "findById").mockImplementation(async () => {
			throw new UserNotFoundError("User not found");
		});

		try {
			await findUser.execute(randomUUID());
		} catch (error) {
			expect(error.message).toBeTruthy();
		}
	});
});

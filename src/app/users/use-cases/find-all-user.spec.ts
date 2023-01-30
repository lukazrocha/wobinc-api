import { Service } from "@app/services/entities/services.entity";
import { Repository } from "typeorm";
import { User } from "../users.entity";
import { UsersService } from "./../users.service";
import { FindAllUsers } from "./find-all-user";

describe("Find All Users", () => {
	let repo: Repository<User>;
	let repoService: Repository<Service>;
	let findAllUsers: FindAllUsers;
	let usersService: UsersService;

	beforeEach(() => {
		usersService = new UsersService(repo, repoService);
		findAllUsers = new FindAllUsers(usersService);
	});

	it("should be defined", () => {
		expect(findAllUsers).toBeDefined();
	});

	it("should be able to retrieve all users registered", async () => {
		jest.spyOn(usersService, "findAll").mockImplementation(async () => [
			new User(),
			new User(),
		]);

		const response = await findAllUsers.execute();

		expect(response.users).toBeDefined();
		expect(response.users.length).toBe(2);
	});
});

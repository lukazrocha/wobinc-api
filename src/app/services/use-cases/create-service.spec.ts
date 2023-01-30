import { randomUUID } from "node:crypto";
import { User } from "@app/users/users.entity";
import { CreateService } from "./create-service";
import { Repository } from "typeorm";
import { Service } from "../entities/services.entity";
import { ServicesService } from "./../services.service";
import { CreateServiceBody } from "../dtos/create-service-body";
import { UserRole } from "@app/users/enums/user-role.enum";

describe("Create Service usecase", () => {
	let repo: Repository<Service>;
	let servicesService: ServicesService;
	let createService: CreateService;

	beforeEach(() => {
		servicesService = new ServicesService(repo);
		createService = new CreateService(servicesService);
	});

	it("should be defined", () => {
		expect(createService).toBeDefined();
	});

	it("should be able to create a new service", async () => {
		const body: CreateServiceBody = {
			location_site: "http://another.com",
			description: "Verificacao em website",
		};

		const user: User = {
			id: randomUUID(),
			name: "John Doe",
			email: "johndoe@test.com",
			password: "123456789",
			role: UserRole.CUSTOMER,
			services: [],
		};

		jest.spyOn(servicesService, "create").mockImplementation(
			async () => new Service()
		);

		const createdService = await createService.execute(body, user);

		expect(createdService).toBeDefined();
	});
});

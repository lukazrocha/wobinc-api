import { randomUUID } from "node:crypto";
import { FindService } from "./find-service";
import { ServicesService } from "./../services.service";
import { Repository } from "typeorm";
import { Service } from "../entities/services.entity";

describe("Find Service usecase", () => {
	let repo: Repository<Service>;
	let servicesServices: ServicesService;
	let findService: FindService;

	beforeEach(() => {
		servicesServices = new ServicesService(repo);
		findService = new FindService(servicesServices);
	});

	it("should be defined", () => {
		expect(findService).toBeDefined();
	});

	it("should be able to find a Service by id", async () => {
		jest.spyOn(servicesServices, "getServiceById").mockImplementation(
			async () => new Service()
		);

		const service = await findService.execute(randomUUID());

		expect(service).toBeDefined();
	});

	it("should be able to find a Service by id", async () => {
		jest.spyOn(servicesServices, "getServiceById").mockImplementation(
			async () => null
		);

		try {
			await findService.execute(randomUUID());
		} catch (error) {
			expect(error).toBeDefined();
			expect(error.message).toBeDefined();
		}
	});
});

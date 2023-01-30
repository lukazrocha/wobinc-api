import { UserRole } from "@app/users/enums/user-role.enum";
import { randomUUID } from "node:crypto";
import { ServiceStatus } from "./enums/service-status.enum";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Test } from "@nestjs/testing";
import { ServicesService } from "./services.service";
import { Service } from "./entities/services.entity";
import { User } from "@app/users/users.entity";

describe("ServiceService", () => {
	let repo: Repository<Service>;
	let serviceService: ServicesService;

	beforeEach(async () => {
		const modRef = await Test.createTestingModule({
			providers: [
				ServicesService,
				{
					provide: getRepositoryToken(Service),
					useClass: Repository,
				},
			],
		}).compile();
		serviceService = modRef.get(ServicesService);
		repo = modRef.get<Repository<Service>>(getRepositoryToken(Service));
	});

	it("should be defined", () => {
		expect(serviceService).toBeDefined();
	});

	it("should be able to create a user", async () => {
		const serviceBody = {
			location_site: "",
			description: "",
		};

		const service = {
			...serviceBody,
			customer: new User(),
			requestedAt: new Date(),
			status: ServiceStatus.PENDING,
		};

		jest.spyOn(repo, "create").mockImplementation(() => service);
		jest.spyOn(repo, "save").mockImplementation(async () => service);

		expect(await serviceService.create(service)).toBeTruthy();
	});

	it("should be able to find services by employee and status", async () => {
		const user: User = {
			id: randomUUID(),
			name: "John Doe",
			email: "johndoe@wobinc.com",
			password: "123456789",
			role: UserRole.EMPLOYEE,
			services: [],
		};
		const service: Service = {
			location_site: "",
			description: "",
			customer: new User(),
			requestedAt: new Date(),
			status: ServiceStatus.SCHEDULED,
			employee: user,
		};

		jest.spyOn(repo, "find").mockImplementation(async () => [service]);

		const services = await serviceService.getEmployeeServicesByStatus(
			user,
			ServiceStatus.SCHEDULED
		);
		expect(services).toHaveLength(1);
		expect(services[0].status).toEqual(ServiceStatus.SCHEDULED);
	});

	it("should be able to find all services by status", async () => {
		const service: Service = {
			location_site: "",
			description: "",
			customer: new User(),
			requestedAt: new Date(),
			status: ServiceStatus.COMPLETED,
			employee: new User(),
		};

		jest.spyOn(repo, "find").mockImplementation(async () => [service]);

		const services = await serviceService.getAllServicesByStatus(
			ServiceStatus.COMPLETED
		);
		expect(services).toHaveLength(1);
		expect(services[0].status).toEqual(ServiceStatus.COMPLETED);
	});

	it("should be able to find a Service by Id", async () => {
		const service: Service = {
			id: "abc",
			location_site: "",
			description: "",
			customer: new User(),
			requestedAt: new Date(),
			status: ServiceStatus.COMPLETED,
			employee: new User(),
		};

		jest.spyOn(repo, "findOneBy").mockImplementation(async () => service);

		const serviceById = await serviceService.getServiceById("abc");

		expect(serviceById).toBeTruthy();
		expect(serviceById.id).toEqual("abc");
		expect(serviceById.status).toEqual(ServiceStatus.COMPLETED);
	});

	it("should be able to throw an error when trying to find a Service by Id", async () => {
		jest.spyOn(repo, "findOneBy").mockImplementation(async () => null);

		try {
			await serviceService.getServiceById("cba");
		} catch (error) {
			expect(error).toBeTruthy();
			expect(error.message).toBeTruthy();
		}
	});

	it("should be able to find services by customer and status", async () => {
		const user: User = {
			id: randomUUID(),
			name: "John Doe",
			email: "johndoe@wobinc.com",
			password: "123456789",
			role: UserRole.CUSTOMER,
			services: [],
		};
		const service: Service = {
			location_site: "",
			description: "",
			customer: new User(),
			requestedAt: new Date(),
			status: ServiceStatus.SCHEDULED,
			employee: user,
		};

		jest.spyOn(repo, "find").mockImplementation(async () => [service]);

		const services = await serviceService.getCustomerServicesByStatus(
			user,
			ServiceStatus.SCHEDULED
		);
		expect(services).toHaveLength(1);
		expect(services[0].status).toEqual(ServiceStatus.SCHEDULED);
	});
});

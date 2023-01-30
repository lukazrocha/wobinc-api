import { ServicesService } from "./../services.service";
import { Repository } from "typeorm";
import { Service } from "../entities/services.entity";
import { FindAllServices } from "./find-all-services";
import { User } from "@app/users/users.entity";
describe("Find All Services usecase", () => {
	let repo: Repository<Service>;
	let servicesService: ServicesService;
	let findAllServices: FindAllServices;

	beforeEach(() => {
		servicesService = new ServicesService(repo);
		findAllServices = new FindAllServices(servicesService);
	});

	it("should be defined", () => {
		expect(findAllServices).toBeDefined();
	});

	it("should be able to retrieve all pending services", async () => {
		jest.spyOn(
			servicesService,
			"getAllServicesByStatus"
		).mockImplementation(async () => [new Service()]);

		const services = await findAllServices.getAllPendingServices();

		expect(services).toBeDefined();
		expect(services).toHaveLength(1);
	});

	it("should be able to retrieve all scheduled services", async () => {
		jest.spyOn(
			servicesService,
			"getAllServicesByStatus"
		).mockImplementation(async () => [new Service(), new Service()]);

		const services = await findAllServices.getAllScheduledServices();

		expect(services).toBeDefined();
		expect(services).toHaveLength(2);
	});

	it("should be able to retrieve all completed services", async () => {
		jest.spyOn(
			servicesService,
			"getAllServicesByStatus"
		).mockImplementation(async () => [
			new Service(),
			new Service(),
			new Service(),
		]);

		const services = await findAllServices.getAllCompletedServices();

		expect(services).toBeDefined();
		expect(services).toHaveLength(3);
	});

	it("should be able to retrieve all scheduled services by Employee", async () => {
		jest.spyOn(
			servicesService,
			"getEmployeeServicesByStatus"
		).mockImplementation(async () => [new Service(), new Service()]);

		const services = await findAllServices.getScheduledServicesByEmployee(
			new User()
		);

		expect(services).toBeDefined();
		expect(services).toHaveLength(2);
	});

	it("should be able to retrieve all completed services by Employee", async () => {
		jest.spyOn(
			servicesService,
			"getEmployeeServicesByStatus"
		).mockImplementation(async () => [
			new Service(),
			new Service(),
			new Service(),
		]);

		const services = await findAllServices.getCompletedServicesByEmployee(
			new User()
		);

		expect(services).toBeDefined();
		expect(services).toHaveLength(3);
	});

	it("should be able to retrieve all scheduled services by Customer", async () => {
		jest.spyOn(
			servicesService,
			"getCustomerServicesByStatus"
		).mockImplementation(async () => [new Service(), new Service()]);

		const services = await findAllServices.getScheduledServicesByCustomer(
			new User()
		);

		expect(services).toBeDefined();
		expect(services).toHaveLength(2);
	});

	it("should be able to retrieve all pending services by Customer", async () => {
		jest.spyOn(
			servicesService,
			"getCustomerServicesByStatus"
		).mockImplementation(async () => [new Service(), new Service()]);

		const services = await findAllServices.getPendingServicesByCustomer(
			new User()
		);

		expect(services).toBeDefined();
		expect(services).toHaveLength(2);
	});

	it("should be able to retrieve all completed services by Customer", async () => {
		jest.spyOn(
			servicesService,
			"getCustomerServicesByStatus"
		).mockImplementation(async () => [new Service(), new Service()]);

		const services = await findAllServices.getCompletedServicesByCustomer(
			new User()
		);

		expect(services).toBeDefined();
		expect(services).toHaveLength(2);
	});
});

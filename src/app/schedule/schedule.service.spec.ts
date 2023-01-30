import { randomUUID } from "node:crypto";
import { ServiceStatus } from "@app/services/enums/service-status.enum";
import { MockedServicesService } from "./../services/mocks/mock-services.service";
import { ServicesService } from "@app/services/services.service";
import { UsersService } from "@app/users/users.service";
import { Test, TestingModule } from "@nestjs/testing";
import { ScheduleService } from "./schedule.service";
import { MockedUsersService } from "@app/users/mocks/mock-user.service";
import { Service } from "@app/services/entities/services.entity";
import { User } from "@app/users/users.entity";

describe("ScheduleService", () => {
	let scheduleService: ScheduleService;
	let servicesService: ServicesService;
	let usersService: UsersService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ScheduleService,
				{ provide: ServicesService, useClass: MockedServicesService },
				{ provide: UsersService, useClass: MockedUsersService },
			],
		}).compile();

		scheduleService = module.get<ScheduleService>(ScheduleService);
		servicesService = module.get<ServicesService>(ServicesService);
		usersService = module.get<UsersService>(UsersService);
	});

	it("should be defined", () => {
		expect(scheduleService).toBeDefined();
	});

	it("should be able to schedule a service to a date and an employee", async () => {
		const service: Service = {
			description: "Verification",
			location_site: "Flowers St. 123",
			requestedAt: new Date(),
			customer: new User(),
			status: ServiceStatus.PENDING,
		};

		jest.spyOn(scheduleService, "toVinculateEmployee").mockImplementation(
			async () => service
		);
		jest.spyOn(servicesService, "save").mockImplementation(
			async () => service
		);

		const scheduled = await scheduleService.toSchedule(
			"21458588-0cdd-4851-8c8a-7210716b0e44",
			"b5df9d16-99d3-48dc-bf58-c9ed6347a614",
			new Date()
		);

		expect(scheduled).toBe(service);
		expect(scheduled.status).toBe(ServiceStatus.SCHEDULED);
	});

	it("should be able to unschedule a service", async () => {
		const service: Service = {
			description: "Verification",
			location_site: "Flowers St. 123",
			requestedAt: new Date(),
			customer: new User(),
			status: ServiceStatus.SCHEDULED,
		};

		jest.spyOn(scheduleService, "toUnvinculateEmployee").mockImplementation(
			async () => service
		);
		jest.spyOn(servicesService, "save").mockImplementation(
			async () => service
		);

		const pending = await scheduleService.toUnschedule(
			"21458588-0cdd-4851-8c8a-7210716b0e44"
		);

		expect(pending).toBe(service);
		expect(pending.status).toBe(ServiceStatus.PENDING);
	});

	it("should be able to complete a service", async () => {
		const service: Service = {
			description: "Verification",
			location_site: "Flowers St. 123",
			requestedAt: new Date(),
			customer: new User(),
			status: ServiceStatus.SCHEDULED,
		};

		jest.spyOn(servicesService, "getServiceById").mockImplementation(
			async () => service
		);
		jest.spyOn(servicesService, "save").mockImplementation(
			async () => service
		);

		const completed = await scheduleService.toComplete(
			"21458588-0cdd-4851-8c8a-7210716b0e44"
		);

		expect(completed).toBe(service);
		expect(completed.status).toBe(ServiceStatus.COMPLETED);
	});

	it("should be able to vinculate an employee to a service", async () => {
		const service: Service = {
			description: "Verification",
			location_site: "Flowers St. 123",
			requestedAt: new Date(),
			customer: new User(),
			status: ServiceStatus.SCHEDULED,
		};

		jest.spyOn(servicesService, "getServiceById").mockImplementation(
			async () => service
		);
		jest.spyOn(servicesService, "save").mockImplementation(
			async () => service
		);

		const serviceEmployee = await scheduleService.toVinculateEmployee(
			"21458588-0cdd-4851-8c8a-7210716b0e44",
			"b5df9d16-99d3-48dc-bf58-c9ed6347a614",
			new Date()
		);

		expect(serviceEmployee).toBe(service);
		expect(serviceEmployee.status).toBe(ServiceStatus.SCHEDULED);
		expect(serviceEmployee.employee.id).toBe(
			"b5df9d16-99d3-48dc-bf58-c9ed6347a614"
		);
	});

	it("should be able to vinculate an employee to a service", async () => {
		const service: Service = {
			description: "Verification",
			location_site: "Flowers St. 123",
			requestedAt: new Date(),
			customer: new User(),
			status: ServiceStatus.SCHEDULED,
		};

		jest.spyOn(servicesService, "getServiceById").mockImplementation(
			async () => service
		);
		jest.spyOn(servicesService, "save").mockImplementation(
			async () => service
		);

		const serviceEmployee = await scheduleService.toUnvinculateEmployee(
			"21458588-0cdd-4851-8c8a-7210716b0e44"
		);

		expect(serviceEmployee).toBe(service);
		expect(serviceEmployee.scheduledTo).toBe(null);
		expect(serviceEmployee.employee).toBe(null);
	});
});

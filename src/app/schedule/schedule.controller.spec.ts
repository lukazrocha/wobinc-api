import { FindUser } from "@app/users/use-cases/find-user";
import { ServicesService } from "@app/services/services.service";
import { MockedUserPermission } from "@auth/mocks/mock-userPermission.auth";
import { UserPermission } from "@auth/use-cases/userPermission.auth";
import { Test, TestingModule } from "@nestjs/testing";
import { ScheduleController } from "./schedule.controller";
import { ScheduleService } from "./schedule.service";
import { UsersService } from "@app/users/users.service";
import { MockedUsersService } from "@app/users/mocks/mock-user.service";
import { MockedServicesService } from "@app/services/mocks/mock-services.service";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { EmployeeAvailability } from "./use-cases/employee-availability";
import { MockedEmployeeAvailability } from "./mocks/mock-employee-availability";
import { MockedFindUser } from "./mocks/mock-find-user";

const request = require("supertest");

describe("ScheduleController", () => {
	let app: INestApplication;
	let controller: ScheduleController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ScheduleService,
				{ provide: UsersService, useClass: MockedUsersService },
				{ provide: ServicesService, useClass: MockedServicesService },
				{ provide: UserPermission, useClass: MockedUserPermission },
				{
					provide: EmployeeAvailability,
					useClass: MockedEmployeeAvailability,
				},
				{ provide: FindUser, useClass: MockedFindUser },
			],
			controllers: [ScheduleController],
		}).compile();

		controller = module.get<ScheduleController>(ScheduleController);
		app = module.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should be able to save a schedule", async () => {
		return request(app.getHttpServer())
			.patch(
				"/schedule/service/21458588-0cdd-4851-8c8a-7210716b0e44/save"
			)
			.set("Authorization", "Bearer Token+Jwt+Mock+Admin")
			.send({
				employee_id: "5e0b0e24-8b55-4360-9df4-688812dcb9fc",
				date: "2023-02-15 00:00:00.000",
			})
			.expect(200);
	});

	it("should be able to throw an error (400) when trying to save a schedule", async () => {
		return request(app.getHttpServer())
			.patch(
				"/schedule/service/21458588-0cdd-4851-8c8a-7210716b0e44/save"
			)
			.set("Authorization", "Bearer Token+Jwt+Mock+Admin")
			.send({
				employee_id: "5e0b0e24-8b55-4360-9df4-688812dcb9fc",
				date: "2023-02-28 00:00:00.000",
			})
			.expect(400);
	});

	it("should be able to throw an error (403) when trying to save a schedule", async () => {
		return request(app.getHttpServer())
			.patch(
				"/schedule/service/21458588-0cdd-4851-8c8a-7210716b0e44/save"
			)
			.set("Authorization", "Bearer Token+Jwt+Mock+Customer")
			.send({
				employee_id: "5e0b0e24-8b55-4360-9df4-688812dcb9fc",
				date: "2023-02-15 00:00:00.000",
			})
			.expect(403);
	});

	it("should be able to cancel a schedule", async () => {
		return request(app.getHttpServer())
			.patch(
				"/schedule/service/950610ef-8c55-460b-8b2b-7ffdfe343c72/cancel"
			)
			.set("Authorization", "Bearer Token+Jwt+Mock+Admin")
			.expect(200);
	});

	it("should be able to throw an error when trying to cancel a schedule", async () => {
		return request(app.getHttpServer())
			.patch(
				"/schedule/service/950610ef-8c55-460b-8b2b-7ffdfe343c72/cancel"
			)
			.set("Authorization", "Bearer Token+Jwt+Mock+Customer")
			.expect(403);
	});

	it("should be able to cancel a schedule", async () => {
		return request(app.getHttpServer())
			.patch(
				"/schedule/service/950610ef-8c55-460b-8b2b-7ffdfe343c72/complete"
			)
			.set("Authorization", "Bearer Token+Jwt+Mock+Employee")
			.expect(200);
	});

	it("should be able to throw an error when trying to complete a schedule", async () => {
		return request(app.getHttpServer())
			.patch(
				"/schedule/service/950610ef-8c55-460b-8b2b-7ffdfe343c72/complete"
			)
			.set("Authorization", "Bearer Token+Jwt+Mock+Customer")
			.expect(403);
	});

	it("should be able to retrieve a list of available employees", async () => {
		return request(app.getHttpServer())
			.post("/schedule/available-employees")
			.set("Authorization", "Bearer Token+Jwt+Mock+Admin")
			.send({
				date: "2023-02-15 00:00:00.000",
			})
			.expect(201);
	});

	it("should be able to throw an error (403) when trying to retrieve a list of available employees", async () => {
		return request(app.getHttpServer())
			.post("/schedule/available-employees")
			.set("Authorization", "Bearer Token+Jwt+Mock+Customer")
			.send({
				date: "2023-02-15 00:00:00.000",
			})
			.expect(403);
	});
});

import { FindAllServices } from "./use-cases/find-all-services";
import { CreateService } from "./use-cases/create-service";
import { randomUUID } from "node:crypto";
import { MockedJwtService } from "@auth/mocks/mock-jwt.service";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserPermission } from "@auth/use-cases/userPermission.auth";
import { Test, TestingModule } from "@nestjs/testing";
import { ServicesController } from "./services.controller";
import { MockedUserPermission } from "@auth/mocks/mock-userPermission.auth";
import { ServicesService } from "./services.service";
import { MockedServicesService } from "./mocks/mock-services.service";
import { FindService } from "./use-cases/find-service";

const request = require("supertest");

describe("ServicesController", () => {
	let app: INestApplication;
	let controller: ServicesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ServicesController],
			providers: [
				CreateService,
				FindAllServices,
				FindService,
				{
					provide: ServicesService,
					useClass: MockedServicesService,
				},
				{ provide: UserPermission, useClass: MockedUserPermission },
				{
					provide: JwtService,
					useClass: MockedJwtService,
				},
			],
		}).compile();

		controller = module.get<ServicesController>(ServicesController);
		app = module.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should be able to create a new service request", async () => {
		return request(app.getHttpServer())
			.post("/services/new")
			.set("Authorization", "Bearer Token+Jwt+Mock+Customer")
			.send({
				description: "Solicito verificacao pra minha empresa",
				location_site: "http://myempresa.com.br",
			})
			.expect(201);
	});

	it("should be able to throw an error trying to create a new service request [not a customer]", async () => {
		return request(app.getHttpServer())
			.post("/services/new")
			.set("Authorization", "Bearer Token+Jwt+Mock+Employee")
			.send({
				customer_id: randomUUID(),
				description: "Solicito verificacao pra minha empresa",
				location_site: "http://myempresa.com.br",
			})
			.expect(403);
	});

	it("should be able to throw an error 400 [BAD REQUEST] trying to create a new service request", async () => {
		return request(app.getHttpServer())
			.post("/services/new")
			.set("Authorization", "Bearer Token+Jwt+Mock+Customer")
			.send({
				customer_id: "",
				description: "",
				location_site: "",
			})
			.expect(400);
	});

	it("should be able to throw an error 400 [BAD REQUEST] trying to create a new service request", async () => {
		return request(app.getHttpServer())
			.post("/services/new")
			.set("Authorization", "Bearer Token+Jwt+Mock+Customer")
			.send({})
			.expect(400);
	});

	it("should be able to get all scheduled services for the logged in employee", async () => {
		return request(app.getHttpServer())
			.get("/services/employee/scheduled")
			.set("Authorization", "Bearer Token+Jwt+Mock+Employee")
			.expect(200);
	});

	it("should be able to throw an error when trying to get all scheduled services", async () => {
		return request(app.getHttpServer())
			.get("/services/employee/scheduled")
			.set("Authorization", "Bearer Token+Jwt+Mock+Customer")
			.expect(403);
	});

	it("should be able to get all completed services for the logged in employee", async () => {
		return request(app.getHttpServer())
			.get("/services/employee/completed")
			.set("Authorization", "Bearer Token+Jwt+Mock+Employee")
			.expect(200);
	});

	it("should be able to throw an error when trying to get all completed services", async () => {
		return request(app.getHttpServer())
			.get("/services/employee/completed")
			.set("Authorization", "Bearer Token+Jwt+Mock+Customer")
			.expect(403);
	});

	it("should be able to get all completed services [Admin]", async () => {
		return request(app.getHttpServer())
			.get("/services/completed")
			.set("Authorization", "Bearer Token+Jwt+Mock+Admin")
			.expect(200);
	});

	it("should be able to throw an error when trying to get all completed services [Admin]", async () => {
		return request(app.getHttpServer())
			.get("/services/completed")
			.set("Authorization", "Bearer Token+Jwt+Mock+Customer")
			.expect(403);
	});

	it("should be able to get all scheduled services [Admin]", async () => {
		return request(app.getHttpServer())
			.get("/services/scheduled")
			.set("Authorization", "Bearer Token+Jwt+Mock+Admin")
			.expect(200);
	});

	it("should be able to throw an error when trying to get all scheduled services [Admin]", async () => {
		return request(app.getHttpServer())
			.get("/services/scheduled")
			.set("Authorization", "Bearer Token+Jwt+Mock+Customer")
			.expect(403);
	});

	it("should be able to get all pending services [Admin]", async () => {
		return request(app.getHttpServer())
			.get("/services/pending")
			.set("Authorization", "Bearer Token+Jwt+Mock+Admin")
			.expect(200);
	});

	it("should be able to throw an error when trying to get all pending services [Admin]", async () => {
		return request(app.getHttpServer())
			.get("/services/pending")
			.set("Authorization", "Bearer Token+Jwt+Mock+Customer")
			.expect(403);
	});

	it("should be able to get all pending services [Admin]", async () => {
		return request(app.getHttpServer())
			.get("/services/21458588-0cdd-4851-8c8a-7210716b0e44")
			.set("Authorization", "Bearer Token+Jwt+Mock+Admin")
			.expect(200);
	});

	it("should be able to throw an error when trying to get all pending services [Admin]", async () => {
		return request(app.getHttpServer())
			.get("/services/cc146b1b-be27-43a3-b809-46d929a65573")
			.set("Authorization", "Bearer Token+Jwt+Mock+Customer")
			.expect(404);
	});

	it("should be able to get all completed services for the logged in customer", async () => {
		return request(app.getHttpServer())
			.get("/services/customer/completed")
			.set("Authorization", "Bearer Token+Jwt+Mock+Customer")
			.expect(200);
	});

	it("should be able to throw an error when trying to get all completed services [Customer]", async () => {
		return request(app.getHttpServer())
			.get("/services/customer/completed")
			.set("Authorization", "Bearer Token+Jwt+Mock+Employee")
			.expect(403);
	});

	it("should be able to get all scheduled services for the logged in customer", async () => {
		return request(app.getHttpServer())
			.get("/services/customer/scheduled")
			.set("Authorization", "Bearer Token+Jwt+Mock+Customer")
			.expect(200);
	});

	it("should be able to throw an error when trying to get all scheduled services [Customer]", async () => {
		return request(app.getHttpServer())
			.get("/services/customer/scheduled")
			.set("Authorization", "Bearer Token+Jwt+Mock+Employee")
			.expect(403);
	});

	it("should be able to get all pending services for the logged in customer", async () => {
		return request(app.getHttpServer())
			.get("/services/customer/pending")
			.set("Authorization", "Bearer Token+Jwt+Mock+Customer")
			.expect(200);
	});

	it("should be able to throw an error when trying to get all pending services [Customer]", async () => {
		return request(app.getHttpServer())
			.get("/services/customer/pending")
			.set("Authorization", "Bearer Token+Jwt+Mock+Employee")
			.expect(403);
	});
});

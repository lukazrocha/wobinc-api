import { INestApplication, ValidationPipe } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { CreateUser } from "./use-cases/create-user";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { FindUser } from "./use-cases/find-user";
import { FindAllUsers } from "./use-cases/find-all-user";
import { UserPermission } from "@auth/use-cases/userPermission.auth";
import { MockedUsersService } from "./mocks/mock-user.service";
import { MockedJwtService } from "@auth/mocks/mock-jwt.service";
import { MockedUserPermission } from "@auth/mocks/mock-userPermission.auth";

const request = require("supertest");

describe("UsersController", () => {
	let app: INestApplication;
	let controller: UsersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				CreateUser,
				FindUser,
				FindAllUsers,
				{ provide: JwtService, useClass: MockedJwtService },
				{ provide: UsersService, useClass: MockedUsersService },
				{ provide: UserPermission, useClass: MockedUserPermission },
			],
		}).compile();

		controller = module.get<UsersController>(UsersController);
		app = module.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should be able to create a user", async () => {
		return request(app.getHttpServer())
			.post("/users")
			.send({
				name: "Mary Christmas",
				email: "marychris@test.com",
				password: "mary123",
			})
			.expect(201);
	});

	it("should be able to throw an error when token is expired", async () => {
		return request(app.getHttpServer())
			.get("/users")
			.set("Authorization", "Bearer Token+Jwt")
			.expect(401);
	});

	it("should be able to retrieve all users when user is Admin", async () => {
		return request(app.getHttpServer())
			.get("/users")
			.set("Authorization", "Bearer Token+Jwt+Mock+Admin")
			.expect(200);
	});

	it("should be able to throw an error when user isn't Admin [employee]", async () => {
		return request(app.getHttpServer())
			.get("/users")
			.set("Authorization", "Bearer Token+Jwt+Mock+Employee")
			.expect(403);
	});

	it("should be able to throw an error when user isn't Admin [generic]", async () => {
		return request(app.getHttpServer())
			.get("/users")
			.set("Authorization", "Bearer Token+Jwt+Mock")
			.expect(403);
	});

	it("should be able to retrieve an user by id when user is Admin", async () => {
		return request(app.getHttpServer())
			.get("/users/b5df9d16-99d3-48dc-bf58-c9ed6347a614")
			.set("Authorization", "Bearer Token+Jwt+Mock+Admin")
			.expect(200);
	});

	it("should be able to throw an error when get an user by id when user isn't Admin", async () => {
		return request(app.getHttpServer())
			.get("/users/b5df9d16-99d3-48dc-bf58-c9ed6347a614")
			.set("Authorization", "Bearer Token+Jwt+Mock+Customer")
			.expect(403);
	});

	it("should be able to throw an 404 error when id doesn't exist", async () => {
		return request(app.getHttpServer())
			.get("/users/d1cf3896-d977-4050-9f9e-d22336481d38")
			.set("Authorization", "Bearer Token+Jwt+Mock+Admin")
			.expect(404);
	});
});

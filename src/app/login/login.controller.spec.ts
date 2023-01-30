import { JwtService } from "@nestjs/jwt";
import { UsersService } from "./../users/users.service";
import { AuthService } from "@auth/auth.service";
import { Test, TestingModule } from "@nestjs/testing";
import { LoginController } from "./login.controller";
import { LoginValidation } from "./use-cases/login-validation";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { MockedUsersService } from "@app/users/mocks/mock-user.service";
import { MockedJwtService } from "@auth/mocks/mock-jwt.service";
import { MockedUserPermission } from "@auth/mocks/mock-userPermission.auth";
import { UserPermission } from "@auth/use-cases/userPermission.auth";

const request = require("supertest");

describe("LoginController", () => {
	let app: INestApplication;
	let controller: LoginController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [LoginController],
			providers: [
				AuthService,
				{ provide: UsersService, useClass: MockedUsersService },
				{ provide: JwtService, useClass: MockedJwtService },
				LoginValidation,
				UserPermission,
				{ provide: UserPermission, useClass: MockedUserPermission },
			],
		}).compile();
		controller = module.get<LoginController>(LoginController);
		app = module.createNestApplication();
		app.useGlobalPipes(new ValidationPipe());
		await app.init();
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should login the user", () => {
		return request(app.getHttpServer())
			.post("/login")
			.send({
				email: "johndoe@test.com",
				password: "gui123",
			})
			.expect(201);
	});

	it("should be able to return a 401 [UNAUTHORIZED] when password is incorrect", () => {
		return request(app.getHttpServer())
			.post("/login")
			.send({
				email: "johndoe@test.com",
				password: "gui12345",
			})
			.expect(401);
	});

	it("should be able to return a 400 [BAD REQUEST] when missing password", () => {
		return request(app.getHttpServer())
			.post("/login")
			.send({
				email: "johndoe@test.com",
			})
			.expect(400);
	});

	it("should be able to to return the UserLoggedIn's Role", () => {
		return request(app.getHttpServer())
			.get("/login/auth/getRole")
			.set("authorization", "Bearer Token+Jwt+Mock")
			.expect(200);
	});

	it("should be able to return the UserLoggedIn's ID", () => {
		return request(app.getHttpServer())
			.get("/login/auth/getId")
			.set("authorization", "Bearer Token+Jwt+Mock")
			.expect(200);
	});
});

import { AuthService } from "@auth/auth.service";
import { UserPermission } from "@auth/use-cases/userPermission.auth";
import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { LoginBody } from "./dtos/login-body";
import { LoginValidation } from "./use-cases/login-validation";

@Controller("login")
export class LoginController {
	constructor(
		private loginValidation: LoginValidation,
		private authService: AuthService,
		private userPermission: UserPermission
	) {}

	@Post()
	public async login(@Body() body: LoginBody) {
		const { email, password } = body;
		const user = await this.loginValidation.execute(email, password);

		return await this.authService.login(user); // retornando o Token JWT
	}

	@Get("auth/getRole")
	@ApiBearerAuth()
	public async getUserRole(@Headers() headers) {
		const authorization = headers["authorization"];
		const role = await this.userPermission.getLoggedInUserRole(
			authorization
		);

		return role;
	}

	@Get("auth/getId")
	@ApiBearerAuth()
	public async getUserId(@Headers() headers) {
		const authorization = headers["authorization"];
		const id = await this.userPermission.getLoggedInUserId(authorization);

		return id;
	}
}

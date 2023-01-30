import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "@auth/auth.service";

@Injectable()
export class LoginValidation {
	constructor(private authService: AuthService) {}

	async execute(email: string, password: string) {
		const user = await this.authService.validateUser(email, password);

		return user;
	}
}

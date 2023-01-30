import { HashAndSaltPass } from "@app/login/use-cases/hash-and-salt-pass";
import { UsersService } from "@app/users/users.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private jwtService: JwtService
	) {}

	async validateUser(email: string, password: string): Promise<any> {
		const user = await this.usersService.findUserByEmail(email);
		if (!user) throw new UnauthorizedException("email or password invalid");

		const passwordValid = await HashAndSaltPass.compare(
			password,
			user.password
		);

		if (user && passwordValid) {
			return user;
		}
		throw new UnauthorizedException("email or password invalid");
	}

	async login(user: any) {
		const payload = { email: user.email, sub: user.id, role: user.role };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}
}

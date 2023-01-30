import { Injectable } from "@nestjs/common";
@Injectable()
export class MockedJwtService {
	async sign(token: string): Promise<string> {
		return "Mock+Jwt+Token";
	}

	async verifyAsync(token: string) {
		switch (token) {
			case "Token+Jwt+Mock":
				return true;
			case "Token+Jwt+Mock+Admin":
				return true;
			case "Token+Jwt+Mock+Employee":
				return true;
			case "Token+Jwt+Mock+Customer":
				return true;
			default:
				throw new Error("Token expired.");
		}
	}
}

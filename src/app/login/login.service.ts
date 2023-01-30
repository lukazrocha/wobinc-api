import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { User } from "@app/users/users.entity";

@Injectable()
export class LoginService {
	constructor(
		@InjectRepository(User) private loginRepository: Repository<User>
	) {}

	async getHashedPass(email: string): Promise<string> {
		const user = await this.loginRepository.findOne({ where: { email } });
		if (user !== null) {
			return user.password;
		}
		return "";
	}
}

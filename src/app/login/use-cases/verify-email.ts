import { EmailAlreadyExists } from "@app/users/use-cases/errors/email-already-exists-error";
import { UsersService } from "@app/users/users.service";

export class VerifyIfEmailExists {
	constructor(private readonly usersService: UsersService) {}

	async execute(email: string): Promise<boolean> {
		const user = await this.usersService.findUserByEmail(email);

		if (user !== null && user !== undefined) {
			throw new EmailAlreadyExists("Email already registered.");
		}
		return true;
	}
}

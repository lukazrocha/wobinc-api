import { HashAndSaltPass } from "../../login/use-cases/hash-and-salt-pass";
import { VerifyIfEmailExists } from "../../login/use-cases/verify-email";
import { UserRole } from "@app/users/enums/user-role.enum";
import { UsersService } from "../users.service";
import { EmailAlreadyExists } from "./errors/email-already-exists-error";
import { User } from "../users.entity";
import {
	BadRequestException,
	Injectable,
	NotAcceptableException,
} from "@nestjs/common";

export interface CreateUserRequest {
	name: string;
	email: string;
	password: string;
}

export interface CreateUserResponse {
	user: User;
}

@Injectable()
export class CreateUser {
	constructor(private readonly userService: UsersService) {}

	async execute(request: CreateUserRequest): Promise<CreateUserResponse> {
		try {
			const { name, email, password } = request;

			const verifyEmail = new VerifyIfEmailExists(this.userService);
			await verifyEmail.execute(email);

			const role = this.initUserRole(email);

			const hashedPass = await HashAndSaltPass.hash(password);

			const user = await this.userService.create({
				name,
				email,
				role,
				password: hashedPass,
			});

			return {
				user,
			};
		} catch (err) {
			if (err instanceof EmailAlreadyExists) {
				throw new BadRequestException(err.message);
			} else {
				throw new NotAcceptableException(err.message);
			}
		}
	}

	public initUserRole(email: string): UserRole {
		if (email.includes("@wobinc.com")) {
			return UserRole.EMPLOYEE;
		} else {
			return UserRole.CUSTOMER;
		}
	}
}

import { UserNotFoundError } from "@app/users/use-cases/errors/user-not-found-error";
import { Injectable } from "@nestjs/common";
import { User } from "../users.entity";
import { UsersService } from "../users.service";

export interface UserResponse {
	user: User;
}

@Injectable()
export class FindUser {
	constructor(private readonly userService: UsersService) {}

	async execute(userId: string): Promise<UserResponse> {
		try {
			const user = await this.userService.findById(userId);

			return { user };
		} catch (error) {
			if (error instanceof UserNotFoundError) {
				throw new UserNotFoundError(error.message);
			}
		}
	}
}

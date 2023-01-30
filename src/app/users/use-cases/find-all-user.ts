import { Injectable } from "@nestjs/common";
import { User } from "../users.entity";
import { UsersService } from "../users.service";

export interface UsersResponse {
	users: User[];
}

@Injectable()
export class FindAllUsers {
	constructor(private userService: UsersService) {}

	async execute(): Promise<UsersResponse> {
		const users = await this.userService.findAll();

		return { users };
	}
}

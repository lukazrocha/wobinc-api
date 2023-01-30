import { FindUser } from "@app/users/use-cases/find-user";
import { CreateUser } from "@app/users/use-cases/create-user";
import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Headers,
	ForbiddenException,
	NotFoundException,
} from "@nestjs/common";
import { FindAllUsers } from "@app/users/use-cases/find-all-user";
import { UserViewModel } from "./view-models/user-view-model";
import { CreateUserBody } from "./dtos/create-user-body";
import { UserPermission } from "@auth/use-cases/userPermission.auth";
import { UserNotFoundError } from "./use-cases/errors/user-not-found-error";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("users")
export class UsersController {
	constructor(
		private createUser: CreateUser,
		private findUser: FindUser,
		private findAllUsers: FindAllUsers,
		private userPermission: UserPermission
	) {}

	@Get(":id")
	@ApiBearerAuth()
	async findUserById(@Param("id") id: string, @Headers() headers: object) {
		const authorization = headers["authorization"]; // pega o conteúdo do header authorization
		await this.userPermission.isTokenValid(authorization);

		if (await this.userPermission.isAdmin(authorization)) {
			try {
				const { user } = await this.findUser.execute(id);

				return {
					user: UserViewModel.toHTTP(user),
				};
			} catch (error) {
				if (error instanceof UserNotFoundError) {
					throw new NotFoundException(error.message);
				}
			}
		} else {
			throw new ForbiddenException(); //retorna proibido
		}
	}

	@Get()
	@ApiBearerAuth()
	async findAll(@Headers() headers: object) {
		const authorization = headers["authorization"]; // pega o conteúdo do header authorization
		await this.userPermission.isTokenValid(authorization);

		if (await this.userPermission.isAdmin(authorization)) {
			const { users } = await this.findAllUsers.execute();

			return {
				users: users.map((user) => UserViewModel.toHTTP(user)),
			};
		} else {
			throw new ForbiddenException(); //retorna proibido
		}
	}

	@Post()
	async createNewUser(@Body() body: CreateUserBody) {
		const { name, email, password } = body;

		const response = await this.createUser.execute({
			name,
			email,
			password,
		});

		const { user } = response;

		if (user) {
			return {
				user: UserViewModel.toHTTP(user),
			};
		}
	}
}

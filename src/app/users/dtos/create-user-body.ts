import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Length } from "class-validator";
import { UserRole } from "../enums/user-role.enum";

export class CreateUserBody {
	@ApiProperty()
	@IsNotEmpty()
	@Length(5, 240)
	name: string;

	@ApiProperty()
	@IsNotEmpty()
	email: string;

	@ApiProperty()
	@IsNotEmpty()
	password: string;

	role: UserRole;
}

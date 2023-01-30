import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateServiceBody {
	@ApiProperty()
	@IsNotEmpty()
	description: string;

	@ApiProperty()
	@IsNotEmpty()
	location_site: string;
}

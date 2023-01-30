import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty } from "class-validator";

export class AvailabilityByDateBody {
	@ApiProperty()
	@IsNotEmpty()
	@IsDateString()
	date: string;
}

import { ApiProperty } from "@nestjs/swagger";
import {
	IsDateString,
	IsNotEmpty,
	IsString,
	IsUUID,
	MinDate,
} from "class-validator";

export class ScheduleBody {
	@ApiProperty()
	@IsString()
	@IsNotEmpty()
	@IsUUID()
	employee_id: string;

	@ApiProperty()
	@IsDateString()
	date: string;
}

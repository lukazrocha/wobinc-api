import { UserRole } from "@app/users/enums/user-role.enum";
import { BadRequestException } from "@nestjs/common";
export interface Availability {
	employeeId: string;
	date: string;
}
export class MockedEmployeeAvailability {
	private availableEmployees: Availability[] = [];
	constructor() {
		this.availableEmployees.push({
			employeeId: "5e0b0e24-8b55-4360-9df4-688812dcb9fc",
			date: "2023-02-15 00:00:00.000",
		});
	}
	async isAvailable(employeeId: string, date: string) {
		if (
			this.availableEmployees[0].employeeId == employeeId &&
			this.availableEmployees[0].date == date
		) {
			return true;
		}
		throw new BadRequestException("");
	}

	async getAllAvailableEmployeeByDate(date: string) {
		const availableEmployees = [
			{
				id: this.availableEmployees[0].employeeId,
				name: "John Doe Again",
				email: "mocked@mock.com",
				password: "hash",
				role: UserRole.EMPLOYEE,
			},
		];

		return availableEmployees;
	}
}

import { ServicesService } from "@app/services/services.service";
import { BadRequestException, Injectable } from "@nestjs/common";
import { FindUser } from "@app/users/use-cases/find-user";
import { ServiceStatus } from "@app/services/enums/service-status.enum";
import { UsersService } from "@app/users/users.service";

@Injectable()
export class EmployeeAvailability {
	constructor(
		private findUser: FindUser,
		private serviceService: ServicesService,
		private usersService: UsersService
	) {}

	async isAvailable(employeeId: string, date: string): Promise<boolean> {
		const { user } = await this.findUser.execute(employeeId);

		const servicesScheduled =
			await this.serviceService.getEmployeeServicesByStatus(
				user,
				ServiceStatus.SCHEDULED
			);

		let isBusyEmployee: boolean = false;
		const dateToTest = new Date(date);
		servicesScheduled.forEach((service) => {
			if (service.scheduledTo.toISOString() == dateToTest.toISOString()) {
				isBusyEmployee = true;
			}
		});

		if (isBusyEmployee) {
			throw new BadRequestException(
				"Employee isn't available in this date"
			);
		}
		return true;
	}

	async getAllAvailableEmployeeByDate(date: string) {
		return await this.usersService.findAllAvailableEmployeesByDate(date);
	}
}

import { AvailabilityByDateBody } from "./dtos/availability-by-date-body";
import { ScheduleService } from "./schedule.service";
import { Body, ForbiddenException, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Controller, Headers, Patch } from "@nestjs/common";
import { UserPermission } from "@auth/use-cases/userPermission.auth";
import { Service } from "@app/services/entities/services.entity";
import { ScheduleBody } from "./dtos/schedule-body";
import { UserViewModel } from "@app/users/view-models/user-view-model";
import { EmployeeAvailability } from "./use-cases/employee-availability";

@Controller("schedule")
export class ScheduleController {
	constructor(
		private userPermission: UserPermission,
		private scheduleService: ScheduleService,
		private employeeAvailability: EmployeeAvailability
	) {}

	@ApiBearerAuth()
	@Patch("service/:serviceId/save")
	async saveSchedule(
		@Headers() headers: object,
		@Param("serviceId") serviceId: string,
		@Body() body: ScheduleBody
	): Promise<Service> {
		const { employee_id, date } = body;

		await this.employeeAvailability.isAvailable(employee_id, date);

		const authorization = headers["authorization"];
		await this.userPermission.isTokenValid(authorization);
		if (await this.userPermission.isAdmin(authorization)) {
			const scheduledService = await this.scheduleService.toSchedule(
				serviceId,
				employee_id,
				new Date(date)
			);

			return {
				...scheduledService,
				employee: UserViewModel.toHTTP(scheduledService.employee),
			};
		} else {
			throw new ForbiddenException("User is not an Admin.");
		}
	}

	@ApiBearerAuth()
	@Patch("service/:serviceId/cancel")
	async cancelSchedule(
		@Headers() headers: object,
		@Param("serviceId") serviceId: string
	): Promise<Service> {
		const authorization = headers["authorization"];
		await this.userPermission.isTokenValid(authorization);
		if (await this.userPermission.isAdmin(authorization)) {
			const unscheduledService = await this.scheduleService.toUnschedule(
				serviceId
			);

			return {
				...unscheduledService,
			};
		} else {
			throw new ForbiddenException("User is not an Admin.");
		}
	}

	@ApiBearerAuth()
	@Patch("service/:serviceId/complete")
	async completeSchedule(
		@Headers() headers: object,
		@Param("serviceId") serviceId: string
	): Promise<Service> {
		const authorization = headers["authorization"];
		await this.userPermission.isTokenValid(authorization);
		if (await this.userPermission.isEmployee(authorization)) {
			const completedService = await this.scheduleService.toComplete(
				serviceId
			);

			return {
				...completedService,
			};
		} else {
			throw new ForbiddenException("User is not an Employee.");
		}
	}

	@ApiBearerAuth()
	@Post("available-employees")
	async getAllAvailableEmployeesByDate(
		@Headers() headers: object,
		@Body() body: AvailabilityByDateBody
	) {
		const { date } = body;

		const authorization = headers["authorization"];
		await this.userPermission.isTokenValid(authorization);
		if (await this.userPermission.isAdmin(authorization)) {
			const availableEmployees =
				await this.employeeAvailability.getAllAvailableEmployeeByDate(
					date
				);

			return {
				availableEmployees: availableEmployees.map((employee) =>
					UserViewModel.toHTTP(employee)
				),
			};
		} else {
			throw new ForbiddenException("User is not an Admin.");
		}
	}
}

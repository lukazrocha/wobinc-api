import { Service } from "@app/services/entities/services.entity";
import { ServiceStatus } from "@app/services/enums/service-status.enum";
import { ServicesService } from "@app/services/services.service";
import { UsersService } from "@app/users/users.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ScheduleService {
	constructor(
		private servicesService: ServicesService,
		private usersService: UsersService
	) {}

	async toSchedule(
		serviceId: string,
		employeeId: string,
		date: Date
	): Promise<Service> {
		const scheduledService = await this.markServiceAsScheduled(
			await this.toVinculateEmployee(serviceId, employeeId, date)
		);

		return await this.servicesService.save(scheduledService);
	}

	async toUnschedule(serviceId: string): Promise<Service> {
		const unscheduledService = await this.markServiceAsPending(
			await this.toUnvinculateEmployee(serviceId)
		);

		return await this.servicesService.save(unscheduledService);
	}

	async toComplete(serviceId: string) {
		const service = await this.servicesService.getServiceById(serviceId);

		const completedService = await this.markServiceAsCompleted(service);

		return await this.servicesService.save(completedService);
	}

	async toVinculateEmployee(
		serviceId: string,
		employeeId: string,
		date: Date
	) {
		const service = await this.servicesService.getServiceById(serviceId);
		const employee = await this.usersService.findById(employeeId);

		service.employee = employee;
		service.scheduledTo = date;

		return service;
	}

	async toUnvinculateEmployee(serviceId: string) {
		const service = await this.servicesService.getServiceById(serviceId);

		service.employee = null;
		service.scheduledTo = null;

		return service;
	}

	async markServiceAsScheduled(service: Service) {
		service.status = ServiceStatus.SCHEDULED;

		return service;
	}

	async markServiceAsPending(service: Service) {
		service.status = ServiceStatus.PENDING;

		return service;
	}

	async markServiceAsCompleted(service: Service) {
		service.status = ServiceStatus.COMPLETED;

		return service;
	}
}

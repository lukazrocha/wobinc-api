import { Injectable } from "@nestjs/common";
import { ServiceStatus } from "../enums/service-status.enum";
import { ServicesService } from "../services.service";
import { Service } from "../entities/services.entity";
import { User } from "@app/users/users.entity";

@Injectable()
export class FindAllServices {
	constructor(private servicesService: ServicesService) {}

	async getAllPendingServices(): Promise<Service[]> {
		const pendingServices =
			await this.servicesService.getAllServicesByStatus(
				ServiceStatus.PENDING
			);
		return pendingServices;
	}

	async getAllScheduledServices(): Promise<Service[]> {
		const pendingServices =
			await this.servicesService.getAllServicesByStatus(
				ServiceStatus.SCHEDULED
			);
		return pendingServices;
	}

	async getAllCompletedServices(): Promise<Service[]> {
		const pendingServices =
			await this.servicesService.getAllServicesByStatus(
				ServiceStatus.COMPLETED
			);
		return pendingServices;
	}

	async getScheduledServicesByEmployee(employee: User): Promise<Service[]> {
		const scheduledServicesByEmployee =
			await this.servicesService.getEmployeeServicesByStatus(
				employee,
				ServiceStatus.SCHEDULED
			);
		return scheduledServicesByEmployee;
	}

	async getCompletedServicesByEmployee(employee: User): Promise<Service[]> {
		const scheduledServicesByEmployee =
			await this.servicesService.getEmployeeServicesByStatus(
				employee,
				ServiceStatus.COMPLETED
			);
		return scheduledServicesByEmployee;
	}

	async getScheduledServicesByCustomer(customer: User): Promise<Service[]> {
		const scheduledServicesByEmployee =
			await this.servicesService.getCustomerServicesByStatus(
				customer,
				ServiceStatus.SCHEDULED
			);
		return scheduledServicesByEmployee;
	}

	async getPendingServicesByCustomer(customer: User): Promise<Service[]> {
		const pendingServicesByEmployee =
			await this.servicesService.getCustomerServicesByStatus(
				customer,
				ServiceStatus.PENDING
			);
		return pendingServicesByEmployee;
	}

	async getCompletedServicesByCustomer(customer: User): Promise<Service[]> {
		const completedServicesByEmployee =
			await this.servicesService.getCustomerServicesByStatus(
				customer,
				ServiceStatus.COMPLETED
			);
		return completedServicesByEmployee;
	}
}

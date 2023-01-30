import { ServiceStatus } from "./../enums/service-status.enum";
import { UserRole } from "@app/users/enums/user-role.enum";
import { randomUUID } from "node:crypto";
import { Service } from "./../entities/services.entity";
import { CreateServiceBody } from "../dtos/create-service-body";
import { User } from "@app/users/users.entity";

export class MockedServicesService {
	private serviceRepository: Array<Service> = [];
	private customer: User = {
		id: randomUUID(),
		name: "Another SA",
		email: "another@sa.com",
		password: "123456789",
		role: UserRole.CUSTOMER,
		services: [],
	};

	private employee: User = {
		id: randomUUID(),
		name: "John Doe",
		email: "johndoe@wobinc.com",
		password: "123456789",
		role: UserRole.EMPLOYEE,
		services: [],
	};

	constructor() {
		this.serviceRepository.push({
			id: "21458588-0cdd-4851-8c8a-7210716b0e44",
			customer: this.customer,
			description: "Verificacao em website",
			location_site: "http://another.com",
			requestedAt: new Date(),
			status: ServiceStatus.PENDING,
		});
		this.serviceRepository.push({
			id: "950610ef-8c55-460b-8b2b-7ffdfe343c72",
			customer: this.customer,
			description: "Verificacao em website",
			location_site: "http://another.com",
			requestedAt: new Date(),
			status: ServiceStatus.SCHEDULED,
			employee: this.employee,
		});
		this.serviceRepository.push({
			id: "73cc1742-687a-4088-a848-2e38737c34fc",
			customer: this.customer,
			description: "Verificacao em website",
			location_site: "http://another.com",
			requestedAt: new Date(),
			status: ServiceStatus.COMPLETED,
			scheduledTo: new Date(),
			employee: this.employee,
		});
	}

	async create(service: CreateServiceBody): Promise<Service> {
		const serviceToSave = {
			...service,
			id: randomUUID(),
			customer: this.customer,
			requestedAt: new Date(),
			status: ServiceStatus.PENDING,
		};
		const serviceSaved = await this.save(serviceToSave);
		return serviceSaved;
	}

	async save(service): Promise<Service> {
		const serviceIndex = await this.serviceRepository.push(service);
		return await this.serviceRepository[serviceIndex - 1];
	}

	async getEmployeeServicesByStatus(
		employee: User,
		status: ServiceStatus
	): Promise<Service[]> {
		const services = await this.serviceRepository.filter(
			(service) =>
				service.status == status &&
				service.employee.email == employee.email
		);

		return services;
	}

	async getCustomerServicesByStatus(
		customer: User,
		status: ServiceStatus
	): Promise<Service[]> {
		const services = await this.serviceRepository.filter(
			(service) =>
				service.status == status &&
				service.customer.email == customer.email
		);

		return services;
	}

	async getAllServicesByStatus(status: ServiceStatus): Promise<Service[]> {
		const services = await this.serviceRepository.filter(
			(service) => service.status == status
		);
		return services;
	}

	async getServiceById(id: string) {
		const service = await this.serviceRepository.filter(
			(service) => service.id == id
		);
		if (service) {
			return service[0];
		}
	}
}

import { User } from "@app/users/users.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Service } from "./entities/services.entity";
import { ServiceStatus } from "./enums/service-status.enum";
import { ServiceNotFound } from "./use-cases/errors/service-not-found.error";

@Injectable()
export class ServicesService {
	constructor(
		@InjectRepository(Service)
		private servicesRepository: Repository<Service>
	) {}

	async create(service: Service): Promise<Service> {
		return await this.save(this.servicesRepository.create(service));
	}

	async save(service: Service): Promise<Service> {
		return await this.servicesRepository.save(service);
	}

	async getServiceById(serviceId: string): Promise<Service> {
		const serviceById = await this.servicesRepository.findOneBy({
			id: serviceId,
		});

		if (serviceById === null) {
			throw new ServiceNotFound(
				`Service with id: ${serviceId} not found`
			);
		}

		return serviceById;
	}

	async getEmployeeServicesByStatus(
		employee: User,
		status: ServiceStatus
	): Promise<Service[]> {
		return await this.servicesRepository.find({
			where: {
				employee,
				status,
			},
		});
	}

	async getCustomerServicesByStatus(
		customer: User,
		status: ServiceStatus
	): Promise<Service[]> {
		return await this.servicesRepository.find({
			where: {
				customer,
				status,
			},
		});
	}

	async getAllServicesByStatus(status: ServiceStatus): Promise<Service[]> {
		return await this.servicesRepository.find({
			where: {
				status,
			},
		});
	}
}

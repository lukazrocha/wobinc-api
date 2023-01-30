import { Injectable } from "@nestjs/common";
import { ServiceNotFound } from "./errors/service-not-found.error";
import { Service } from "../entities/services.entity";
import { ServicesService } from "../services.service";

@Injectable()
export class FindService {
	constructor(private servicesService: ServicesService) {}

	async execute(serviceId: string): Promise<Service> {
		const service = await this.servicesService.getServiceById(serviceId);
		if (service === null || service === undefined) {
			throw new ServiceNotFound(
				`Service with id: ${serviceId} not found`
			);
		}
		return service;
	}
}

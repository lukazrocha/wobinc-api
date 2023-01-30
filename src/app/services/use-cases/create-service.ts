import { User } from "@app/users/users.entity";
import { Injectable } from "@nestjs/common";
import { CreateServiceBody } from "../dtos/create-service-body";
import { Service } from "../entities/services.entity";
import { ServiceStatus } from "../enums/service-status.enum";
import { ServicesService } from "./../services.service";

@Injectable()
export class CreateService {
	constructor(private serviceService: ServicesService) {}

	async execute(service: CreateServiceBody, customer: User) {
		const serviceToCreate: Service = {
			...service,
			customer: customer,
			requestedAt: new Date(),
			status: ServiceStatus.PENDING,
		};
		return this.serviceService.create(serviceToCreate);
	}
}

import { FindService } from "./use-cases/find-service";
import { FindAllServices } from "./use-cases/find-all-services";
import { UserViewModel } from "./../users/view-models/user-view-model";
import { UserPermission } from "@auth/use-cases/userPermission.auth";
import { CreateServiceBody } from "./dtos/create-service-body";
import {
	Body,
	Controller,
	Post,
	Headers,
	ForbiddenException,
	Get,
	Param,
	NotFoundException,
	NotAcceptableException,
} from "@nestjs/common";
import { CreateService } from "./use-cases/create-service";
import { ServiceNotFound } from "./use-cases/errors/service-not-found.error";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller("services")
export class ServicesController {
	constructor(
		private userPermission: UserPermission,
		private createService: CreateService,
		private findAllServices: FindAllServices,
		private findService: FindService
	) {}

	@Post("new")
	@ApiBearerAuth()
	async requestNewService(
		@Headers() headers: object,
		@Body() body: CreateServiceBody
	) {
		const authorization = headers["authorization"];
		await this.userPermission.isTokenValid(authorization);

		if (await this.userPermission.isCustomer(authorization)) {
			const customer = await this.userPermission.getLoggedUser(
				authorization
			);
			const createdService = await this.createService.execute(
				body,
				customer
			);

			return {
				service: {
					...createdService,
					customer: UserViewModel.toHTTP(createdService.customer),
				},
			};
		} else {
			throw new ForbiddenException("User is not a Customer.");
		}
	}

	@Get("employee/scheduled")
	@ApiBearerAuth()
	async requestAllScheduledServicesForEmployee(@Headers() headers: object) {
		const authorization = headers["authorization"];
		await this.userPermission.isTokenValid(authorization);

		if (await this.userPermission.isEmployee(authorization)) {
			const employee = await this.userPermission.getLoggedUser(
				authorization
			);

			const scheduledServicesByEmployee =
				await this.findAllServices.getScheduledServicesByEmployee(
					employee
				);
			return {
				scheduledServicesByEmployee,
			};
		} else {
			throw new ForbiddenException("User is not an Employee.");
		}
	}

	@Get("employee/completed")
	@ApiBearerAuth()
	async requestAllCompletedServicesForEmployee(@Headers() headers: object) {
		const authorization = headers["authorization"];
		await this.userPermission.isTokenValid(authorization);

		if (await this.userPermission.isEmployee(authorization)) {
			const employee = await this.userPermission.getLoggedUser(
				authorization
			);

			const completedServicesByEmployee =
				await this.findAllServices.getCompletedServicesByEmployee(
					employee
				);
			return {
				completedServicesByEmployee,
			};
		} else {
			throw new ForbiddenException("User is not an Employee.");
		}
	}

	@Get("scheduled")
	@ApiBearerAuth()
	async requestAllScheduledServices(@Headers() headers: object) {
		const authorization = headers["authorization"];
		await this.userPermission.isTokenValid(authorization);

		if (await this.userPermission.isAdmin(authorization)) {
			const allScheduledServices =
				await this.findAllServices.getAllScheduledServices();
			return {
				allScheduledServices,
			};
		} else {
			throw new ForbiddenException("User is not an Admin.");
		}
	}

	@Get("pending")
	@ApiBearerAuth()
	async requestAllPendingServices(@Headers() headers: object) {
		const authorization = headers["authorization"];
		await this.userPermission.isTokenValid(authorization);

		if (await this.userPermission.isAdmin(authorization)) {
			const allPendingServices =
				await this.findAllServices.getAllPendingServices();
			return {
				allPendingServices,
			};
		} else {
			throw new ForbiddenException("User is not an Admin.");
		}
	}

	@Get("completed")
	@ApiBearerAuth()
	async requestAllCompletedServices(@Headers() headers: object) {
		const authorization = headers["authorization"];
		await this.userPermission.isTokenValid(authorization);

		if (await this.userPermission.isAdmin(authorization)) {
			const allCompletedServices =
				await this.findAllServices.getAllCompletedServices();
			return {
				allCompletedServices,
			};
		} else {
			throw new ForbiddenException("User is not an Admin.");
		}
	}

	@Get(":id")
	@ApiBearerAuth()
	async getServiceById(@Param("id") id: string, @Headers() headers: object) {
		const authorization = headers["authorization"];

		await this.userPermission.isTokenValid(authorization);

		try {
			const serviceById = await this.findService.execute(id);

			return {
				service: serviceById,
			};
		} catch (error) {
			if (error instanceof ServiceNotFound) {
				throw new NotFoundException(error.message);
			}
		}
	}

	@Get("customer/scheduled")
	@ApiBearerAuth()
	async requestAllScheduledServicesForCustomer(@Headers() headers: object) {
		const authorization = headers["authorization"];
		await this.userPermission.isTokenValid(authorization);

		if (await this.userPermission.isCustomer(authorization)) {
			const customer = await this.userPermission.getLoggedUser(
				authorization
			);

			const scheduledServicesByCustomer =
				await this.findAllServices.getScheduledServicesByCustomer(
					customer
				);
			return {
				scheduledServicesByCustomer,
			};
		} else {
			throw new ForbiddenException("User is not a Customer.");
		}
	}

	@Get("customer/pending")
	@ApiBearerAuth()
	async requestAllPendingServicesForCustomer(@Headers() headers: object) {
		const authorization = headers["authorization"];
		await this.userPermission.isTokenValid(authorization);

		if (await this.userPermission.isCustomer(authorization)) {
			const customer = await this.userPermission.getLoggedUser(
				authorization
			);

			const pendingServicesByCustomer =
				await this.findAllServices.getPendingServicesByCustomer(
					customer
				);
			return {
				pendingServicesByCustomer,
			};
		} else {
			throw new ForbiddenException("User is not a Customer.");
		}
	}

	@Get("customer/completed")
	@ApiBearerAuth()
	async requestAllCompletedServicesForCustomer(@Headers() headers: object) {
		const authorization = headers["authorization"];
		await this.userPermission.isTokenValid(authorization);

		if (await this.userPermission.isCustomer(authorization)) {
			const customer = await this.userPermission.getLoggedUser(
				authorization
			);

			const completedServicesByCustomer =
				await this.findAllServices.getCompletedServicesByCustomer(
					customer
				);
			return {
				completedServicesByCustomer,
			};
		} else {
			throw new ForbiddenException("User is not a Customer.");
		}
	}
}

import { ServiceStatus } from "@app/services/enums/service-status.enum";
import { randomUUID } from "node:crypto";
import { Repository } from "typeorm";
import { EmployeeAvailability } from "./employee-availability";
import { ServicesService } from "@app/services/services.service";
import { FindUser } from "@app/users/use-cases/find-user";
import { UsersService } from "@app/users/users.service";
import { User } from "@app/users/users.entity";
import { Service } from "@app/services/entities/services.entity";
import { UserRole } from "@app/users/enums/user-role.enum";

describe("Employee Availability", () => {
	let repoUser: Repository<User>;
	let repoService: Repository<Service>;
	let employeeAvailability: EmployeeAvailability;
	let findUser: FindUser;
	let serviceService: ServicesService;
	let usersService: UsersService;

	beforeEach(() => {
		serviceService = new ServicesService(repoService);
		usersService = new UsersService(repoUser, repoService);
		findUser = new FindUser(usersService);
		employeeAvailability = new EmployeeAvailability(
			findUser,
			serviceService,
			usersService
		);
	});

	it("should be defined", () => {
		expect(employeeAvailability).toBeDefined();
	});

	it("should be able to return true when a employee is available", async () => {
		const user: User = {
			id: "f592a782-d021-42c1-bf6e-6f4ad61bd31c",
			name: "John Doe",
			email: "johndoe@wobinc.com",
			role: UserRole.EMPLOYEE,
		};

		const service: Service = {
			description: "Service",
			location_site: "website",
			requestedAt: new Date(),
			customer: new User(),
			status: ServiceStatus.SCHEDULED,
			employee: user,
			scheduledTo: new Date("2023-02-25 00:00:00.000"),
		};

		jest.spyOn(findUser, "execute").mockImplementation(async () => {
			return { user };
		});

		jest.spyOn(
			serviceService,
			"getEmployeeServicesByStatus"
		).mockImplementation(async () => [service]);

		const isAvailable = await employeeAvailability.isAvailable(
			"f592a782-d021-42c1-bf6e-6f4ad61bd31c",
			"2023-02-01 00:00:00.000"
		);

		expect(isAvailable).toBe(true);
	});

	it("should be able to throw an error when a employee isn't available", async () => {
		const user: User = {
			id: "f592a782-d021-42c1-bf6e-6f4ad61bd31c",
			name: "John Doe",
			email: "johndoe@wobinc.com",
			role: UserRole.EMPLOYEE,
		};

		const service: Service = {
			description: "Service",
			location_site: "website",
			requestedAt: new Date(),
			customer: new User(),
			status: ServiceStatus.SCHEDULED,
			employee: user,
			scheduledTo: new Date("2023-02-01 00:00:00.000"),
		};

		jest.spyOn(findUser, "execute").mockImplementation(async () => {
			return { user };
		});

		jest.spyOn(
			serviceService,
			"getEmployeeServicesByStatus"
		).mockImplementation(async () => [service]);

		try {
			await employeeAvailability.isAvailable(
				"f592a782-d021-42c1-bf6e-6f4ad61bd31c",
				"2023-02-01 00:00:00.000"
			);
		} catch (error) {
			expect(error).toBeDefined();
			expect(error.message).toBeDefined();
		}
	});

	it("should be able retrieve all available employees", async () => {
		const user: User = {
			id: "f592a782-d021-42c1-bf6e-6f4ad61bd31c",
			name: "John Doe",
			email: "johndoe@wobinc.com",
			role: UserRole.EMPLOYEE,
		};

		jest.spyOn(
			usersService,
			"findAllAvailableEmployeesByDate"
		).mockImplementation(async () => [user]);

		const availableEmployees =
			await employeeAvailability.getAllAvailableEmployeeByDate(
				"2023-02-01 00:00:00.000"
			);

		expect(availableEmployees).toHaveLength(1);
		expect(availableEmployees[0].id).toEqual(
			"f592a782-d021-42c1-bf6e-6f4ad61bd31c"
		);
		expect(availableEmployees[0].name).toEqual("John Doe");
		expect(availableEmployees[0].role).toEqual(UserRole.EMPLOYEE);
	});
});

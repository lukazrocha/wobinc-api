import { Service } from "./../services/entities/services.entity";
import { UserRole } from "@app/users/enums/user-role.enum";
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column()
	name: string;

	@Column()
	email: string;

	@Column()
	password?: string;

	@Column()
	role: UserRole;

	@OneToMany((type) => Service, (service) => service.customer)
	services?: Service[];
}

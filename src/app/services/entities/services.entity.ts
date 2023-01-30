import { User } from "@app/users/users.entity";
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	IsNull,
	UpdateDateColumn,
} from "typeorm";
import { ServiceStatus } from "../enums/service-status.enum";

@Entity()
export class Service {
	@PrimaryGeneratedColumn("uuid")
	id?: string;

	@Column("text")
	description: string;

	@Column()
	location_site: string;

	@CreateDateColumn()
	requestedAt: Date;

	@ManyToOne((type) => User, (user) => user.services)
	customer: User;

	@Column()
	status: ServiceStatus;

	@ManyToOne((type) => User, (user) => user.services)
	employee?: User;

	@Column({ type: "timestamptz", nullable: true })
	scheduledTo?: Date;
}

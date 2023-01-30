import { Module } from "@nestjs/common";
import { UsersModule } from "@app/users/users.module";
import { UsersService } from "@app/users/users.service";

@Module({
	imports: [UsersModule],
	providers: [
		UsersService,
		{
			provide: UsersService,
			useValue: {},
		},
	],
})
export class HttpModule {}

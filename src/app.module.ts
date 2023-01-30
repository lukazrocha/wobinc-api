import { HttpModule } from "@infra/http/http.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { LoginModule } from "@app/login/login.module";
import { AuthModule } from "@auth/auth.module";
import { ServicesModule } from "@app/services/services.module";
import { ScheduleModule } from "./app/schedule/schedule.module";

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot({
			type: "postgres",
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			database: process.env.DB_NAME,
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			synchronize: true,
			entities: [__dirname + "/**/*.entity{.js, .ts}"],
		}),
		HttpModule,
		LoginModule,
		AuthModule,
		ServicesModule,
		ScheduleModule,
	],
})
export class AppModule {}

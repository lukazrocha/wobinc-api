import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors();
	app.useGlobalPipes(new ValidationPipe());

	const config = new DocumentBuilder()
		.setTitle("Well-Organized Business Inc. API")
		.setDescription("API to provide data to the WOBInc App.")
		.setVersion("1.0")
		.addTag("service, schedule")
		.addBearerAuth({
			// I was also testing it without prefix 'Bearer ' before the JWT
			description: `[just text field] Please enter token in following format: Bearer <JWT>`,
			name: "Authorization",
			bearerFormat: "Bearer", // I`ve tested not to use this field, but the result was the same
			scheme: "Bearer",
			type: "http", // I`ve attempted type: 'apiKey' too
			in: "Header",
		})
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup("api", app, document);

	app.enableCors();

	await app.listen(3001);
}
bootstrap();

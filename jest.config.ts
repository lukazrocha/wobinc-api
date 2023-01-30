import { Config } from "jest";
import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";

const config: Config = {
	moduleFileExtensions: ["js", "json", "ts"],
	testRegex: ".*\\.spec\\.ts$",
	transform: {
		"^.+\\.(t|j)s$": "ts-jest",
	},
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: "<rootDir>/",
	}),
	coveragePathIgnorePatterns: [
		"coverage/",
		"dist/",
		"dtos/",
		"enums/",
		"view-models/",
		"node_modules/",
		"/*.module.(t|j)s",
		"/*.config.(t|j)s",
		"/main.(t|j)s",
		"/*.entity.(t|j)s",
	],
	collectCoverageFrom: ["**/*.(t|j)s"],
	coverageDirectory: "coverage",
	testEnvironment: "node",
};

export default config;

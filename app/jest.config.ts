import { pathsToModuleNameMapper } from "ts-jest";
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
import { compilerOptions } from "./tsconfig.json";
import { Config } from "@jest/types";
const config: Config.InitialOptions = {
	rootDir: ".",
	clearMocks: true,
	// test files settings
	testMatch: ["<rootDir>/tests/**/**.spec.ts", "<rootDir>/tests/**/**.test.ts"],
	testPathIgnorePatterns: ["dist", "node_modules"],
	moduleDirectories: ["<rootDir>/src", "node_modules", "../../node_modules"],
	testResultsProcessor: "jest-sonar-reporter",
	modulePathIgnorePatterns: ["src/mocks"],
	coveragePathIgnorePatterns: ["src/mocks"],
	// test coverage
	coverageDirectory: "./coverage/",
	collectCoverageFrom: [
		"!src/**/*.{ts,tsx}",
		"src/(services|schema|controllers)/**/*",
	],
	// coverageThreshold: {
	//   global: {
	//     branches: 80,
	//     functions: 80,
	//     lines: 80,
	//     statements: 80,
	//   },
	// },
	setupFiles: ["<rootDir>/tests/setup.ts"],
	collectCoverage: true,
	coverageReporters: [
		"json",
		"lcov",
		"text",
		"clover",
		"cobertura",
		"text-summary",
	],
	reporters: [
		"default",
		[
			"jest-junit",
			{
				suiteName: "jest tests",
				outputDirectory: "./coverage",
				outputName: "test-report.xml",
				uniqueOutputName: "false",
				classNameTemplate: "{classname}-{title}",
				titleTemplate: "{classname}-{title}",
				ancestorSeparator: " > ",
				usePathForSuiteName: "true",
			},
		],
	],

	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	testEnvironment: "node",
	preset: "ts-jest",
	transform: {
		"^.+\\.(t|j)s$": [
			"ts-jest",
			{
				compiler: "ttypescript",
				tsconfig: "./tsconfig.json",
			},
		],
	},
	moduleNameMapper: {
		...pathsToModuleNameMapper(compilerOptions.paths, {
			prefix: "<rootDir>/src",
		}),
	},
	roots: ["<rootDir>"],
	modulePaths: [compilerOptions.baseUrl],
};
export default config;

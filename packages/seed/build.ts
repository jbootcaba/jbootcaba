import { build } from "esbuild";
import { pnpPlugin } from "@yarnpkg/esbuild-plugin-pnp";
import { nodeExternalsPlugin } from "esbuild-node-externals";

build({
	plugins: [
		pnpPlugin(),
		nodeExternalsPlugin({
			packagePath: [
				"./package.json",
				"../core/package.json",
				"../config/package.json",
				"../context/package.json",
				"../express/package.json",
				"../helpers/package.json",
				"../http/package.json",
				"../inversify/package.json",
				"../logger/package.json",
				"../logger-pino/package.json",
				"../resiliency/package.json",
			],
			allowList: [
				"@jbootcaba/core",
				"@jbootcaba/config",
				"@jbootcaba/context",
				"@jbootcaba/express",
				"@jbootcaba/helpers",
				"@jbootcaba/http",
				"@jbootcaba/inversify",
				"@jbootcaba/logger",
				"@jbootcaba/logger-pino",
				"@jbootcaba/resiliency",
			],
		}),
	],
	bundle: true,
	entryPoints: ["src/index.ts"],
	// external: ["aws-sdk", "mock-aws-s3", "testcontainers"], // mock-aws-s3 from s3 template, testcontainers from dynamodb template
	minify: false,
	format: "cjs",
	platform: "node",
	target: "node16.0",
	sourcemap: true,
	outfile: "dist/index.js",
}).catch((e) => {
	console.log("Build not successful", e.message);
	process.exit(1);
});

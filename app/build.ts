import { build } from "esbuild";
import { pnpPlugin } from "@yarnpkg/esbuild-plugin-pnp";
import { esbuildDecorators } from "@anatine/esbuild-decorators";

build({
	plugins: [pnpPlugin(), esbuildDecorators()],
	bundle: true,
	entryPoints: ["src/index.ts"],
	// external: ["axios/lib/adapters/http"],
	// external: ["./node_modules/*"],
	// external: ["aws-sdk", "mock-aws-s3", "testcontainers"], // mock-aws-s3 from s3 template, testcontainers from dynamodb template
	minify: false,
	format: "cjs",
	platform: "node",
	target: "node16.0",
	keepNames: true,
	sourcemap: true,
	outfile: "dist/index.js",
}).catch((e) => {
	console.log("Build not successful", e.message);
	process.exit(1);
});

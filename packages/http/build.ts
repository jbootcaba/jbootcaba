import { build } from "esbuild";
import { pnpPlugin } from "@yarnpkg/esbuild-plugin-pnp";
import { nodeExternalsPlugin } from "esbuild-node-externals";

build({
	plugins: [pnpPlugin(), nodeExternalsPlugin({ allowList: ["@jbootcaba/*"] })],
	bundle: true,
	entryPoints: ["src/index.ts"],
	// external: ["./node_modules/*"],
	// external: ["axios/lib/adapters/http"], // mock-aws-s3 from s3 template, testcontainers from dynamodb template
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

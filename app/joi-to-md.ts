import { makeMarkdownDoc } from "joi-md-doc";
import { ConfigurationSchema } from "./src/Configuration";
const x = ConfigurationSchema.meta({
	name: "Schema Configurações",
	filename: "configSchema",
});
makeMarkdownDoc(x, { outputPath: "./docs" });

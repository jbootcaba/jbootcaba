import { LogLevel } from "@jbootcaba/core";
import Joi from "joi";
export declare enum NodeEnv {
    TEST = "TEST",
    LOCAL = "LOCAL",
    DEV = "DEV",
    QA = "QA",
    HOMOLG = "HOMOLOG",
    PRODUCTION = "PRODUCTION"
}
export declare type BaseConfiguration = {
    NODE_ENV: NodeEnv;
    SERVICE_NAME: string;
    LOG_LEVEL: LogLevel;
};
export declare class ConfigurationSchemaBuilder<T extends BaseConfiguration> {
    private schemaBasic;
    private constructor();
    static GivenConfiguration<T extends BaseConfiguration>(): ConfigurationSchemaBuilder<T>;
    With(x: Joi.SchemaMap): this;
    Build(): Joi.ObjectSchema<T>;
}
//# sourceMappingURL=schema.d.ts.map
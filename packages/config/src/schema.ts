import { LogLevel } from "@jbootcaba/core";
import Joi from "joi";

export enum NodeEnv {
  TEST = "TEST",
  LOCAL = "LOCAL",
  DEV = "DEV",
  QA = "QA",
  HOMOLG = "HOMOLOG",
  PRODUCTION = "PRODUCTION",
}

export type BaseConfiguration = {
  NODE_ENV: NodeEnv;
  SERVICE_NAME: string;
  LOG_LEVEL: LogLevel;
};
export class ConfigurationSchemaBuilder<T extends BaseConfiguration> {
  private schemaBasic: Joi.ObjectSchema<T>;
  private constructor() {
    this.schemaBasic = Joi.object<T>({
      NODE_ENV: Joi.string()
        .uppercase()
        .required()
        .valid(...Object.values(NodeEnv)),
      LOG_LEVEL: Joi.string()
        .lowercase()
        .default(LogLevel.info)
        .valid(...Object.values(LogLevel)),
      SERVICE_NAME: Joi.string().required(),
    })
      .unknown(false)
      .options({
        abortEarly: false,
        stripUnknown: { arrays: false, objects: true },
      });
  }
  public static GivenConfiguration<T extends BaseConfiguration>() {
    return new ConfigurationSchemaBuilder<T>();
  }
  public With(x: Joi.SchemaMap) {
    this.schemaBasic = this.schemaBasic
      .append(x)
      .unknown(false)
      .options({
        abortEarly: false,
        stripUnknown: { arrays: false, objects: true },
      });
    return this;
  }
  public Build(): Joi.ObjectSchema<T> {
    return this.schemaBasic;
  }
}

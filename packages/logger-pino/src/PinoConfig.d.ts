import { LoggerOptions } from "pino";
export declare type LoggerPinoConfig = LoggerOptions & {
    pretty?: boolean;
};
export declare type PinoElasticSearchConfig = LoggerPinoConfig & {
    SERVER_ADDRESS: string;
    INDEX: string;
    CONSISTENCY: string;
};
//# sourceMappingURL=PinoConfig.d.ts.map
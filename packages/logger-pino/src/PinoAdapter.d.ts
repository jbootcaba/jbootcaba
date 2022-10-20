import { LogLevel, ILoggerAdapter } from "@jbootcaba/logger";
import pino from "pino";
import { ILogger, LogFn } from "@jbootcaba/core";
export declare class PinoAdapter implements ILogger, ILoggerAdapter {
    logger: pino.Logger;
    level: LogLevel;
    private childAdapters;
    constructor(logger: pino.Logger);
    private getFn;
    getChild(scope: string): ILogger;
    changeLevel(level: LogLevel): void;
    fatal: LogFn;
    error: LogFn;
    warn: LogFn;
    info: LogFn;
    debug: LogFn;
    trace: LogFn;
    silent: LogFn;
}
//# sourceMappingURL=PinoAdapter.d.ts.map
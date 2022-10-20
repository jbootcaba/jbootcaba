import { ILogger, LogLevel } from "@jbootcaba/core";
import { ILoggerAdapter } from "./BaseLogger";
export declare class LoggerManager {
    private _adapter;
    get adapter(): ILoggerAdapter;
    constructor(adapter: ILoggerAdapter);
    ChangeAdapter(adapter: ILoggerAdapter): void;
    Get(scope: string): ILogger;
    ChangeLevel(level: LogLevel): void;
}
//# sourceMappingURL=LoggerManager.d.ts.map
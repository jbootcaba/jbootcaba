export declare enum LogLevel {
    info = "info",
    error = "error",
    warn = "warn",
    debug = "debug"
}
export interface ILogger {
    level: LogLevel;
    fatal: LogFn;
    error: LogFn;
    warn: LogFn;
    info: LogFn;
    debug: LogFn;
    trace: LogFn;
    silent: LogFn;
}
export interface LogFn {
    <T extends object>(obj: T, msg?: string, ...args: any[]): void;
    (obj: unknown, msg?: string, ...args: any[]): void;
    (msg: string, ...args: any[]): void;
}
//# sourceMappingURL=LoggerApi.d.ts.map
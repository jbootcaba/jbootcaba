import { ILogger, LogLevel } from "@jbootcaba/core";

export interface ILoggerAdapter {
	changeLevel(level: LogLevel): void;
	getChild(scope: string): ILogger;
}

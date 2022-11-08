import { LogLevel, ILoggerAdapter } from "@jbootcaba/logger";
import pino from "pino";
import { ILogger, LogFn } from "@jbootcaba/core";

export class PinoAdapter implements ILogger, ILoggerAdapter {
	level: LogLevel;
	private childAdapters: Record<string, PinoAdapter> = {};
	constructor(public logger: pino.Logger) {}
	private getFn(fn: string): LogFn {
		return (...args) => {
			if (this.logger[fn]) this.logger[fn](...args);
		};
	}
	getChild(scope: string): ILogger {
		if (this.childAdapters[scope]) return this.childAdapters[scope];
		this.childAdapters[scope] = new PinoAdapter(this.logger.child({ scope }));
		return this.childAdapters[scope];
	}

	changeLevel(level: LogLevel) {
		this.logger.level = level;
		for (const key in this.childAdapters) {
			this.childAdapters[key].changeLevel(level);
		}
	}

	fatal: LogFn = this.getFn("fatal");
	error: LogFn = this.getFn("error");
	warn: LogFn = this.getFn("warn");
	info: LogFn = this.getFn("info");
	debug: LogFn = this.getFn("debug");
	trace: LogFn = this.getFn("trace");
	silent: LogFn = this.getFn("silent");
}

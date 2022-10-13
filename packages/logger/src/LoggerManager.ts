import { ILogger, LogLevel } from "@jbootcaba/core";
import { ILoggerAdapter } from "./BaseLogger";

export class LoggerManager {
	private _adapter: ILoggerAdapter;

	public get adapter(): ILoggerAdapter {
		return this._adapter;
	}

	constructor(adapter: ILoggerAdapter) {
		this._adapter = adapter;
	}

	public ChangeAdapter(adapter: ILoggerAdapter) {
		this._adapter = adapter;
	}

	public Get(scope: string): ILogger {
		return this._adapter.getChild(scope);
	}

	public ChangeLevel(level: LogLevel) {
		this._adapter.changeLevel(level);
	}
}

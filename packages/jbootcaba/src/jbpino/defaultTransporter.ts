import pretty from "pino-pretty";
export const defaultTransporter = () => {
	return pretty({
		colorize: true,
		hideObject: true,
		translateTime: "SYS:standard",
		ignore: "hostname,pid", // add 'time' to remove timestamp
		messageFormat: (log, messageKey) => {
			// do some log message customization
			if (log.trace_id)
				return `${log.scope ?? ""} [${log.trace_id}] - ${log[messageKey]}`;
			return `${log.scope ?? ""} - ${log[messageKey]}`;
		},
	});
};

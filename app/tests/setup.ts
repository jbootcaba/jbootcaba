import "jest-ts-auto-mock";
jest.useFakeTimers();
const configMock = {
	NODE_ENV: "TEST",
	SERVICE_NAME: "TEST",
	SESSION_VALIDATION_FEATURE:
		'{"id":"SESSION_VALIDATION_FEATURE","description":"","enabled":false,"conditions":{"client_filters":[]}}',
	API_GATEWAY_URL: "https://teste.midway.io",
	API_KEY: "SAME_API_KEY",
	OTEL_COLLECTOR_TRACES: "https://collector.midway.io/traces",
	OTEL_COLLECTOR_METRICS: "https://collector.midway.io/metrics",
};
Object.assign(process.env, configMock);

import { Attributes } from "@opentelemetry/api";
import { MeterProvider, PushMetricExporter } from "@opentelemetry/sdk-metrics-base";
export declare type ApdexConfiguration = {
    isFailureStatus: (status: number) => boolean;
    threshold: number;
};
export declare type MetricsConfiguration = {
    SERVICE_NAME: string;
    APDEX?: ApdexConfiguration;
    EXPORTER: PushMetricExporter;
};
export declare class ExpressMetricsCollector {
    private config;
    private requestDuration;
    private toleratedValue;
    constructor(config: {
        meterProvider: MeterProvider;
        name: string;
        apdex: ApdexConfiguration;
    });
    start(): void;
    private calcApdex;
    record(statusCode: number, time: number, attributes: Attributes): void;
}
export declare const registerMetrics: (configuration: MetricsConfiguration) => ExpressMetricsCollector;
//# sourceMappingURL=metrics.d.ts.map
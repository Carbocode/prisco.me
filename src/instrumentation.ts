import { DiagConsoleLogger, DiagLogLevel, diag } from "@opentelemetry/api";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-proto";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-proto";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

const traces = new BatchSpanProcessor(
  new OTLPTraceExporter({
    url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
    headers: {
      Authorization:
        "Basic MTQ4OTk3MTpnbGNfZXlKdklqb2lNVFl6TmpRM055SXNJbTRpT2lKNWIzVnlMV2R5WVdaaGJtRXRkRzlyWlc0aUxDSnJJam9pV0VoSFdYWXlXbEZaVkVvd01UUXplalkxTWpaTGJqbFNJaXdpYlNJNmV5SnlJam9pY0hKdlpDMWxkUzFqWlc1MGNtRnNMVEFpZlgwPQ==",
    },
  }),
);

const metrics = new PeriodicExportingMetricReader({
  exporter: new OTLPMetricExporter({
    url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics`,
    headers: {
      Authorization:
        "Basic MTQ4OTk3MTpnbGNfZXlKdklqb2lNVFl6TmpRM055SXNJbTRpT2lKNWIzVnlMV2R5WVdaaGJtRXRkRzlyWlc0aUxDSnJJam9pV0VoSFdYWXlXbEZaVkVvd01UUXplalkxTWpaTGJqbFNJaXdpYlNJNmV5SnlJam9pY0hKdlpDMWxkUzFqWlc1MGNtRnNMVEFpZlgwPQ==",
    },
  }),
  exportIntervalMillis: 60000,
});

const logs = new BatchLogRecordProcessor(
  new OTLPLogExporter({
    url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/logs`,
    headers: {
      Authorization:
        "Basic MTQ4OTk3MTpnbGNfZXlKdklqb2lNVFl6TmpRM055SXNJbTRpT2lKNWIzVnlMV2R5WVdaaGJtRXRkRzlyWlc0aUxDSnJJam9pV0VoSFdYWXlXbEZaVkVvd01UUXplalkxTWpaTGJqbFNJaXdpYlNJNmV5SnlJam9pY0hKdlpDMWxkUzFqWlc1MGNtRnNMVEFpZlgwPQ==",
    },
  }),
);

const sdk = new NodeSDK({
  spanProcessors: [traces],
  metricReaders: [metrics],
  logRecordProcessors: [logs],
  instrumentations: [getNodeAutoInstrumentations(), new PinoInstrumentation()],
});

sdk.start();

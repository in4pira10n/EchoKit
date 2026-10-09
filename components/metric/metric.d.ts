import type { EchoIconSource } from "../icon.js";

export interface EchoMetricOptions {
  icon?: EchoIconSource;
  label?: string;
  value?: string | number;
  className?: string;
}

export interface EchoMetricElement extends HTMLDivElement {
  echoMetric: {
    update(options: Partial<EchoMetricOptions>): EchoMetricElement;
    getOptions(): EchoMetricOptions;
  };
}

export function createEchoMetric(options?: EchoMetricOptions): EchoMetricElement;

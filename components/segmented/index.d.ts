import type { EchoIconSource } from "../icon.js";

export interface EchoSegmentedItem {
  label?: string;
  icon?: EchoIconSource;
  ariaLabel?: string;
  disabled?: boolean;
  value?: string;
}

export interface EchoSegmentedOptions {
  items?: EchoSegmentedItem[];
  activeId?: number;
  ariaLabel?: string;
  className?: string | string[];
  onChange?: (index: number, item: EchoSegmentedItem, event: Event) => void;
}

export type EchoSegmentedElement = HTMLElement & {
  echoSegmented: {
    update(options?: EchoSegmentedOptions): HTMLElement;
    getOptions(): EchoSegmentedOptions;
    setActive(index: number): HTMLElement;
    destroy(): void;
  };
};

export function createEchoSegmented(options?: EchoSegmentedOptions): EchoSegmentedElement;

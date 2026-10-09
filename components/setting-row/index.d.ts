import type { EchoIconSource } from "../icon.js";

export interface EchoSettingRowOptions {
  icon?: EchoIconSource;
  title?: string;
  description?: string;
  content?: Node | Node[] | (() => Node | Node[]);
  expanded?: boolean;
  collapsible?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  onToggle?: (expanded: boolean, event: Event) => void;
}

export type EchoSettingRowElement = HTMLElement & {
  echoSettingRow: {
    update(options?: EchoSettingRowOptions): HTMLElement;
    getOptions(): EchoSettingRowOptions;
    setExpanded(expanded: boolean): HTMLElement;
    destroy(): void;
  };
};

export function createEchoSettingRow(options?: EchoSettingRowOptions): EchoSettingRowElement;

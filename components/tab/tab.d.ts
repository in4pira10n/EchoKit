import type { EchoIconSource } from "../icon.js";

export interface EchoTabItem {
  icon: EchoIconSource;
  iconActive?: EchoIconSource;
  label?: string;
  ariaLabel?: string;
  title?: string;
  disabled?: boolean;
  dataset?: Record<string, string | number | boolean>;
}

export interface EchoTabItemState extends EchoTabItem {
  id: number;
  icon: string;
  iconActive: string;
  ariaLabel: string;
  title: string;
  disabled: boolean;
  dataset: Record<string, string | number | boolean>;
}

export type EchoTabItemInput = EchoTabItem | EchoIconSource;

export interface EchoTabsOptions {
  tabs?: number;
  items?: EchoTabItemInput[];
  activeId?: number;
  ariaLabel?: string;
  id?: string;
  className?: string | string[];
  compactMedia?: string;
  onChange?: (index: number, item: EchoTabItemState | undefined, tabs: HTMLElement) => void;
}

export interface EchoTabsController {
  readonly element: HTMLElement;
  update(options?: EchoTabsOptions): HTMLElement;
  setActive(index: number, notify?: boolean): HTMLElement;
  getOptions(): EchoTabsOptions;
  destroy(): void;
}

export type EchoTabsElement = HTMLElement & {
  readonly echoTabs: EchoTabsController;
};

export function createEchoTabs(options?: EchoTabsOptions): EchoTabsElement;
export function upgradeEchoTabs(element: HTMLElement, options?: EchoTabsOptions): EchoTabsElement;
export function getEchoTabsController(element: Element | null | undefined): EchoTabsController | null;

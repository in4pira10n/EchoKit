import type { EchoIconSource } from "../icon.js";

export type EchoButtonVariant = "default" | "primary" | "complete" | "danger" | "quiet" | "switch";
export type EchoButtonVariantAlias = "accent" | "destructive" | "neutral" | "success";
export type EchoButtonSize = "md" | "sm" | "icon";
export type EchoButtonType = "button" | "submit" | "reset";
export type EchoSystemColor = "gray" | "red" | "orange" | "yellow" | "green" | "mint" | "teal" | "cyan" | "blue" | "indigo" | "purple" | "pink" | "brown";
export const ECHO_SYSTEM_COLORS: readonly EchoSystemColor[];

export interface EchoButtonOptions {
  label?: string;
  icon?: EchoIconSource;
  iconAlt?: string;
  variant?: EchoButtonVariant | EchoButtonVariantAlias;
  color?: EchoSystemColor | `#${string}` | null;
  state?: string;
  size?: EchoButtonSize;
  type?: EchoButtonType;
  disabled?: boolean;
  ariaLabel?: string;
  title?: string;
  id?: string;
  name?: string;
  value?: string;
  className?: string | string[];
  attributes?: Record<string, string | number | boolean | null | undefined>;
  dataset?: Record<string, string | number | boolean | null | undefined>;
  onClick?: (event: MouseEvent, button: HTMLButtonElement) => void;
}

export interface EchoButtonController {
  readonly element: HTMLButtonElement;
  update(options?: EchoButtonOptions): HTMLButtonElement;
  setState(state: string, options?: EchoButtonOptions): HTMLButtonElement;
  getOptions(): EchoButtonOptions;
  destroy(): void;
}

export type EchoButtonElement = HTMLButtonElement & {
  readonly echoButton: EchoButtonController;
};

export function createEchoButton(options?: EchoButtonOptions): EchoButtonElement;
export function upgradeEchoButton(element: HTMLButtonElement, options?: EchoButtonOptions): EchoButtonElement;
export function updateEchoButton(element: HTMLButtonElement, options?: EchoButtonOptions): EchoButtonElement;
export function getEchoButtonController(element: HTMLButtonElement | null | undefined): EchoButtonController | null;

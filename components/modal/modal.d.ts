import type { EchoIconSource } from "../icon.js";
import type { EchoButtonVariant, EchoButtonSize } from "../button/button.js";

export interface EchoModalAction {
  label: string;
  icon?: EchoIconSource;
  variant?: EchoButtonVariant;
  color?: string;
  size?: EchoButtonSize;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  disabled?: boolean;
  close?: boolean;
  onClick?: (event: MouseEvent, button: HTMLButtonElement) => void;
}

export type EchoModalContent = Node | string | ((body: HTMLElement) => Node | string | void);

export interface EchoModalOptions {
  id?: string;
  embedded?: boolean;
  icon?: EchoIconSource;
  title?: string;
  titleId?: string;
  addition?: string;
  /** @deprecated Use addition. */
  copy?: string;
  className?: string | string[];
  content?: EchoModalContent | EchoModalContent[];
  actions?: Array<EchoModalAction | HTMLButtonElement>;
}

export interface EchoModalController {
  readonly element: HTMLElement;
  readonly dialog: HTMLElement;
  open(trigger?: Element | null): HTMLElement;
  close(): HTMLElement;
  toggle(trigger?: Element | null): HTMLElement;
  destroy(): void;
}

export type EchoModalElement = HTMLElement & {
  readonly echoModal: EchoModalController;
};

export function createEchoModal(options?: EchoModalOptions): EchoModalElement;
export function getEchoModalController(element: Element | null | undefined): EchoModalController | null;
export function openEchoModal(modalOrId: string | Element, trigger?: Element | null): Element | null;
export function closeEchoModal(modalOrId: string | Element): Element | null;
export function installModalInteractions(root?: Document | HTMLElement): Document | HTMLElement;
export const installDialogTriggers: typeof installModalInteractions;

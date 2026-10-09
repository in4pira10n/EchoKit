export type EchoInputType = "email" | "number" | "password" | "search" | "tel" | "text" | "url";

export interface EchoInputOptions {
  type?: EchoInputType;
  multiline?: boolean;
  rows?: number;
  cols?: number;
  id?: string;
  name?: string;
  value?: string | number;
  placeholder?: string;
  autocomplete?: string;
  ariaLabel?: string;
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  wrapperTag?: "div" | "label";
  className?: string | string[];
  attributes?: Record<string, string | number | boolean | null | undefined>;
  dataset?: Record<string, string | number | boolean | null | undefined>;
  onInput?: (event: Event) => void;
  onChange?: (event: Event) => void;
}

export type EchoInputElement = HTMLInputElement | HTMLTextAreaElement;

export interface EchoFieldController {
  readonly element: HTMLElement;
  readonly input: EchoInputElement;
  update(options?: EchoInputOptions): HTMLElement;
  getOptions(): EchoInputOptions;
  destroy(): void;
}

export type EchoFieldElement = HTMLElement & {
  readonly echoField: EchoFieldController;
  readonly echoInput: EchoInputElement;
};

export function createEchoInput(options?: EchoInputOptions): EchoInputElement;
export function createEchoField(options?: EchoInputOptions): EchoFieldElement;
export function getEchoFieldController(element: Element | null | undefined): EchoFieldController | null;

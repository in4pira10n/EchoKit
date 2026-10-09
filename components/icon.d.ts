export type EchoIconSource = string | EchoIconDescriptor | null;

export type EchoIconDescriptor =
  | { sfSymbol: string; alt?: string }
  | { name: string; alt?: string }
  | { url: string; alt?: string }
  | { src: string; alt?: string };

/** Bare strings resolve to SF Symbol names; URL-like strings remain custom URLs. */
export function resolveEchoIcon(icon: EchoIconSource): string | null;
export function installEchoIcons(root?: Document | HTMLElement): Document | HTMLElement;

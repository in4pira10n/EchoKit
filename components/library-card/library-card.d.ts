import type { EchoIconSource } from "../icon.js";

export interface EchoLibraryMetric { label: string; value: string; icon?: EchoIconSource }
export interface EchoLibraryCardOptions {
  icon?: EchoIconSource; title?: string; addition?: string;
  attachment?: Array<Node | string | number | { mix?: number }>;
  content?: Array<Node | (() => Node | Node[])>;
  /** @deprecated Use title. */ name?: string;
  /** @deprecated Use addition. */ path?: string;
  logo?: string; accent?: string;
  active?: boolean; primary?: boolean; available?: boolean; rebuildRequired?: boolean;
  draggable?: boolean;
  onDragStart?: ((event: DragEvent, card: EchoLibraryCardElement) => void) | null;
  onDragEnd?: ((event: DragEvent, card: EchoLibraryCardElement) => void) | null;
  metrics?: EchoLibraryMetric[];
  onClick?: ((event: MouseEvent, card: EchoLibraryCardElement) => void) | null;
}
export interface EchoLibraryCardController {
  update(options: Partial<EchoLibraryCardOptions>): EchoLibraryCardElement;
  getOptions(): EchoLibraryCardOptions;
  destroy(): void;
}
export interface EchoLibraryCardElement extends HTMLDivElement { echoLibraryCard: EchoLibraryCardController }
export declare function createEchoLibraryCard(options?: EchoLibraryCardOptions): EchoLibraryCardElement;

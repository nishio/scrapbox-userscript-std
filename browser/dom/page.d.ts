import { BaseStore } from "./types.ts";
import type { Page as PageData } from "@cosense/types/rest";

export type { SetPositionOptions } from "./types.ts";

/** Configuration for generating API fetch URLs */
export interface ApiUrlForFetch {
  /** Name of the Scrapbox project */
  projectName: string;
  /** Title of the page to fetch */
  title: string;
  /** Hint for resolving page title */
  titleHint: string;
  /** Whether to follow page renames */
  followRename: boolean;
  /** Search query string */
  search: string;
}

/** Configuration for applying page snapshots to the editor */
export interface ApplySnapshotInit {
  /** Current page data with selected fields */
  page: Pick<PageData, "title" | "lines" | "created">;
  /** Previous page data with creation timestamp */
  prevPage?: Pick<PageData, "created">;
  /** Next page data with line content */
  nextPage?: Pick<PageData, "lines">;
}

/** Page data extended with caching timestamp information */
export type PageWithCache = PageData & { 
  /** Timestamp when the page was cached, or undefined if not cached */
  cachedAt: number | undefined 
};

/** Class representing a Scrapbox page in the editor */
export declare class Page extends BaseStore<
  { source: "mouse" | undefined } | "focusTextInput" | "scroll" | undefined
> {
  initialize(): void;

  private data: PageWithCache;

  get(): PageWithCache;

  apiUrlForFetch(init: ApiUrlForFetch): string;
  apiUrlForUpdatePageAccessed(pageId: string): string;
  fetch(): Promise<PageWithCache>;

  set(page: PageWithCache): void;
  reset(): void;
  applySnapshot(init: ApplySnapshotInit): void;
  setTitle(title: string, init?: { from: string }): void;
  get fromCacheStorage(): boolean;
  setPin(pin: number): void;
  delete(): void;
  patch(t: unknown): void;
  patchChanges(
    t: unknown,
    init?: { from: string },
  ): Promise<unknown>;
  get hasSelfBackLink(): boolean;
  requestFetchApiCacheToServiceWorker(): unknown;
}

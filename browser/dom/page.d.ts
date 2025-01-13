import { BaseStore } from "./types.ts";
import type { Page as PageData } from "@cosense/types/rest";

/** Options for setting cursor position in the editor
 * 
 * Controls cursor movement behavior and event source tracking.
 */
export interface SetPositionOptions {
  /** Whether to auto-scroll the page when the cursor moves outside the viewport
   * When `true`, the page will automatically scroll to keep the cursor visible
   *
   * @default {true}
   */
  scrollInView?: boolean;

  /** Source of the cursor movement event
   *
   * Can be set to `"mouse"` when the cursor movement is triggered by mouse interaction
   * This parameter helps distinguish between different types of cursor movements
   */
  source?: "mouse";
}

/** Configuration for generating API fetch URLs
 * 
 * Contains parameters needed to construct API URLs for fetching
 * page data and related resources.
 */
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

/** Configuration for applying page snapshots
 * 
 * Contains page data and optional previous/next page information
 * for applying snapshots to the editor.
 */
export interface ApplySnapshotInit {
  /** Current page data with selected fields */
  page: Pick<PageData, "title" | "lines" | "created">;
  /** Previous page data with creation timestamp */
  prevPage?: Pick<PageData, "created">;
  /** Next page data with line content */
  nextPage?: Pick<PageData, "lines">;
}

/** Page data with caching information
 * 
 * Extends the base page data with a timestamp indicating when
 * the page was last cached.
 */
export type PageWithCache = PageData & { 
  /** Timestamp when the page was cached, or undefined if not cached */
  cachedAt: number | undefined 
};

/** Class representing a Scrapbox page in the editor
 * 
 * Manages page content and state, providing methods for
 * accessing and manipulating page data. Handles page
 * loading, caching, and real-time updates.
 * Extends BaseStore to provide event handling capabilities.
 */
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

/** Common types used across the REST API modules
 * 
 * This module contains shared type definitions that are used by multiple
 * API endpoints and response handlers.
 * 
 * @module
 */

import { type Result } from "option-t/plain_result";
import type { FetchError } from "./errors.ts";

/** A fetch-like function that handles network errors gracefully
 * 
 * Similar to the standard fetch function, but returns a Result type
 * that properly handles network and other errors.
 * 
 * @param input - The request to send
 * @param init - Optional request initialization options
 * @returns A {@linkcode Result}<{@linkcode Response}, {@linkcode FetchError}> containing:
 *          - Success: The response from the server
 *          - Error: Network or other fetch-related errors
 * 
 * @public
 */
/** A fetch function that handles network errors and timeouts
 * 
 * @param request - The request to send
 * @returns A Result containing either the Response or a FetchError
 * @public
 */
export type RobustFetch = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Result<Response, FetchError>>;

/** Re-export PageList from @cosense/types/rest */
export type { PageList } from "@cosense/types/rest";

/** Re-export SearchResult from @cosense/types/rest */
export type { SearchResult } from "@cosense/types/rest";

/** Re-export ProjectSearchResult from @cosense/types/rest */
export type { ProjectSearchResult } from "@cosense/types/rest";

/** Re-export Page from @cosense/types/rest */
export type { Page } from "@cosense/types/rest";



/** Re-export SearchedTitle from @cosense/types/rest */
export type { SearchedTitle } from "@cosense/types/rest";

/** Project identifier type
 * 
 * String that uniquely identifies a Scrapbox project.
 * Used throughout the API for project-related operations.
 * 
 * @public
 */
export type ProjectId = string;

/** Re-export ProjectResponse from @cosense/types/rest */
export type { ProjectResponse } from "@cosense/types/rest";

/** Re-export MemberProject from @cosense/types/rest */
export type { MemberProject } from "@cosense/types/rest";

/** Re-export NotMemberProject from @cosense/types/rest */
export type { NotMemberProject } from "@cosense/types/rest";

/** Re-export MemberUser from @cosense/types/rest */
export type { MemberUser } from "@cosense/types/rest";

/** Re-export GuestUser from @cosense/types/rest */
export type { GuestUser } from "@cosense/types/rest";

/** Data structure for exported pages
 * 
 * Contains page content and metadata exported from a project.
 * Used for exporting pages with optional metadata inclusion.
 * 
 * @template T - Whether to include metadata (true/false)
 * @public
 */
export interface ExportedData<T extends boolean = true> {
  /** Project name */
  name: string;
  /** Array of exported pages */
  pages: Array<{
    /** Page title */
    title: string;
    /** Page content lines */
    lines: string[];
    /** Page metadata if T is true */
    metadata?: T extends true ? {
      id: string;
      created: number;
      updated: number;
      accessed: number;
      pin?: number;
      views?: number;
      linked?: number;
      author?: {
        id: string;
        name: string;
        displayName: string;
      };
    } : never;
  }>;
}

/** Data structure for importing pages
 * 
 * Contains page content to be imported into a project.
 * Used for importing pages with optional metadata inclusion.
 * 
 * @template T - Whether to include metadata (true/false)
 * @public
 */
export interface ImportedData<T extends boolean = false> {
  /** Project name */
  name: string;
  /** Array of pages to import */
  pages: Array<{
    /** Page title */
    title: string;
    /** Page content lines */
    lines: string[];
    /** Page metadata if T is true */
    metadata?: T extends true ? {
      id: string;
      created: number;
      updated: number;
      accessed: number;
      pin?: number;
      views?: number;
      linked?: number;
      author?: {
        id: string;
        name: string;
        displayName: string;
      };
    } : never;
  }>;
}

/** Information about a tweet
 * 
 * Contains metadata and content from a Twitter/X post,
 * including text, author details, and timestamps.
 * 
 * @public
 */
export interface TweetInfo {
  /** Tweet text content */
  description: string;
  /** Tweet author's display name */
  title: string;
  /** Tweet author's profile image URL */
  image: string;
  /** Tweet author's username */
  author: string;
  /** Tweet creation timestamp */
  timestamp: string;
}

/** List of page snapshots
 * 
 * Contains metadata about page snapshots including their timestamps,
 * creation dates, and user information.
 * 
 * @public
 */
export interface PageSnapshotList {
  /** Array of snapshot metadata */
  snapshots: Array<{
    /** Snapshot timestamp ID */
    id: string;
    /** Creation timestamp */
    created: number;
    /** User who created the snapshot */
    user: {
      id: string;
      name: string;
      displayName: string;
    };
  }>;
}

/** Result from retrieving a page snapshot
 * 
 * Contains the content and metadata of a specific page snapshot,
 * including page title, lines, and snapshot details.
 * 
 * @public
 */
export interface PageSnapshotResult {
  /** Page title */
  title: string;
  /** Page content lines */
  lines: string[];
  /** Snapshot metadata */
  snapshot: {
    /** Snapshot timestamp ID */
    id: string;
    /** Creation timestamp */
    created: number;
    /** User who created the snapshot */
    user: {
      id: string;
      name: string;
      displayName: string;
    };
  };
}

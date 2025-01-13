import { cookie } from "./auth.ts";
import { parseHTTPError } from "./parseHTTPError.ts";
import { encodeTitleURI } from "../title.ts";
import { type BaseOptions, setDefaults } from "./options.ts";
import {
  andThenAsyncForResult,
  mapAsyncForResult,
  mapErrAsyncForResult,
  type Result,
} from "option-t/plain_result";
import { unwrapOrForMaybe } from "option-t/maybe";
import { type HTTPError, responseIntoResult } from "./responseIntoResult.ts";
import type {
  ErrorLike,
  NotFoundError,
  NotLoggedInError,
  NotMemberError,
  FetchError,
} from "./errors.ts";
import type { Page, PageList } from "./types.ts";

/** Options for retrieving a single page */
export interface GetPageOption extends BaseOptions {
  /** Whether to follow page renames
   * @default {true}
   */
  followRename?: boolean;

  /** Project IDs to include when fetching external links
   * @example ["project1", "project2"]
   */
  projects?: string[];
}

/** Error thrown when the generated URI exceeds length limits
 * 
 * This error occurs when constructing API requests where the URL
 * becomes too long, typically due to many parameters or long values.
 * 
 * @property name - Always "TooLongURIError" to identify this error type
 */
export interface TooLongURIError extends ErrorLike {
  /** Identifier for this error type */
  name: "TooLongURIError";
}

const getPage_toRequest: GetPage["toRequest"] = (
  project,
  title,
  options,
) => {
  const { sid, hostName, followRename, projects } = setDefaults(options ?? {});

  const params = new URLSearchParams([
    ["followRename", `${followRename ?? true}`],
    ...(projects?.map?.((id) => ["projects", id]) ?? []),
  ]);

  return new Request(
    `https://${hostName}/api/pages/${project}/${
      encodeTitleURI(title)
    }?${params}`,
    sid ? { headers: { Cookie: cookie(sid) } } : undefined,
  );
};

const getPage_fromResponse: GetPage["fromResponse"] = async (res) =>
  mapErrAsyncForResult(
    await mapAsyncForResult(
      responseIntoResult(res),
      (res) => res.json() as Promise<Page>,
    ),
    async (
      error,
    ) => {
      if (error.response.status === 414) {
        return {
          name: "TooLongURIError",
          message: "project ids may be too much.",
        };
      }

      return unwrapOrForMaybe<PageError>(
        await parseHTTPError(error, [
          "NotFoundError",
          "NotLoggedInError",
          "NotMemberError",
        ]),
        error,
      );
    },
  );

/** Interface for page retrieval operations */
export interface GetPage {
  /** Constructs a request for the `/api/pages/:project/:title` endpoint
   *
   * @param project The project name containing the desired page
   * @param title The page title to retrieve (case insensitive)
   * @param options - Additional configuration options
   * @returns A {@linkcode Request} object for fetching page data
   */
  toRequest: (
    project: string,
    title: string,
    options?: GetPageOption,
  ) => Request;

  /** Extracts page JSON data from the API response
   *
   * @param res - The response from the API
   * @returns A {@linkcode Result}<{@linkcode unknown}, {@linkcode Error}> containing:
   *          - Success: The page data in JSON format
   *          - Error: One of several possible errors:
   *            - {@linkcode NotFoundError}: Page not found
   *            - {@linkcode NotLoggedInError}: Authentication required
   *            - {@linkcode NotMemberError}: User lacks access
   *            - {@linkcode HTTPError}: Other HTTP errors
   */
  fromResponse: (res: Response) => Promise<Result<Page, PageError>>;

  (
    project: string,
    title: string,
    options?: GetPageOption,
  ): Promise<Result<Page, PageError | FetchError>>;
}

/** Possible errors that can occur when fetching page data
 * 
 * Union type of all possible error types that can be returned when
 * attempting to fetch a single page's data.
 * 
 * @see {@link NotFoundError} Page not found
 * @see {@link NotLoggedInError} Authentication required
 * @see {@link NotMemberError} User lacks access
 * @see {@link TooLongURIError} URI too long
 * @see {@link HTTPError} Other HTTP errors
 */
export type PageError =
  | NotFoundError
  | NotLoggedInError
  | NotMemberError
  | TooLongURIError
  | HTTPError;

/** Retrieves JSON data for a specified page
 *
 * Fetches page content and metadata from the Scrapbox API.
 * Handles various error conditions and authentication requirements.
 *
 * @param project - The project name containing the desired page
 * @param title - The page title to retrieve (case insensitive)
 * @param options - Additional configuration options for the request
 * @returns A {@linkcode Result}<{@linkcode Page}, {@linkcode PageError | FetchError}> containing:
 *          - Success: The page data
 *          - Error: One of several possible errors:
 *            - {@linkcode NotFoundError}: Page not found
 *            - {@linkcode NotLoggedInError}: Authentication required
 *            - {@linkcode NotMemberError}: User lacks access
 *            - {@linkcode TooLongURIError}: URI too long
 *            - {@linkcode HTTPError}: Other HTTP errors
 *            - {@linkcode FetchError}: Network or abort errors
 */
export const getPage: GetPage = /* @__PURE__ */ (() => {
  const fn: GetPage = async (
    project,
    title,
    options,
  ) =>
    andThenAsyncForResult<Response, Page, PageError | FetchError>(
      await setDefaults(options ?? {}).fetch(
        getPage_toRequest(project, title, options),
      ),
      (input) => getPage_fromResponse(input),
    );

  fn.toRequest = getPage_toRequest;
  fn.fromResponse = getPage_fromResponse;

  return fn;
})();

/** Options for listing pages in a project */
export interface ListPagesOption extends BaseOptions {
  /** How to sort the returned page list
   * 
   * Available sort options:
   * - `updatedWithMe`: Sort by pages updated by the current user
   * - `updated`: Sort by last update time
   * - `created`: Sort by creation time
   * - `accessed`: Sort by last access time
   * - `pageRank`: Sort by page rank
   * - `linked`: Sort by number of incoming links
   * - `views`: Sort by view count
   * - `title`: Sort alphabetically by title
   * 
   * @default {"updated"}
   */
  sort?: "updatedWithMe" | "updated" | "created" | "accessed" | "pageRank" | "linked" | "views" | "title";

  /** Number of pages to skip (for pagination)
   * @default {0}
   */
  skip?: number;

  /** Maximum number of pages to return
   * @default {100}
   */
  limit?: number;
}

/** Interface for listing multiple pages in a project
 * 
 * Provides methods to fetch and parse page listings from the Scrapbox API,
 * with support for pagination and error handling.
 */
export interface ListPages {
  /** Constructs a request for the `/api/pages/:project` endpoint
   *
   * @param project The project name to list pages from
   * @param options - Additional configuration options (sorting, pagination, etc.)
   * @returns A {@linkcode Request} object for fetching pages data
   */
  toRequest: (
    project: string,
    options?: ListPagesOption,
  ) => Request;

  /** Extracts page list JSON data from the API response
   *
   * @param res - The response from the API
   * @returns A {@linkcode Result}<{@linkcode Page[]}, {@linkcode ListPagesError}> containing:
   *          - Success: Array of page data in JSON format
   *          - Error: One of several possible errors:
   *            - {@linkcode NotLoggedInError}: Authentication required
   *            - {@linkcode NotMemberError}: User lacks access
   *            - {@linkcode HTTPError}: Other HTTP errors
   */
  fromResponse: (res: Response) => Promise<Result<PageList, ListPagesError>>;

  /** List pages in a project
   * 
   * @param project - The project name to list pages from
   * @param options - Additional configuration options
   * @returns A Result containing either the page list or an error
   */
  (
    project: string,
    options?: ListPagesOption,
  ): Promise<Result<PageList, ListPagesError | FetchError>>;
}

/** Possible errors that can occur when listing pages */
export type ListPagesError =
  | NotFoundError
  | NotLoggedInError
  | NotMemberError
  | HTTPError;

const listPages_toRequest: ListPages["toRequest"] = (project, options) => {
  const { sid, hostName, sort, limit, skip } = setDefaults(
    options ?? {},
  );
  const params = new URLSearchParams();
  if (sort !== undefined) params.append("sort", sort);
  if (limit !== undefined) params.append("limit", `${limit}`);
  if (skip !== undefined) params.append("skip", `${skip}`);

  return new Request(
    `https://${hostName}/api/pages/${project}?${params}`,
    sid ? { headers: { Cookie: cookie(sid) } } : undefined,
  );
};

const listPages_fromResponse: ListPages["fromResponse"] = async (res) =>
  mapErrAsyncForResult(
    await mapAsyncForResult(
      responseIntoResult(res),
      (res) => res.json() as Promise<PageList>,
    ),
    async (error) =>
      unwrapOrForMaybe<ListPagesError>(
        await parseHTTPError(error, [
          "NotFoundError",
          "NotLoggedInError",
          "NotMemberError",
        ]),
        error,
      ),
  );

/** Lists pages from a specified project
 *
 * Retrieves a paginated list of pages from a Scrapbox project.
 * Supports sorting by various criteria and pagination options.
 *
 * @param project - The project name to list pages from
 * @param options - Configuration options for pagination and sorting
 * @returns A {@linkcode Result}<{@linkcode PageList}, {@linkcode ListPagesError | FetchError}> containing:
 *          - Success: The list of pages with metadata
 *          - Error: One of several possible errors:
 *            - {@linkcode NotLoggedInError}: Authentication required
 *            - {@linkcode NotMemberError}: User lacks access
 *            - {@linkcode HTTPError}: Other HTTP errors
 *            - {@linkcode FetchError}: Network or abort errors
 */
export const listPages: ListPages = /* @__PURE__ */ (() => {
  const fn: ListPages = async (
    project,
    options?,
  ) =>
    andThenAsyncForResult<Response, PageList, ListPagesError | FetchError>(
      await setDefaults(options ?? {})?.fetch(
        listPages_toRequest(project, options),
      ),
      listPages_fromResponse,
    );

  fn.toRequest = listPages_toRequest;
  fn.fromResponse = listPages_fromResponse;

  return fn;
})();

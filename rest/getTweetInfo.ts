import {
  isErr,
  mapAsyncForResult,
  mapErrAsyncForResult,
  type Result,
  unwrapOk,
} from "option-t/plain_result";
import type {
  BadRequestError,
  InvalidURLError,
  SessionError,
} from "./errors.ts";
import type { TweetInfo } from "./types.ts";
import { cookie, getCSRFToken } from "./auth.ts";
import { parseHTTPError } from "./parseHTTPError.ts";
import { type HTTPError, responseIntoResult } from "./responseIntoResult.ts";
import { type ExtendedOptions, setDefaults } from "./options.ts";
import type { FetchError } from "./mod.ts";

/** Possible errors when retrieving tweet information
 * 
 * Can occur when:
 * - Session is invalid or expired ({@linkcode SessionError})
 * - Tweet URL is malformed or invalid ({@linkcode InvalidURLError})
 * - Request parameters are invalid ({@linkcode BadRequestError})
 * - HTTP request fails ({@linkcode HTTPError})
 * 
 * @public
 */
export type TweetInfoError =
  | SessionError
  | InvalidURLError
  | BadRequestError
  | HTTPError;

/** Retrieve information about a specified Tweet
 *
 * Fetches metadata and content information for a given Tweet URL through Scrapbox's
 * Twitter embed API. This function handles authentication and CSRF token management
 * automatically.
 *
 * @param url - The URL of the Tweet to fetch information for. Can be either a {@linkcode string}
 *           or {@linkcode URL} object. Should be a valid Twitter/X post URL.
 * @param init - Optional {@linkcode RequestInit} configuration for customizing request behavior and authentication
 * @returns A {@linkcode Result}<{@linkcode TweetInfo}, {@linkcode Error}> containing:
 *          - Success: {@linkcode TweetInfo} object with Tweet metadata
 *          - Error: One of several possible errors:
 *            - {@linkcode SessionError}: Authentication issues
 *            - {@linkcode InvalidURLError}: Malformed or invalid Tweet URL
 *            - {@linkcode BadRequestError}: API request issues
 *            - {@linkcode HTTPError}: Network or server errors
 *
 * @example
 * ```typescript
 * import { isErr, unwrapErr, unwrapOk } from "option-t/plain_result";
 *
 * const result = await getTweetInfo("https://twitter.com/user/status/123456789");
 * if (isErr(result)) {
 *   throw new Error(`Failed to get Tweet info: ${unwrapErr(result)}`);
 * }
 * const tweetInfo = unwrapOk(result);
 * console.log("Tweet text:", tweetInfo.description);
 * ```
 *
 * > [!NOTE]
 * > The function includes a 3000ms timeout for the API request.
 */
export const getTweetInfo = async (
  url: string | URL,
  init?: ExtendedOptions,
): Promise<Result<TweetInfo, TweetInfoError | FetchError>> => {
  const { sid, hostName, fetch } = setDefaults(init ?? {});

  const csrfResult = await getCSRFToken(init);
  if (isErr(csrfResult)) return csrfResult;

  const req = new Request(
    `https://${hostName}/api/embed-text/twitter?url=${
      encodeURIComponent(`${url}`)
    }`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "X-CSRF-TOKEN": unwrapOk(csrfResult),
        ...(sid ? { Cookie: cookie(sid) } : {}),
      },
      body: JSON.stringify({ timeout: 3000 }),
    },
  );

  const res = await fetch(req);
  if (isErr(res)) return res;

  return mapErrAsyncForResult(
    await mapAsyncForResult(
      responseIntoResult(unwrapOk(res)),
      (res) => res.json() as Promise<TweetInfo>,
    ),
    async (res) => {
      if (res.response.status === 422) {
        return {
          name: "InvalidURLError",
          message: (await res.response.json()).message as string,
        };
      }
      const parsed = await parseHTTPError(res, [
        "SessionError",
        "BadRequestError",
      ]);
      return parsed ?? res;
    },
  );
};

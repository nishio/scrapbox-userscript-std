import type {
  NotFoundError,
  NotLoggedInError,
  NotMemberError,
} from "@cosense/types/rest";
import { cookie } from "./auth.ts";
import { encodeTitleURI } from "../title.ts";
import { type BaseOptions, setDefaults } from "./options.ts";
import {
  isErr,
  mapAsyncForResult,
  mapErrAsyncForResult,
  type Result,
  unwrapOk,
} from "option-t/plain_result";
import { type HTTPError, responseIntoResult } from "./responseIntoResult.ts";
import { parseHTTPError } from "./parseHTTPError.ts";
import type { FetchError } from "./mod.ts";

const getCodeBlock_toRequest: GetCodeBlock["toRequest"] = (
  project,
  title,
  filename,
  options,
) => {
  const { sid, hostName } = setDefaults(options ?? {});

  return new Request(
    `https://${hostName}/api/code/${project}/${encodeTitleURI(title)}/${
      encodeTitleURI(filename)
    }`,
    sid ? { headers: { Cookie: cookie(sid) } } : undefined,
  );
};

const getCodeBlock_fromResponse: GetCodeBlock["fromResponse"] = async (res) =>
  mapAsyncForResult(
    await mapErrAsyncForResult(
      responseIntoResult(res),
      async (res) =>
        res.response.status === 404 &&
          res.response.headers.get("Content-Type")?.includes?.("text/plain")
          ? { name: "NotFoundError", message: "Code block is not found" }
          : (await parseHTTPError(res, [
            "NotLoggedInError",
            "NotMemberError",
          ])) ?? res,
    ),
    (res) => res.text(),
  );

/** Interface for retrieving code blocks from Scrapbox pages
 * 
 * Provides methods to fetch code block content from pages.
 * 
 * @public
 */
export interface GetCodeBlock {
  /** Build a request for `/api/code/:project/:title/:filename`
   *
   * @param project - Name of the project containing the target page
   * @param title - Title of the target page (case-insensitive)
   * @param filename - Name of the code block file to retrieve
   * @param options - Configuration options
   * @returns A {@linkcode Request} object for fetching code block content
   */
  toRequest: (
    project: string,
    title: string,
    filename: string,
    options?: BaseOptions,
  ) => Request;

  /** Extract code from the response
   *
   * @param res - Response from the API
   * @returns A {@linkcode Result}<{@linkcode string}, {@linkcode Error}> containing:
   *          - Success: The code block content as a string
   *          - Error: One of several possible errors:
   *            - {@linkcode NotFoundError}: Code block not found
   *            - {@linkcode NotLoggedInError}: Authentication required
   *            - {@linkcode NotMemberError}: User lacks access
   *            - {@linkcode HTTPError}: Other HTTP errors
   */
  fromResponse: (res: Response) => Promise<Result<string, CodeBlockError>>;

  (
    project: string,
    title: string,
    filename: string,
    options?: BaseOptions,
  ): Promise<Result<string, CodeBlockError | FetchError>>;
}
/** Possible errors when retrieving code blocks
 * 
 * Can occur when:
 * - Code block not found
 * - User not logged in
 * - User lacks access
 * - HTTP request fails
 * 
 * @public
 */
export type CodeBlockError =
  | NotFoundError
  | NotLoggedInError
  | NotMemberError
  | HTTPError;

/** Retrieve text content from a specified code block
 *
 * @param project Name of the project containing the target page
 * @param title Title of the target page (case-insensitive)
 * @param filename Name of the code block file to retrieve
 * @param options Configuration options
 */
export const getCodeBlock: GetCodeBlock = /* @__PURE__ */ (() => {
  const fn: GetCodeBlock = async (
    project,
    title,
    filename,
    options,
  ) => {
    const req = getCodeBlock_toRequest(project, title, filename, options);
    const res = await setDefaults(options ?? {}).fetch(req);
    return isErr(res) ? res : getCodeBlock_fromResponse(unwrapOk(res));
  };

  fn.toRequest = getCodeBlock_toRequest;
  fn.fromResponse = getCodeBlock_fromResponse;

  return fn;
})();

import { push, type PushError, type PushOptions } from "./push.ts";
import type { Result } from "option-t/plain_result";

/** Configuration options for deleting a page
 * 
 * Extends {@linkcode PushOptions} to provide configuration for the delete operation.
 * Controls how the delete request is sent and handled.
 * 
 * @public
 */
export type DeletePageOptions = PushOptions;

/** Delete a specified page whose title is `title` from a given `project`
 *
 * @param project - The project containing the page to delete
 * @param title - The title of the page to delete
 * @param options - Additional options for the delete operation
 * @returns A {@linkcode Promise} that resolves to a {@linkcode Result} containing:
 *          - Success: The page title that was deleted as a {@linkcode string}
 *          - Error: A {@linkcode PushError} describing what went wrong
 */
export const deletePage = (
  project: string,
  title: string,
  options?: DeletePageOptions,
): Promise<Result<string, PushError>> =>
  push(
    project,
    title,
    (page) => page.persistent ? [{ deleted: true }] : [],
    options,
  );

import type { JsonValue } from "@std/json";

/** Error thrown when a WebSocket request is malformed or unexpected
 * 
 * This error occurs when the server returns an unexpected error
 * that can be serialized as JSON. The error can happen when:
 * - The server receives an invalid request format
 * - The server response doesn't match the expected schema
 * - The client sends an invalid request
 */
export interface UnexpectedRequestError {
  /** Type identifier for unexpected request errors */
  name: "UnexpectedRequestError";
  /** The serialized error value from the server */
  error: JsonValue;
}

/** Error thrown when a request times out
 * 
 * This error occurs when a request takes longer than
 * the specified timeout duration.
 */
export interface TimeoutError {
  /** Type identifier for timeout errors */
  name: "TimeoutError";
  /** Detailed error message */
  message: string;
}

/** Union type of all possible page commit errors
 * 
 * Combines all error types that can occur during page commit operations:
 * - {@linkcode SocketIOError} - Socket.IO communication errors
 * - {@linkcode DuplicateTitleError} - Title already exists
 * - {@linkcode NotFastForwardError} - Commit ID is outdated
 */
export type PageCommitError =
  | SocketIOError
  | DuplicateTitleError
  | NotFastForwardError;

/** Error thrown when Socket.IO encounters an error
 *
 * This error occurs when there are Socket.IO-related issues.
 * When this error occurs, the request should be retried after a delay.
 */
export interface SocketIOError {
  /** Type identifier for Socket.IO errors */
  name: "SocketIOError";
}

/** Error thrown when Socket.IO server disconnects unexpectedly
 * 
 * This error occurs when:
 * - The Socket.IO server sends a "io server disconnect" event
 * - The WebSocket connection is terminated by the server before completion
 * - The connection to the server is lost unexpectedly
 */
export interface SocketIOServerDisconnectError {
  /** Type identifier for Socket.IO server disconnect errors */
  name: "SocketIOServerDisconnectError";
}

/** Error thrown when a page title is already in use
 * 
 * This error occurs when attempting to create or rename a page
 * with a title that already exists.
 */
export interface DuplicateTitleError {
  /** Type identifier for duplicate title errors */
  name: "DuplicateTitleError";
}

/** Error thrown when commit ID is not the latest
 * 
 * This error occurs when trying to commit changes using
 * an outdated commit ID, indicating that the page has been
 * modified by another user since the last fetch.
 */
export interface NotFastForwardError {
  /** Type identifier for not-fast-forward errors */
  name: "NotFastForwardError";
}

/** Type guard to check if an error is a page commit error
 * 
 * @param error - Error object to check
 * @returns True if the error is a {@linkcode PageCommitError}
 */
export const isPageCommitError = (
  error: { name: string },
): error is PageCommitError => pageCommitErrorNames.includes(error.name);

/** List of error names that constitute a page commit error
 * @internal
 */
const pageCommitErrorNames = [
  "SocketIOError",
  "DuplicateTitleError",
  "NotFastForwardError",
];

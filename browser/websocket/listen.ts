import type {
  NotFoundError,
  NotLoggedInError,
  NotMemberError,
  AbortError,
  NetworkError,
} from "../../rest/errors.ts";

/** Re-export error types from rest/errors.ts */
export type {
  NotFoundError,
  NotLoggedInError,
  NotMemberError,
  AbortError,
  NetworkError,
} from "../../rest/errors.ts";
import type { HTTPError } from "../../rest/responseIntoResult.ts";
import type { ScrapboxSocket } from "./socket.ts";
import type { ListenEvents } from "./listen-events.ts";

export type {
  ProjectUpdatesStreamCommit,
  ProjectUpdatesStreamEvent,
} from "./listen-events.ts";

/** Configuration options for WebSocket event listeners
 * 
 * @property signal - Optional AbortSignal to control the listener's lifecycle
 * @property once - If true, the listener will be removed after the first event
 * 
 * @example
 * ```typescript
 * const controller = new AbortController();
 * listen(socket, "commit", handler, {
 *   signal: controller.signal,
 *   once: true
 * });
 * ```
 */
export interface ListenStreamOptions {
  /** Signal for aborting the listener */
  signal?: AbortSignal;
  /** Whether to listen only once and then stop */
  once?: boolean;
}

/** Possible errors that can occur during WebSocket stream operations
 * 
 * This type encompasses all possible error types that may occur when:
 * - Connecting to the WebSocket server
 * - Authenticating with Scrapbox
 * - Accessing project resources
 * - Network-related issues
 * 
 * @see {@linkcode NotFoundError} - When the requested resource doesn't exist
 * @see {@linkcode NotLoggedInError} - When user authentication is required
 * @see {@linkcode NotMemberError} - When user lacks project access
 * @see {@linkcode NetworkError} - For connection/network issues
 * @see {@linkcode AbortError} - When the operation is cancelled
 * @see {@linkcode HTTPError} - For other HTTP-related errors
 */
/** Union type of all possible stream listening errors
 * 
 * Combines network and abort errors that can occur during
 * WebSocket stream operations.
 * 
 * @public
 */
export type ListenStreamError =
  | NotFoundError
  | NotLoggedInError
  | NotMemberError
  | NetworkError
  | AbortError
  | HTTPError;

/** Subscribe to WebSocket events from Scrapbox
 *
 * This function sets up event listeners for Scrapbox's WebSocket events:
 * - Uses socket.on() for continuous listening
 * - Uses socket.once() for one-time events when options.once is true
 * - Supports automatic cleanup with AbortSignal
 *
 * @param socket - ScrapboxSocket instance for WebSocket communication
 * @param event - Event name to listen for (from {@linkcode ListenEvents} type)
 * @param listener - Callback function to handle the event
 * @param options - Optional configuration
 *
 * @example
 * ```typescript
 * import { connect } from "@cosense/std/browser/websocket";
 * import { unwrapOk } from "option-t/plain_result";
 *
 * // Setup socket and controller
 * const socket = unwrapOk(await connect());
 *
 * // Listen for pages' changes in a specified project
 * listen(socket, "projectUpdatesStream:commit", (data) => {
 *   console.log("Project updated:", data);
 * });
 * ```
 */
export const listen = <EventName extends keyof ListenEvents>(
  socket: ScrapboxSocket,
  event: EventName,
  listener: ListenEvents[EventName],
  options?: ListenStreamOptions,
): void => {
  if (options?.signal?.aborted) return;

  // deno-lint-ignore no-explicit-any
  (options?.once ? socket.once : socket.on)(event, listener as any);

  options?.signal?.addEventListener?.(
    "abort",
    // deno-lint-ignore no-explicit-any
    () => socket.off(event, listener as any),
    { once: true },
  );
};

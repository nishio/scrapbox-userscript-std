/** Base interface for all error types in the library
 * 
 * Provides a common structure for error objects with a name and message.
 * This interface is extended by specific error types throughout the codebase.
 * 
 * @public
 */
export interface ErrorLike {
  /** Unique identifier for the error type */
  name: string;
  /** Human-readable error description */
  message: string;
}

/** Network error that occurred during fetch
 * 
 * Represents a network connectivity or DNS resolution failure.
 * 
 * @public
 */
export interface NetworkError extends ErrorLike {
  /** Error type identifier */
  name: "NetworkError";
  /** Error message */
  message: string;
  /** The request that failed */
  request: Request;
}

/** Abort error that occurred during fetch
 * 
 * Represents a request that was aborted before completion.
 * 
 * @public
 */
/** Error thrown when a request is aborted
 * 
 * This error occurs when a request is cancelled before completion,
 * typically due to a timeout or user intervention.
 * 
 * @public
 */
/** Error thrown when a request is aborted
 * 
 * This error occurs when a request is cancelled before completion,
 * typically due to a timeout or user intervention.
 * 
 * @public
 */
/** Error indicating that an operation was aborted
 * 
 * This error occurs when a request or operation is manually cancelled
 * or times out.
 * 
 * @public
 */
/** Error that occurs when a request is aborted
 * @public
 */
export interface AbortError extends ErrorLike {
  /** Error type identifier */
  name: "AbortError";
  /** Error message */
  message: string;
  /** The request that was aborted */
  request: Request;
}

/** Combined type for all possible fetch errors
 * 
 * Union type of all error types that can occur during fetch operations.
 * Combines NetworkError and AbortError into a single type.
 * 
 * @public
 */
export type FetchError = NetworkError | AbortError;

/** Re-export NotFoundError from @cosense/types/rest */
export type { NotFoundError } from "@cosense/types/rest";

/** Re-export NotLoggedInError from @cosense/types/rest */
export type { NotLoggedInError } from "@cosense/types/rest";

/** Re-export NotMemberError from @cosense/types/rest */
export type { NotMemberError } from "@cosense/types/rest";

/** Re-export NotPrivilegeError from @cosense/types/rest */
export type { NotPrivilegeError } from "@cosense/types/rest";

/** Re-export NoQueryError from @cosense/types/rest */
export type { NoQueryError } from "@cosense/types/rest";

/** Re-export SessionError from @cosense/types/rest */
export type { SessionError } from "@cosense/types/rest";

/** Re-export InvalidURLError from @cosense/types/rest */
export type { InvalidURLError } from "@cosense/types/rest";

/** Re-export BadRequestError from @cosense/types/rest */
export type { BadRequestError } from "@cosense/types/rest";

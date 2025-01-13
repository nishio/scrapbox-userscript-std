import type { MoveCursorData, PageCommit } from "./emit-events.ts";
import type {
  DeleteChange,
  DeletePageChange,
  DescriptionsChange,
  IconsChange,
  ImageChange,
  InsertChange,
  LinksChange,
  TitleChange,
  UpdateChange,
} from "./change.ts";

/** WebSocket event handlers for real-time Scrapbox page updates and collaboration
 * 
 * This interface defines all the event handlers that can be registered to listen
 * for various real-time events like page updates, cursor movements, and search operations.
 */
/** WebSocket event handlers for real-time Scrapbox page updates and collaboration
 * 
 * This interface defines all the event handlers that can be registered to listen
 * for various real-time events like page updates, cursor movements, and search operations.
 * 
 * @public
 */
export interface ListenEvents {
  /** Handler for project update stream commit events
   * 
   * Called when a commit is made to the project's update stream.
   * @param event - The commit event containing page changes
   */
  "projectUpdatesStream:commit": (event: ProjectUpdatesStreamCommit) => void;

  /** Handler for project update stream events
   * 
   * Called when project-level events occur (e.g., page deletions, member changes).
   * @param event - The event containing project-level changes
   */
  "projectUpdatesStream:event": (event: ProjectUpdatesStreamEvent) => void;

  /** Handler for commit notifications
   * 
   * Called when a commit is made to a page.
   * @param event - The commit notification containing page changes
   */
  commit: (event: CommitNotification) => void;

  /** Handler for cursor movement events
   * 
   * Called when a user moves their cursor in a page.
   * @param event - The cursor movement data
   */
  cursor: (event: MoveCursorData) => void;

  /** Handler for quick search commit events
   * 
   * Called when changes are made during quick search operations.
   * @param event - The quick search commit containing changes
   */
  "quick-search:commit": (event: QuickSearchCommit) => void;

  /** Handler for quick search link replacement events
   * 
   * Called when a link is replaced during quick search.
   */
  "quick-search:replace-link": QuickSearchReplaceLink;

  /** Flag indicating whether the infobox is currently updating
   * 
   * True when the infobox is being updated, false otherwise.
   */
  "infobox:updating": boolean;

  /** Event fired when the infobox needs to be reloaded
   * 
   * Called when the infobox content should be refreshed.
   */
  "infobox:reload": void;

  /** Event fired when the literal database needs to be reloaded
   * 
   * Called when the literal database content should be refreshed.
   */
  "literal-database:reload": void;
}

/** Represents a commit event in the project updates stream
 * 
 * This event is emitted when changes are made to a page in the project.
 * It contains details about what changed and who made the changes.
 * 
 * @property kind - Always "page" for page-related commits
 * @property id - Unique identifier for this commit
 * @property parentId - ID of the parent commit
 * @property projectId - ID of the project containing the page
 * @property pageId - ID of the page that was modified
 * @property userId - ID of the user who made the changes
 * @property changes - Array of changes made in this commit
 * @property cursor - Always null for stream commits
 * @property freeze - Always true, indicating the commit is immutable
 */
/** Represents a commit event in the project updates stream
 * 
 * This event is emitted when changes are made to a page in the project.
 * It contains details about what changed and who made the changes.
 */
export interface ProjectUpdatesStreamCommit {
  /** Type identifier for page-related commits */
  kind: "page";

  /** Unique identifier for this commit */
  id: string;

  /** ID of the parent commit in the commit chain */
  parentId: string;

  /** ID of the project containing the page */
  projectId: string;

  /** ID of the page that was modified */
  pageId: string;

  /** ID of the user who made the changes */
  userId: string;

  /** Array of changes made in this commit
   * 
   * Can be either:
   * - An array of various change types (insert, update, delete, etc.)
   * - A single-element array containing a page deletion change
   */
  changes:
    | (
      | InsertChange
      | UpdateChange
      | DeleteChange
      | TitleChange
      | LinksChange
      | IconsChange
    )[]
    | [DeletePageChange];

  /** Cursor position after the commit (always null for stream commits) */
  cursor: null;

  /** Indicates the commit is immutable (always true) */
  freeze: true;
}

/** Events that can occur in a project's update stream
 * 
 * These events represent various project-level changes like page deletions,
 * member changes, and administrative actions.
 */
export type ProjectUpdatesStreamEvent =
  | PageDeleteEvent
  | MemberJoinEvent
  | MemberAddEvent
  | AdminAddEvent
  | AdminDeleteEvent
  | OwnerSetEvent
  | InvitationResetEvent;

/** Base interface for all project-related events
 * 
 * @property id - Unique identifier for the event
 * @property pageId - ID of the page related to this event
 * @property userId - ID of the user who triggered the event
 * @property projectId - ID of the project where the event occurred
 * @property created - Timestamp when the event was created
 * @property updated - Timestamp when the event was last updated
 */
/** Base interface for all project-related events
 * 
 * Provides common properties shared by all project events like page deletions,
 * member changes, and administrative actions.
 */
export interface ProjectEvent {
  /** Unique identifier for the event */
  id: string;

  /** ID of the page related to this event */
  pageId: string;

  /** ID of the user who triggered the event */
  userId: string;

  /** ID of the project where the event occurred */
  projectId: string;

  /** Unix timestamp (in milliseconds) when the event was created */
  created: number;

  /** Unix timestamp (in milliseconds) when the event was last updated */
  updated: number;
}

/** Event emitted when a page is deleted
 * 
 * @property type - Always "page.delete"
 * @property data.titleLc - Lowercase version of the deleted page's title
 */
/** Event emitted when a page is deleted from the project
 * 
 * @extends ProjectEvent Base event interface with common properties
 */
export interface PageDeleteEvent extends ProjectEvent {
  /** Type identifier for page deletion events */
  type: "page.delete";
  /** Additional data for the page deletion event */
  data: {
    /** Lowercase version of the deleted page's title */
    titleLc: string;
  };
}
/** Event emitted when a user joins the project
 * 
 * @property type - Always "member.join"
 */
/** Event emitted when a user joins the project
 * 
 * @extends ProjectEvent Base event interface with common properties
 */
export interface MemberJoinEvent extends ProjectEvent {
  /** Type identifier for member join events */
  type: "member.join";
}
/** Event emitted when a member is added to the project
 * 
 * @property type - Always "member.add"
 */
/** Event emitted when a member is added to the project
 * 
 * @extends ProjectEvent Base event interface with common properties
 */
export interface MemberAddEvent extends ProjectEvent {
  /** Type identifier for member addition events */
  type: "member.add";
}
/** Event emitted when the project's invitation link is reset
 * 
 * @property type - Always "invitation.reset"
 */
/** Event emitted when the project's invitation link is reset
 * 
 * @extends ProjectEvent Base event interface with common properties
 */
export interface InvitationResetEvent extends ProjectEvent {
  /** Type identifier for invitation reset events */
  type: "invitation.reset";
}
/** Event emitted when a user is promoted to admin
 * 
 * @property type - Always "admin.add"
 * @property targetUserId - ID of the user being promoted to admin
 */
/** Event emitted when a user is promoted to admin
 * 
 * @extends ProjectEvent Base event interface with common properties
 */
export interface AdminAddEvent extends ProjectEvent {
  /** Type identifier for admin promotion events */
  type: "admin.add";
  /** ID of the user being promoted to admin */
  targetUserId: string;
}
/** Event emitted when a user's admin privileges are revoked
 * 
 * @property type - Always "admin.delete"
 * @property targetUserId - ID of the user whose admin privileges are being revoked
 */
/** Event emitted when a user's admin privileges are revoked
 * 
 * @extends ProjectEvent Base event interface with common properties
 */
export interface AdminDeleteEvent extends ProjectEvent {
  /** Type identifier for admin removal events */
  type: "admin.delete";
  /** ID of the user whose admin privileges are being revoked */
  targetUserId: string;
}
/** Event emitted when project ownership is transferred
 * 
 * @property type - Always "owner.set"
 * @property targetUserId - ID of the user receiving project ownership
 */
/** Event emitted when project ownership is transferred
 * 
 * @extends ProjectEvent Base event interface with common properties
 */
export interface OwnerSetEvent extends ProjectEvent {
  /** Type identifier for ownership transfer events */
  type: "owner.set";
  /** ID of the user receiving project ownership */
  targetUserId: string;
}

/** Notification of a commit being applied to a page
 * 
 * @property id - Unique identifier for this commit notification
 */
/** Notification of a commit being applied to a page
 * 
 * Extends {@linkcode PageCommit} to add a unique identifier for tracking
 * and referencing specific commit notifications.
 * 
 * @public
 */
export interface CommitNotification extends PageCommit {
  /** Unique identifier for this commit notification */
  id: string;
}

/** Commit notification for quick search operations
 * 
 * Similar to CommitNotification but with a restricted set of possible changes
 * that can occur during quick search operations.
 * 
 * @property changes - Array of changes that can occur during quick search
 */
/** Commit notification for quick search operations
 * 
 * Extends {@linkcode CommitNotification} but restricts the possible changes
 * to those that can occur during quick search operations.
 * 
 * @public
 */
export interface QuickSearchCommit extends Omit<CommitNotification, "changes"> {
  /** Array of changes made during quick search
   * 
   * Can be either:
   * - An array of title, link, description, or image changes
   * - A single page deletion change
   */
  changes:
    | (TitleChange | LinksChange | DescriptionsChange | ImageChange)[]
    | [DeletePageChange];
}

/** Represents a link replacement operation in quick search
 * 
 * @property from - Original link text to be replaced
 * @property to - New link text to replace with
 */
/** Represents a link replacement operation in quick search
 * 
 * Contains the original link text and its replacement for tracking
 * link updates during quick search operations.
 * 
 * @public
 */
export interface QuickSearchReplaceLink {
  /** Original link text to be replaced */
  from: string;
  /** New link text that will replace the original */
  to: string;
}

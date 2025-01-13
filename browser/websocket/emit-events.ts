import type { Change, DeletePageChange, PinChange } from "./change.ts";

/** Events that can be emitted to the Scrapbox WebSocket server */
export interface EmitEvents {
  /** Handler for socket.io requests for page commits and room joins */
  "socket.io-request": (
    /** Request object containing method and data for commit or room join */
    req: { method: "commit"; data: PageCommit } | {
      method: "room:join";
      data: JoinRoomRequest;
    },
    /** Response handler for success or error cases */
    callback: (
      res:
        | { data: PageCommitResponse | JoinRoomResponse }
        | { error: { name: string; message?: string } },
    ) => void,
  ) => void;

  /** Handler for cursor movement events */
  cursor: (
    /** Cursor movement data without socketId */
    req: Omit<MoveCursorData, "socketId">) => void;
}

/** Represents a commit of changes to a Scrapbox page */
export interface PageCommit {
  /** Always "page" to identify this as a page commit */
  kind: "page";
  /** ID of the parent commit this change is based on */
  parentId: string;
  /** ID of the project containing the page */
  projectId: string;
  /** ID of the page being modified */
  pageId: string;
  /** ID of the user making the changes */
  userId: string;
  /** Array of changes to apply to the page:
   * - Multiple general changes
   * - Single pin status change
   * - Single page deletion
   */
  changes: Change[] | [PinChange] | [DeletePageChange];
  /** Always null for page commits */
  cursor?: null;
  /** Always true to indicate atomic commit */
  freeze: true;
}

/** Response from the server after a successful page commit */
export interface PageCommitResponse {
  /** Unique identifier assigned to the committed changes */
  commitId: string;
}

/** Request to join a WebSocket room
 * 
 * Can be one of:
 * - Page room for real-time collaboration
 * - Project room for project-wide updates
 * - Stream room for project update notifications
 */
export type JoinRoomRequest =
  | JoinPageRoomRequest
  | JoinProjectRoomRequest
  | JoinStreamRoomRequest;

/** Request to join a project's WebSocket room */
export interface JoinProjectRoomRequest {
  /** Always null for project rooms */
  pageId: null;
  /** ID of the project to join */
  projectId: string;
  /** Always false for project rooms */
  projectUpdatesStream: false;
}

/** Request to join a page's WebSocket room */
export interface JoinPageRoomRequest {
  /** ID of the page to join */
  pageId: string;
  /** ID of the project containing the page */
  projectId: string;
  /** Always false for page rooms */
  projectUpdatesStream: false;
}

/** Request to join a project's update stream room */
export interface JoinStreamRoomRequest {
  /** Always null for stream rooms */
  pageId: null;
  /** ID of the project to stream updates from */
  projectId: string;
  /** Always true for stream rooms */
  projectUpdatesStream: true;
}

/** Response from the server after successfully joining a room */
export interface JoinRoomResponse {
  /** Always true to indicate successful join */
  success: true;
  /** ID of the joined page, or null for project/stream rooms */
  pageId: string | null;
  /** ID of the joined project */
  projectId: string;
}

/** Data representing a user's cursor position in a page */
export interface MoveCursorData {
  /** Information about the user whose cursor is being moved */
  user: {
    /** Unique identifier for the user */
    id: string;
    /** Username of the user */
    name: string;
    /** Display name shown in UI */
    displayName: string;
  };
  /** ID of the page where the cursor is located */
  pageId: string;
  /** Cursor position coordinates */
  position: {
    /** Line number (0-based) */
    line: number;
    /** Character offset in the line */
    char: number;
  };
  /** Whether the cursor should be visible */
  visible: boolean;
  /** ID of the WebSocket connection */
  socketId: string;
}

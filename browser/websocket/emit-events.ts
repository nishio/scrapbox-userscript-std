import type { Change, DeletePageChange, PinChange } from "./change.ts";

/** Events that can be emitted to the Scrapbox WebSocket server
 * 
 * @property socket.io-request - Handler for socket.io requests:
 *                              - Page commits (changes to page content)
 *                              - Room join requests (connecting to page/project rooms)
 * @property cursor - Handler for cursor movement events
 */
export interface EmitEvents {
  /** Handler for socket.io requests
   * 
   * @param req - Request object:
   *            - For commits: Contains page changes to commit
   *            - For room joins: Contains room connection details
   * @param callback - Response handler:
   *                - On success: Contains commit or room join response data
   *                - On error: Contains error details with name and optional message
   */
  "socket.io-request": (
    req: { method: "commit"; data: PageCommit } | {
      method: "room:join";
      data: JoinRoomRequest;
    },
    callback: (
      res:
        | { data: PageCommitResponse | JoinRoomResponse }
        | { error: { name: string; message?: string } },
    ) => void,
  ) => void;

  /** Handler for cursor movement events
   * 
   * @param req - Cursor movement data without socketId
   *            - Contains user info, page ID, position, and visibility
   */
  cursor: (req: Omit<MoveCursorData, "socketId">) => void;
}

/** Represents a commit of changes to a Scrapbox page
 * 
 * @property kind - Always "page" to identify this as a page commit
 * @property parentId - ID of the parent commit this change is based on
 * @property projectId - ID of the project containing the page
 * @property pageId - ID of the page being modified
 * @property userId - ID of the user making the changes
 * @property changes - Array of changes to apply:
 *                    - Multiple general changes
 *                    - Single pin status change
 *                    - Single page deletion
 * @property cursor - Always null for page commits
 * @property freeze - Always true to indicate atomic commit
 */
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

/** Response from the server after a successful page commit
 * 
 * @property commitId - Unique identifier assigned to the committed changes
 */
/** Response from the server after a successful page commit
 * 
 * @property commitId - Unique identifier assigned to the committed changes
 */
export interface PageCommitResponse {
  /** Unique identifier for this commit */
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

/** Request to join a project's WebSocket room
 * 
 * @property pageId - Always null for project rooms
 * @property projectId - ID of the project to join
 * @property projectUpdatesStream - Always false for project rooms
 */
export interface JoinProjectRoomRequest {
  /** Always null for project rooms */
  pageId: null;
  /** ID of the project to join */
  projectId: string;
  /** Always false for project rooms */
  projectUpdatesStream: false;
}

/** Request to join a page's WebSocket room
 * 
 * @property pageId - ID of the page to join
 * @property projectId - ID of the project containing the page
 * @property projectUpdatesStream - Always false for page rooms
 */
export interface JoinPageRoomRequest {
  /** ID of the page to join */
  pageId: string;
  /** ID of the project containing the page */
  projectId: string;
  /** Always false for page rooms */
  projectUpdatesStream: false;
}

/** Request to join a project's update stream room
 * 
 * @property pageId - Always null for stream rooms
 * @property projectId - ID of the project to stream updates from
 * @property projectUpdatesStream - Always true for stream rooms
 */
export interface JoinStreamRoomRequest {
  /** Always null for stream rooms */
  pageId: null;
  /** ID of the project to stream updates from */
  projectId: string;
  /** Always true for stream rooms */
  projectUpdatesStream: true;
}

/** Response from the server after successfully joining a room
 * 
 * @property success - Always true to indicate successful join
 * @property pageId - ID of the joined page, or null for project/stream rooms
 * @property projectId - ID of the joined project
 */
export interface JoinRoomResponse {
  /** Always true to indicate successful join */
  success: true;
  /** ID of the joined page, or null for project/stream rooms */
  pageId: string | null;
  /** ID of the joined project */
  projectId: string;
}

/** Data representing a user's cursor position in a page
 * 
 * @property user - Information about the user: 
 *                  - id: Unique user identifier
 *                  - name: Username
 *                  - displayName: Display name shown in UI
 * @property pageId - ID of the page where the cursor is located
 * @property position - Cursor position coordinates:
 *                     - line: Line number (0-based)
 *                     - char: Character offset in the line
 * @property visible - Whether the cursor should be visible
 * @property socketId - ID of the WebSocket connection
 */
export interface MoveCursorData {
  /** Information about the user whose cursor is being moved
   * @property id - Unique identifier for the user
   * @property name - Username of the user
   * @property displayName - Display name shown in UI
   */
  user: {
    id: string;
    name: string;
    displayName: string;
  };
  /** ID of the page where the cursor is located */
  pageId: string;
  /** Cursor position coordinates
   * @property line - Line number (0-based)
   * @property char - Character offset in the line
   */
  position: {
    line: number;
    char: number;
  };
  /** Whether the cursor should be visible */
  visible: boolean;
  /** ID of the WebSocket connection */
  socketId: string;
}

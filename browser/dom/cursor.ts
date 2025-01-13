import { takeStores } from "./stores.ts";
import type { Cursor } from "./cursor.d.ts";

/** Get the cursor instance from the global store
 * 
 * @returns The cursor instance for managing cursor position and state
 */
export const takeCursor = (): Cursor => takeStores().cursor;

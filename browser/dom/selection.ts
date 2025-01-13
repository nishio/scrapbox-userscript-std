import { takeStores } from "./stores.ts";
import type { Selection } from "./selection.d.ts";

/** Get the selection instance from the global store
 * 
 * @returns The selection instance for managing text selection state
 */
export const takeSelection = (): Selection => takeStores().selection;

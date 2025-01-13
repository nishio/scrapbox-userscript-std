/** Common types used across the browser/dom modules
 * 
 * This module contains shared type definitions that are used by multiple
 * DOM-related modules and components.
 * 
 * @module
 */

/** Options for controlling cursor position and movement behavior in the editor */
export interface SetPositionOptions {
  /** Whether to auto-scroll the page when the cursor moves outside the viewport
   * @default {true}
   */
  scrollInView?: boolean;

  /** Source of the cursor movement event
   * 
   * `"mouse"` indicates the cursor was moved by mouse interaction
   */
  source?: "mouse";
}

/** Re-export BaseLine from @cosense/types/rest */
export type { BaseLine } from "@cosense/types/rest";

/** Base store class for managing state and events
 * 
 * Provides common functionality for managing state and events
 * across editor components. Used as a foundation for various
 * store implementations like Page, Cursor, and Selection.
 * 
 * @template Event - Type of events that can be emitted by this store
 */
export declare class BaseStore<Event = string> {
  /** Add an event listener
   * @param listener - Function to call when event occurs
   */
  addEventListener(listener: (event: Event) => void): void;
  
  /** Remove an event listener
   * @param listener - Function to remove from listeners
   */
  removeEventListener(listener: (event: Event) => void): void;
  
  /** Emit an event to all listeners
   * @param event - Event to emit
   * @protected
   */
  protected emit(event: Event): void;
}

/** Re-export Position from @cosense/types/rest */
export type { Position } from "@cosense/types/rest";

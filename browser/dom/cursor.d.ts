/** @module cursor */

import { BaseStore, type BaseLine } from "./types.ts";
export type { BaseStore } from "./types.ts";
import type { Position } from "./position.ts";
import type { Page } from "./page.d.ts";

export type { SetPositionOptions } from "./types.ts";

/** Class for managing cursor operations in the Scrapbox editor
 * 
 * @see {@linkcode Position} for cursor position type details
 * @see {@linkcode Page} for page data type details
 */
export declare class Cursor extends BaseStore<
  { source: "mouse" | undefined } | "focusTextInput" | "scroll" | undefined
> {
  constructor();

  /** Flag indicating whether the cursor interaction started with a touch event */
  startedWithTouch: boolean;

  /** Reset cursor position and remove cursor focus from the editor */
  clear(): void;

  /** Get the current cursor position
   * 
   * @returns The current cursor position with line and column information
   */
  getPosition(): Position;

  /** Check if the cursor is currently visible
   * @returns `true` if the cursor is visible, `false` otherwise
   */
  getVisible(): boolean;

  /** Move the cursor to the specified position
   * @param position - The target position to move the cursor to
   * @param option - Optional settings for the cursor movement. See {@linkcode SetPositionOptions}
   */
  setPosition(
    position: Position,
    option?: SetPositionOptions,
  ): void;

  /** Show the editor's popup menu */
  showEditPopupMenu(): void;

  /** Hide the editor's popup menu */
  hidePopupMenu(): void;

  /** Focus the cursor on `#text-input` and make it visible
   *
   * This action triggers the `event: "focusTextInput"` event
   */
  focus(): void;

  /** Check if `#text-input` has focus
   *
   * Returns the same value as `this.focusTextarea`
   */
  get hasFocus(): boolean;

  /** Remove focus from `#text-input` without changing cursor visibility */
  blur(): void;

  /** Adjust cursor position to stay within valid line and column boundaries */
  fixPosition(): void;

  /** Check if the cursor is at the start of a line
   * @returns `true` if the cursor is visible and at line start, `false` otherwise
   */
  isAtLineHead(): boolean;

  /** Check if the cursor is at the end of a line
   * @returns `true` if the cursor is visible and at line end, `false` otherwise
   */
  isAtLineTail(): boolean;

  /** Make the cursor visible
   *
   * Does not change the focus state of `#text-input`
   */
  show(): void;

  /** Hide the cursor
   *
   * On touch devices, this also removes focus from `#text-input`
   */
  hide(): void;

  /** Cursor movement commands
   *
   * @param action - The movement command to execute. Available commands:
   * | Command | Description |
   * | ------ | ----------- |
   * | go-up | Move cursor up one line |
   * | go-down | Move cursor down one line |
   * | go-left | Move cursor left one character |
   * | go-right | Move cursor right one character |
   * | go-forward | Move cursor forward (similar to go-right, used in Emacs key bindings) |
   * | go-backward | Move cursor backward (similar to go-left, used in Emacs key bindings) |
   * | go-top | Jump to the beginning of the title line |
   * | go-bottom | Jump to the end of the last line |
   * | go-word-head | Move cursor to the start of the next word |
   * | go-word-tail | Move cursor to the end of the previous word |
   * | go-line-head | Jump to the start of the current line |
   * | go-line-tail | Jump to the end of the current line |
   * | go-pagedown | Move cursor down one page |
   * | go-pageup | Move cursor up one page |
   */
  goByAction(
    action:
      | "go-up"
      | "go-down"
      | "go-left"
      | "go-right"
      | "go-forward"
      | "go-backward"
      | "go-top"
      | "go-bottom"
      | "go-word-head"
      | "go-word-tail"
      | "go-line-head"
      | "go-line-tail"
      | "go-pagedown"
      | "go-pageup",
  ): void;

  /** Get all lines in the current document
   * @returns Array of document lines
   */
  get lines(): BaseLine[];

  /** Get the current page data
   * @returns The current page's metadata and content
   */
  get page(): Page;

  /** Move the cursor up one line */
  goUp(): void;
  /** Move the cursor up one page */
  goPageUp(): void;
  /** Move the cursor down one line */
  goDown(): void;
  /** Move cursor to the next page */
  goPageDown(): void;
  /** Get the start position of the next line */
  getNextLineHead(): void;
  /** Get the end position of the previous line */
  getPrevLineTail(): void;
  /** Move cursor to the previous position
   * @param init.scrollInView - Whether to scroll the view to show the cursor
   */
  goBackward(init?: { scrollInView: boolean }): void;

  /** Move cursor to the next position
   * @param init.scrollInView - Whether to scroll the view to show the cursor
   */
  goForward(init?: { scrollInView: boolean }): void;

  /** Move cursor one character to the left
   * Similar to goBackward() but without scroll options
   */
  goLeft(): void;

  /** Move cursor one character to the right
   * Similar to goForward() but without scroll options
   */
  goRight(): void;

  /** Move cursor to the beginning of the document
   * Positions cursor at the start of the title line
   */
  goTop(): void;

  /** Move cursor to the end of the document
   * Positions cursor after the last character of the last line
   */
  goBottom(): void;

  /** Move cursor to the start of the current word
   * Uses word boundaries to determine word start position
   */
  goWordHead(): void;
  /** Get the position of the next word's start
   * @returns The coordinates and line information of the next word's start
   */
  getWordHead(): Position;

  /** Move cursor to the end of the current word
   * Uses word boundaries to determine word end position
   */
  goWordTail(): void;

  /** Get the position of the previous word's end
   * @returns The coordinates and line information of the previous word's end
   */
  getWordTail(): Position;

  /** Jump to the position after indentation
   * If cursor is already after or within indentation, jump to line start
   */
  goLineHead(): void;

  /** Jump to the end of the current line
   * Positions cursor after the last character of the current line
   */
  goLineTail(): void;

  /** Synchronize cursor state
   * Queues a state update to be processed asynchronously
   */
  sync(): void;

  /** Immediately synchronize cursor state
   * Forces an immediate state update without queueing
   */
  syncNow(): void;

  /** Update the temporary horizontal cursor position
   * Used to maintain column position during vertical movement
   * @returns The updated horizontal position
   */
  updateTemporalHorizontalPoint(): number;

  /** Fired when the page is scrolled
   * Updates cursor position and visibility based on scroll state
   */
  emitScroll(): void;

  /** Current cursor position data */
  data: Position;
  /** Temporary horizontal position for vertical movement */
  temporalHorizontalPoint: number;
  /** Whether the cursor is currently visible */
  visible: boolean;
  /** Whether the popup menu is currently visible */
  visiblePopupMenu: boolean;
  /** Whether the text input area has focus */
  focusTextarea: boolean;
}

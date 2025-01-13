import { type BaseLine, BaseStore } from "./types.ts";
import type { Position } from "./position.ts";

/** Text selection range in the editor
 * 
 * Represents a range of selected text with start and end positions.
 * Used for managing text selection operations in the editor.
 */
export interface Range {
  start: Position;
  end: Position;
}

/** Selection management class for the Scrapbox editor
 * 
 * Handles text selection operations and maintains selection state.
 * Extends BaseStore for event handling capabilities.
 */
export declare class Selection extends BaseStore<undefined> {
  constructor();



  /** Get the current page content as an array of lines */
  /** Get the currently selected lines
   * 
   * @returns Array of selected lines
   */
  get lines(): BaseLine[];

  /** Get the current selection range
   *
   * @param init Set `init.normalizeOrder` to `true` to ensure Range.start is
   *            the beginning of the selection (useful for consistent text processing)
   * @returns The current {@linkcode Range} object representing the selection
   */
  /** Get the current selection range
   * 
   * @param init - Optional settings for range calculation
   * @returns The current selection range
   */
  getRange(init?: { normalizeOrder: boolean }): Range;

  /** Update the current selection range */
  setRange(range: Range): void;

  /** Clear the current selection */
  clear(): void;

  /** Normalize the selection range order to ensure start position comes before end
   *
   * @param range - The selection range to normalize
   * @returns A normalized {@linkcode Range} with start position at the beginning
   *
   * This is useful when you need consistent text processing regardless of
   * whether the user selected text from top-to-bottom or bottom-to-top.
   */
  normalizeOrder(range: Range): Range;

  /** Get the text content of the current selection */
  getSelectedText(): string;

  /** Get the visual height of the selection in pixels */
  getSelectionsHeight(): number;

  /** Get the Y-coordinate of the selection's top-right corner */
  getSelectionTop(): number;

  /** Select all content in the current page */
  selectAll(): void;

  /** Check if there is any active selection
   *
   * @param range Optional range to check. If not provided,
   *              checks this class's current selection
   */
  hasSelection(range?: Range): boolean;

  /** Check if exactly one line is selected
   *
   * @param range Optional range to check. If not provided,
   *              checks this class's current selection
   */
  hasSingleLineSelection(range?: Range): boolean;

  /** Check if multiple lines are selected (2 or more)
   *
   * @param range Optional range to check. If not provided,
   *              checks this class's current selection
   */
  hasMultiLinesSelection(range?: Range): boolean;

  /** Check if all content in the current page is selected
   *
   * This is equivalent to checking if the selection spans
   * from the beginning of the first line to the end of the last line
   */
  hasSelectionAll(): boolean;

  /** Adjust position to be within valid bounds
   * 
   * @param position - Position to validate and adjust
   */
  private fixPosition(position: Position): void;

  /** Ensure the current range is valid
   * 
   * Validates and adjusts the current selection range to be within bounds.
   */
  private fixRange(): void;

  /** Internal storage for selection range data */
  private data: Range;
}

import { goHead, goLine } from "./motion.ts";
import { press } from "./press.ts";
import { getLineCount } from "./node.ts";
import { range } from "../../range.ts";
import { textInput } from "./dom.ts";
import { isArray, isNumber, isString } from "@core/unknownutil";
import { delay } from "@std/async";

/** Undo the last edit operation multiple times
 * @param count - Number of undo operations to perform (default: 1)
 */
export const undo = (count = 1): void => {
  for (const _ of range(0, count)) {
    press("z", { ctrlKey: true });
  }
};
/** Redo previously undone edit operations
 * @param count - Number of redo operations to perform (default: 1)
 */
export const redo = (count = 1): void => {
  for (const _ of range(0, count)) {
    press("z", { shiftKey: true, ctrlKey: true });
  }
};

/** Insert an icon at the current cursor position
 * @param count - Number of icons to insert (default: 1)
 */
export const insertIcon = (count = 1): void => {
  for (const _ of range(0, count)) {
    press("i", { ctrlKey: true });
  }
};

/** Insert a timestamp at the current cursor position
 * @param index - Number of timestamps to insert (default: 1)
 */
export const insertTimestamp = (index = 1): void => {
  for (const _ of range(0, index)) {
    press("t", { altKey: true });
  }
};

/** Insert a new line with specified text at the given line number
 * @param lineNo - Line number where the new line should be inserted
 * @param text - Content to insert in the new line
 * @returns Promise that resolves when the line has been inserted
 */
export const insertLine = async (
  lineNo: number,
  text: string,
): Promise<void> => {
  await goLine(lineNo);
  goHead();
  press("Enter");
  press("ArrowUp");
  await insertText(text);
};

/** Replace a range of lines with new text
 * @param start - Starting line number of the range to replace
 * @param end - Ending line number of the range to replace
 * @param text - New text content to replace the lines with
 * @returns Promise that resolves when the lines have been replaced
 */
export const replaceLines = async (
  start: number,
  end: number,
  text: string,
): Promise<void> => {
  await goLine(start);
  goHead();
  for (const _ of range(start, end)) {
    press("ArrowDown", { shiftKey: true });
  }
  press("End", { shiftKey: true });
  await insertText(text);
};

/** Delete one or more lines from the editor
 * @param from - Starting point for deletion:
 *              - number: Line number to start deleting from
 *              - string: Line ID to delete
 *              - string[]: Array of line IDs to delete
 * @param count - Number of lines to delete when using line number (default: 1)
 * @returns Promise that resolves when the lines have been deleted
 * @throws {TypeError} If from parameter is not number, string, or string[]
 */
export const deleteLines = async (
  from: number | string | string[],
  count = 1,
): Promise<void> => {
  if (isNumber(from)) {
    if (getLineCount() === from + count) {
      await goLine(from - 1);
      press("ArrowRight", { shiftKey: true });
    } else {
      await goLine(from);
      goHead();
    }
    for (let i = 0; i < count; i++) {
      press("ArrowRight", { shiftKey: true });
      press("End", { shiftKey: true });
    }
    press("ArrowRight", { shiftKey: true });
    press("Delete");
    return;
  }
  if (isString(from) || isArray(from)) {
    const ids = Array.isArray(from) ? from : [from];
    for (const id of ids) {
      await goLine(id);
      press("Home", { shiftKey: true });
      press("Home", { shiftKey: true });
      press("Backspace");
      press("Backspace");
    }
    return;
  }
  throw new TypeError(
    `The type of value must be number | string | string[] but actual is "${typeof from}"`,
  );
};

/** Increase indentation of selected lines by the specified number of levels
 * @param count - Number of indentation levels to add (default: 1)
 */
export const indentLines = (count = 1): void => {
  for (const _ of range(0, count)) {
    press("ArrowRight", { ctrlKey: true });
  }
};
/** Decrease indentation of selected lines by the specified number of levels
 * @param count - Number of indentation levels to remove (default: 1)
 */
export const outdentLines = (count = 1): void => {
  for (const _ of range(0, count)) {
    press("ArrowLeft", { ctrlKey: true });
  }
};
/** Move selected lines up or down by the specified number of positions
 * @param count - Number of positions to move (positive for down, negative for up)
 */
export const moveLines = (count: number): void => {
  if (count > 0) {
    downLines(count);
  } else {
    upLines(-count);
  }
};
// Move selected lines to the position after the target line number
/** Move selected lines to the position before the target line number
 * @param from - Source line number to move from
 * @param to - Target line number to move before
 */
export const moveLinesBefore = (from: number, to: number): void => {
  const count = to - from;
  if (count >= 0) {
    downLines(count);
  } else {
    upLines(-count - 1);
  }
};
/** Move selected lines up by the specified number of positions
 * @param count - Number of positions to move up (default: 1)
 */
export const upLines = (count = 1): void => {
  for (const _ of range(0, count)) {
    press("ArrowUp", { ctrlKey: true });
  }
};

/** Move selected lines down by the specified number of positions
 * @param count - Number of positions to move down (default: 1)
 */
export const downLines = (count = 1): void => {
  for (const _ of range(0, count)) {
    press("ArrowDown", { ctrlKey: true });
  }
};

/** Increase indentation of selected blocks by the specified number of levels
 * @param count - Number of indentation levels to add (default: 1)
 */
export const indentBlocks = (count = 1): void => {
  for (const _ of range(0, count)) {
    press("ArrowRight", { altKey: true });
  }
};

/** Decrease indentation of selected blocks by the specified number of levels
 * @param count - Number of indentation levels to remove (default: 1)
 */
export const outdentBlocks = (count = 1): void => {
  for (const _ of range(0, count)) {
    press("ArrowLeft", { altKey: true });
  }
};

/** Move selected blocks up or down by the specified number of positions
 * @param count - Number of positions to move (positive for down, negative for up)
 */
export const moveBlocks = (count: number): void => {
  if (count > 0) {
    downBlocks(count);
  } else {
    upBlocks(-count);
  }
};

/** Move selected blocks up by the specified number of positions
 * @param count - Number of positions to move up (default: 1)
 */
export const upBlocks = (count = 1): void => {
  for (const _ of range(0, count)) {
    press("ArrowUp", { altKey: true });
  }
};

/** Move selected blocks down by the specified number of positions
 * @param count - Number of positions to move down (default: 1)
 */
export const downBlocks = (count = 1): void => {
  for (const _ of range(0, count)) {
    press("ArrowDown", { altKey: true });
  }
};

/** Insert text at the current cursor position
 * @param text - Text to insert
 * @returns Promise that resolves when the text has been inserted
 * @throws {Error} If the text input element cannot be found
 */
export const insertText = async (text: string): Promise<void> => {
  const cursor = textInput();
  if (!cursor) {
    throw Error("#text-input is not ditected.");
  }
  cursor.focus();
  cursor.value = text;

  const event = new InputEvent("input", { bubbles: true });
  cursor.dispatchEvent(event);
  await delay(1); // 1ms delay to ensure event processing completes
};

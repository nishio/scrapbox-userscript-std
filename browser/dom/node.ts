import { isArray } from "@core/unknownutil/is/array";
import { isNumber } from "@core/unknownutil/is/number";
import { isString } from "@core/unknownutil/is/string";
import { ensure } from "@core/unknownutil/ensure";
import { isUndefined } from "@core/unknownutil/is/undefined";
import { getCachedLines } from "./getCachedLines.ts";
import { takeInternalLines } from "./takeInternalLines.ts";
import type { BaseLine, Line } from "@cosense/types/userscript";
import { lines } from "./dom.ts";
import * as Text from "../../text.ts";

/** Get the line id from value
 *
 * If the line id can't be found, return `undefined`
 *
 * @param value - value the line id of which you want to get
 */
export const getLineId = <T extends HTMLElement>(
  value?: number | string | T,
): string | undefined => {
  if (isUndefined(value)) return undefined;

  // When value is a line number
  if (isNumber(value)) return getBaseLine(value)?.id;
  // When value is a line ID
  if (isString(value)) return value.startsWith("L") ? value.slice(1) : value;

  // When value is a line DOM element
  if (value.classList.contains("line")) return value.id.slice(1);
  // When value is a child element of a line
  const line = value.closest(".line");
  if (line) return line.id.slice(1);

  return undefined;
};

/** Get the line number from value
 *
 * If the line number can't be found, return `undefined`
 *
 * @param value - value the line number of which you want to get
 */
export const getLineNo = <T extends HTMLElement>(
  value?: number | string | T,
): number | undefined => {
  if (isUndefined(value)) return undefined;

  // When value is a line number
  if (isNumber(value)) return value;
  // When value is a line ID or DOM element
  const id = getLineId(value);
  return id ? takeInternalLines().findIndex((line) => line.id === id) : -1;
};

/** Get a line by its number, ID, or DOM element
 * 
 * @param value - Line reference:
 *              - number: Line number to get
 *              - string: Line ID to get
 *              - HTMLElement: DOM element within the line
 * @returns The Line object if found, undefined otherwise
 */
export const getLine = <T extends HTMLElement>(
  value?: number | string | T,
): Line | undefined => {
  if (isUndefined(value)) return undefined;

  // When value is a line number
  if (isNumber(value)) return getLines()[value];
  // When value is a line ID or DOM element
  const id = getLineId(value);
  return id ? getLines().find((line) => line.id === id) : undefined;
};

/** Get the base line data for a line reference
 * 
 * @param value - Line reference:
 *              - number: Line number to get
 *              - string: Line ID to get
 *              - HTMLElement: DOM element within the line
 * @returns The BaseLine object if found, undefined otherwise
 */
export const getBaseLine = <T extends HTMLElement>(
  value?: number | string | T,
): BaseLine | undefined => {
  if (isUndefined(value)) return undefined;

  // When value is a line number
  if (isNumber(value)) return takeInternalLines()[value];
  // When value is a line ID or DOM element
  const id = getLineId(value);
  return id ? takeInternalLines().find((line) => line.id === id) : undefined;
};

/** Get the DOM element for a line reference
 * 
 * @param value - Line reference:
 *              - number: Line number to get
 *              - string: Line ID to get
 *              - HTMLElement: DOM element within the line
 * @returns The line's DOM element if found, undefined otherwise
 */
export const getLineDOM = <T extends HTMLElement>(
  value?: number | string | T,
): HTMLDivElement | undefined => {
  if (isLineDOM(value)) return value;

  const id = getLineId(value);
  if (isUndefined(id)) return id;
  const line = document.getElementById(`L${id}`);
  if (isUndefined(line)) return undefined;
  return line as HTMLDivElement;
};
/** Check if a DOM element is a line element
 * 
 * @param dom - DOM element to check
 * @returns True if the element is a line element (div.line)
 */
export const isLineDOM = (dom: unknown): dom is HTMLDivElement =>
  dom instanceof HTMLDivElement && dom.classList.contains("line");

/** Get the total number of lines in the current page
 * 
 * @returns The number of lines
 */
export const getLineCount = (): number => takeInternalLines().length;

/** Get all lines in the current page
 * 
 * @returns Array of Line objects representing the page content
 */
export const getLines = (): readonly Line[] => {
  const lines = ensure(getCachedLines(), isArray);
  return lines as Line[];
};

/** Get the text content from a line or element
 * 
 * @param value - Reference to get text from:
 *              - number: Line number
 *              - string: Line ID
 *              - HTMLElement: DOM element (line, character, or container)
 * @returns The text content if found, undefined otherwise:
 *          - For lines: The line's text content
 *          - For characters: The character's text
 *          - For containers: All contained text concatenated
 */
export const getText = <T extends HTMLElement>(
  value?: number | string | T,
): string | undefined => {
  if (isUndefined(value)) return undefined;

  // Treat numbers and strings as line references
  if (isNumber(value) || isString(value)) return getBaseLine(value)?.text;
  if (!(value instanceof HTMLElement)) return;
  if (isLineDOM(value)) return getBaseLine(value)?.text;
  // When value is a character DOM element
  if (value.classList.contains("char-index")) {
    return value.textContent ?? undefined;
  }
  // When the element contains `div.lines` (which contains multiple div.line elements), return all text content concatenated
  if (
    value.classList.contains("line") ||
    value.getElementsByClassName("lines")?.[0]
  ) {
    return takeInternalLines().map(({ text }) => text).join("\n");
  }
  // Get all character indices contained within the element and return the corresponding text
  const chars = [] as number[];
  const line = getBaseLine(value);
  if (isUndefined(line)) return;
  for (const dom of getChars(value)) {
    chars.push(getIndex(dom));
  }
  return line.text.slice(Math.min(...chars), Math.max(...chars) + 1);
};

/** Get the external link element containing the given element
 * 
 * @param dom - Element to find the containing external link for
 * @returns The external link element if found, undefined otherwise
 */
export const getExternalLink = (dom: HTMLElement): HTMLElement | undefined => {
  const link = dom.closest(".link");
  if (isUndefined(link)) return undefined;
  return link as HTMLElement;
};
/** Get the internal page link element containing the given element
 * 
 * @param dom - Element to find the containing page link for
 * @returns The page link element if found, undefined otherwise
 */
export const getInternalLink = (dom: HTMLElement): HTMLElement | undefined => {
  const link = dom.closest(".page-link");
  if (isUndefined(link)) return undefined;
  return link as HTMLElement;
};
/** Get any link element (external or internal) containing the given element
 * 
 * @param dom - Element to find the containing link for
 * @returns The link element if found, undefined otherwise
 */
export const getLink = (dom: HTMLElement): HTMLElement | undefined => {
  const link = dom.closest(".link, .page-link");
  if (isUndefined(link)) return undefined;
  return link as HTMLElement;
};

/** Get the formula element containing the given element
 * 
 * @param dom - Element to find the containing formula for
 * @returns The formula element if found, undefined otherwise
 */
export const getFormula = (dom: HTMLElement): HTMLElement | undefined => {
  const formula = dom.closest(".formula");
  if (isUndefined(formula)) return undefined;
  return formula as HTMLElement;
};
/** Get the next line after the specified line
 * 
 * @param value - Line reference (can be line number, line ID, or DOM element)
 * @returns The next Line object if found, undefined otherwise
 */
export const getNextLine = <T extends HTMLElement>(
  value?: number | string | T,
): Line | undefined => {
  const index = getLineNo(value);
  if (isUndefined(index)) return undefined;

  return getLine(index + 1);
};

/** Get the previous line before the specified line
 * 
 * @param value - Line reference (can be line number, line ID, or DOM element)
 * @returns The previous Line object if found, undefined otherwise
 */
export const getPrevLine = <T extends HTMLElement>(
  value?: number | string | T,
): Line | undefined => {
  const index = getLineNo(value);
  if (isUndefined(index)) return undefined;

  return getLine(index - 1);
};

/** Get the first line's DOM element in the document
 * 
 * @returns The first line's DOM element if found, undefined otherwise
 */
export const getHeadLineDOM = (): HTMLDivElement | undefined => {
  const line = lines()?.firstElementChild;
  if (isUndefined(line)) return undefined;
  return line as HTMLDivElement;
};
/** Get the last line's DOM element in the document
 * 
 * @returns The last line's DOM element if found, undefined otherwise
 */
export const getTailLineDOM = (): HTMLDivElement | undefined => {
  const line = lines()?.lastElementChild;
  if (isUndefined(line)) return undefined;
  return line as HTMLDivElement;
};
/** Get the indentation level of a line
 * 
 * @param value - Line reference:
 *              - number: Line number
 *              - string: Line ID
 *              - HTMLElement: DOM element within the line
 * @returns The number of indentation levels if found, undefined otherwise
 */
export const getIndentCount = <T extends HTMLElement>(
  value?: number | string | T,
): number | undefined => {
  const text = getText(value);
  if (isUndefined(text)) return undefined;
  return Text.getIndentCount(text);
};
/** Get the number of indented lines under the specified line
 *
 * @param value Line reference (can be line number, line ID, or DOM element)
 */
export const getIndentLineCount = <T extends HTMLElement>(
  value?: number | string | T,
): number | undefined => {
  const index = getLineNo(value);
  if (isUndefined(index)) return;
  return Text.getIndentLineCount(index, getLines());
};

/** Get all character elements within a DOM element
 * 
 * @param value - DOM element to get characters from
 * @returns Generator yielding each character element (span.char-index)
 */
export function* getChars<T extends HTMLElement>(
  value: T,
): Generator<HTMLSpanElement, void, unknown> {
  const chars = value.getElementsByClassName("char-index");
  for (let i = 0; i < chars.length; i++) {
    yield chars[0] as HTMLSpanElement;
  }
}

/** Check if a DOM element is a character element
 * 
 * @param dom - DOM element to check
 * @returns True if the element is a character element (span.char-index)
 */
export const isCharDOM = (dom: unknown): dom is HTMLSpanElement => {
  return dom instanceof HTMLSpanElement && dom.classList.contains("char-index");
};

/** Get the index number from a character element's class name
 * 
 * @param dom - Character element to get index from
 * @returns The character's index number
 * @throws Error if the element is not a character element or missing index class
 */
export const getIndex = (dom: HTMLSpanElement): number => {
  if (!isCharDOM(dom)) throw Error("A char DOM is required.");

  const index = dom.className.match(/c-(\d+)/)?.[1];
  if (isUndefined(index)) throw Error('.char-index must have ".c-{\\d}"');
  return parseInt(index);
};
/** Get the first character element in a DOM element
 * 
 * @param dom - DOM element to get first character from
 * @returns The first character element if found, undefined otherwise
 */
export const getHeadCharDOM = (
  dom?: HTMLElement,
): HTMLSpanElement | undefined => {
  const char = dom?.getElementsByClassName?.("c-0")?.[0];
  return isCharDOM(char) ? char : undefined;
};

/** Get the last character element in a DOM element
 * 
 * @param dom - DOM element to get last character from
 * @returns The last character element if found, undefined otherwise
 */
export const getTailCharDOM = (
  dom?: HTMLElement,
): HTMLSpanElement | undefined => {
  const char = dom?.querySelector(".char-index:last-of-type");
  return isCharDOM(char) ? char : undefined;
};

/** Get a character element at a specific position in a line
 * 
 * @param line - Line reference (line number, ID, or DOM element)
 * @param pos - Character position to get (0-based)
 * @returns The character element at the position if found, undefined otherwise
 */
export const getCharDOM = <T extends HTMLElement>(
  line: string | number | T,
  pos: number,
): HTMLSpanElement | undefined => {
  const char = getLineDOM(line)?.getElementsByClassName?.(`c-${pos}`)?.[0];
  return isCharDOM(char) ? char : undefined;
};
/** Get the character and line elements at a screen coordinate
 * 
 * @param x - X coordinate on screen
 * @param y - Y coordinate on screen
 * @returns Object containing character and line elements if found
 * @property char - Character element at coordinates if found
 * @property line - Line element at coordinates if found
 */
export const getDOMFromPoint = (
  x: number,
  y: number,
): { char?: HTMLSpanElement; line?: HTMLDivElement } => {
  const targets = document.elementsFromPoint(x, y);
  const char = targets.find((target) => isCharDOM(target));
  const line = targets.find((target) => isLineDOM(target));
  return {
    char: isUndefined(char) ? undefined : char as HTMLSpanElement,
    line: isUndefined(line) ? undefined : line as HTMLDivElement,
  };
};

import {
  ensureHTMLAnchorElement,
  ensureHTMLDivElement,
  ensureHTMLTextAreaElement,
} from "./ensure.ts";

/** Get the main editor container element
 * @returns The editor element or undefined if not found
 */
export const editor = (): HTMLDivElement | undefined =>
  checkDiv(document.getElementById("editor"), "div#editor");

/** Get the lines container element that holds all page content
 * @returns The lines container element or undefined if not found
 */
export const lines = (): HTMLDivElement | undefined =>
  checkDiv(
    document.getElementsByClassName("lines").item(0),
    "div.lines",
  );

/** Get the compute line element used for text measurements
 * @returns The compute line element or undefined if not found
 */
export const computeLine = (): HTMLDivElement | undefined =>
  checkDiv(document.getElementById("compute-line"), "div#compute-line");

/** Get the cursor line element that shows the current editing position
 * @returns The cursor line element or undefined if not found
 */
export const cursorLine = (): HTMLDivElement | undefined =>
  checkDiv(
    document.getElementsByClassName("cursor-line").item(0),
    "div.cursor-line",
  );

/** Get the main text input element for editing
 * @returns The text input element or undefined if not found
 */
export const textInput = (): HTMLTextAreaElement | undefined => {
  const textarea = document.getElementById("text-input");
  if (!textarea) return;
  ensureHTMLTextAreaElement(textarea, "textarea#text-input");
  return textarea;
};

/** Get the cursor element that shows the current insertion point
 * @returns The cursor element or undefined if not found
 */
export const cursor = (): HTMLDivElement | undefined =>
  checkDiv(
    document.getElementsByClassName("cursor").item(0),
    "div.cursor",
  );

/** Get the selections container element that shows highlighted text
 * @returns The selections element or undefined if not found
 */
export const selections = (): HTMLDivElement | undefined =>
  checkDiv(
    document.getElementsByClassName("selections")?.[0],
    "div.selections",
  );

/** Get the grid element that displays related pages
 * @returns The grid element or undefined if not found
 */
export const grid = (): HTMLDivElement | undefined =>
  checkDiv(
    document.getElementsByClassName("related-page-list clearfix")[0]
      ?.getElementsByClassName?.("grid")?.item(0),
    ".related-page-list.clearfix div.grid",
  );

/** Get the popup menu element for context menus
 * @returns The popup menu element or undefined if not found
 */
export const popupMenu = (): HTMLDivElement | undefined =>
  checkDiv(
    document.getElementsByClassName("popup-menu")?.[0],
    "div.popup-menu",
  );

/** Get the page menu container element
 * @returns The page menu element or undefined if not found
 */
export const pageMenu = (): HTMLDivElement | undefined =>
  checkDiv(
    document.getElementsByClassName("page-menu")?.[0],
    "div.page-menu",
  );

/** Get the page info menu button element
 * @returns The page info menu button element or undefined if not found
 */
export const pageInfoMenu = (): HTMLAnchorElement | undefined =>
  checkAnchor(
    document.getElementById("page-info-menu"),
    "a#page-info-menu",
  );

/** Get the page edit menu button element
 * @returns The page edit menu button element or undefined if not found
 */
export const pageEditMenu = (): HTMLAnchorElement | undefined =>
  checkAnchor(
    document.getElementById("page-edit-menu"),
    "a#page-edit-menu",
  );

/** Get all page edit button elements
 * @returns Array of page edit button elements
 */
export const pageEditButtons = (): HTMLAnchorElement[] =>
  Array.from(
    pageEditMenu()?.nextElementSibling?.getElementsByTagName?.("a") ?? [],
  );

/** Get the random jump button element
 * @returns The random jump button element or undefined if not found
 */
export const randomJumpButton = (): HTMLAnchorElement | undefined =>
  checkAnchor(
    document.getElementsByClassName("random-jump-button").item(0),
    "a#random-jump-button",
  );

/** Get all custom page menu button elements
 * @returns Array of custom page menu button elements
 */
export const pageCustomButtons = (): HTMLAnchorElement[] =>
  Array.from(document.getElementsByClassName("page-menu-extension")).flatMap(
    (div) => {
      const a = div.getElementsByTagName("a").item(0);
      return a ? [a] : [];
    },
  );

/** Get the status bar element at the bottom of the page
 * @returns The status bar element or undefined if not found
 */
export const statusBar = (): HTMLDivElement | undefined =>
  checkDiv(
    document.getElementsByClassName("status-bar")?.[0],
    "div.status-bar",
  );

const checkDiv = (div: Element | null, name: string) => {
  if (!div) return;
  ensureHTMLDivElement(div, name);
  return div;
};

const checkAnchor = (a: Element | null, name: string) => {
  if (!a) return;
  ensureHTMLAnchorElement(a, name);
  return a;
};

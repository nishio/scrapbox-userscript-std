import { delay } from "@std/async/delay";

/** the options for `click()` */
/** Options for simulating mouse click events
 * 
 * Configures the properties of a simulated mouse click including position,
 * mouse button, and modifier keys.
 */
export interface ClickOptions {
  /** Mouse button to simulate (0 = left, 1 = middle, 2 = right)
   * @default {0}
   */
  button?: number;

  /** X coordinate of the click position in client coordinates */
  X: number;

  /** Y coordinate of the click position in client coordinates */
  Y: number;

  /** Whether the Shift key is pressed during the click
   * @default {false}
   */
  shiftKey?: boolean;

  /** Whether the Control key is pressed during the click
   * @default {false}
   */
  ctrlKey?: boolean;

  /** Whether the Alt key is pressed during the click
   * @default {false}
   */
  altKey?: boolean;
}

/** Emulate click event sequences */
export const click = async (
  element: HTMLElement,
  options: ClickOptions,
): Promise<void> => {
  const mouseOptions: MouseEventInit = {
    button: options.button ?? 0,
    clientX: options.X,
    clientY: options.Y,
    bubbles: true,
    cancelable: true,
    shiftKey: options.shiftKey,
    ctrlKey: options.ctrlKey,
    altKey: options.altKey,
    view: window,
  };
  element.dispatchEvent(new MouseEvent("mousedown", mouseOptions));
  element.dispatchEvent(new MouseEvent("mouseup", mouseOptions));
  element.dispatchEvent(new MouseEvent("click", mouseOptions));

  // Wait for Scrapbox's React event handlers to complete
  // Note: 10ms delay is determined empirically to ensure reliable event processing
  await delay(10);
};

/** Options for simulating mouse hold-down events
 * 
 * Extends {@linkcode ClickOptions} with additional configuration for
 * holding down the mouse button.
 */
export interface HoldDownOptions extends ClickOptions {
  /** Duration to hold the mouse button down in milliseconds
   * @default {1000}
   */
  holding?: number;
}

/** Emulate long tap event sequence */
export const holdDown = async (
  element: HTMLElement,
  options: HoldDownOptions,
): Promise<void> => {
  const touch = new Touch({
    identifier: 0,
    target: element,
    clientX: options.X,
    clientY: options.Y,
    pageX: options.X + globalThis.scrollX,
    pageY: options.Y + globalThis.scrollY,
  });
  const mouseOptions = {
    button: options.button ?? 0,
    clientX: options.X,
    clientY: options.Y,
    changedTouches: [touch],
    touches: [touch],
    bubbles: true,
    cancelable: true,
    shiftKey: options.shiftKey,
    ctrlKey: options.ctrlKey,
    altKey: options.altKey,
    view: window,
  };
  element.dispatchEvent(new TouchEvent("touchstart", mouseOptions));
  element.dispatchEvent(new MouseEvent("mousedown", mouseOptions));
  await delay(options.holding ?? 1000);
  element.dispatchEvent(new MouseEvent("mouseup", mouseOptions));
  element.dispatchEvent(new TouchEvent("touchend", mouseOptions));
  element.dispatchEvent(new MouseEvent("click", mouseOptions));

  // Wait for Scrapbox's React event handlers to complete
  // Note: 10ms delay is determined empirically to ensure reliable event processing
  await delay(10);
};

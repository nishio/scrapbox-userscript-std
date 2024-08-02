import { Result } from "../../deps/option-t.ts";
import { push, PushError, PushOptions } from "./push.ts";

export type DeletePageOptions = PushOptions;

/** 指定したページを削除する
 *
 * @param project 削除したいページのproject
 * @param title 削除したいページのタイトル
 * @param options
 */
export const deletePage = (
  project: string,
  title: string,
  options?: DeletePageOptions,
): Promise<Result<string, PushError>> =>
  push(
    project,
    title,
    (page) => page.persistent ? [{ deleted: true }] : [],
    options,
  );

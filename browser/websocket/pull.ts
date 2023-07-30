import type { Line } from "../../deps/scrapbox-rest.ts";
import { getPage } from "../../rest/pages.ts";

export interface HeadData {
  commitId: string;
  pageId: string;
  persistent: boolean;
  image: string | null;
  pin: number;
  links: string[];
  projectLinks: string[];
  lines: Line[];
}
export const pull = async (
  project: string,
  title: string,
): Promise<HeadData> => {
  const result = await getPage(project, title);

  // TODO: 編集不可なページはStream購読だけ提供する
  if (!result.ok) {
    throw new Error(`You have no privilege of editing "/${project}/${title}".`);
  }
  const { commitId, persistent, image, links, projectLinks, lines, id, pin } =
    result.value;

  return {
    commitId,
    pageId: id,
    persistent,
    image,
    links,
    projectLinks,
    pin,
    lines,
  };
};

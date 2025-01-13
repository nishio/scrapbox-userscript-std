/** Represents all possible types of changes that can occur in a Scrapbox page
 * This union type encompasses various modifications like text insertions,
 * updates, deletions, and metadata changes.
 */
export type Change =
  | InsertChange
  | UpdateChange
  | DeleteChange
  | LinksChange
  | ProjectLinksChange
  | IconsChange
  | DescriptionsChange
  | ImageChange
  | FilesChange
  | HelpFeelsChange
  | infoboxDefinitionChange
  | TitleChange;
/** Represents an insertion of new lines into a page
 * 
 * @property _insert - The ID of the line after which to insert the new content
 * @property lines - The line data to insert
 * @property lines.id - Unique identifier for the new line
 * @property lines.text - The actual text content of the new line
 */
export interface InsertChange {
  /** ID of the line after which to insert the new content */
  _insert: string;
  /** Content to be inserted
   * @property id - Unique identifier for the new line
   * @property text - The actual text content of the line
   */
  lines: {
    id: string;
    text: string;
  };
}
/** Represents an update to existing line content
 * 
 * @property _update - The ID of the line to update
 * @property lines - The new line data
 * @property lines.text - The new text content for the line
 * @property noTimestampUpdate - If present, prevents updating the page's last modified timestamp
 */
export interface UpdateChange {
  /** ID of the line to update */
  _update: string;
  /** New content for the line
   * @property text - The updated text content
   */
  lines: {
    text: string;
  };
  /** If present, prevents updating the page's last modified timestamp */
  noTimestampUpdate?: unknown;
}
/** Represents the deletion of a line from a page
 * 
 * @property _delete - The ID of the line to delete
 * @property lines - Always -1, indicating single line deletion
 */
export interface DeleteChange {
  /** ID of the line to delete */
  _delete: string;
  /** Always -1, indicating single line deletion */
  lines: -1;
}
/** Represents an update to the page's outgoing links
 * 
 * @property links - Array of page titles that this page links to
 */
export interface LinksChange {
  /** Array of page titles that this page links to */
  links: string[];
}
/** Represents an update to the page's inter-project links
 * 
 * @property projectLinks - Array of links to pages in other projects
 */
export interface ProjectLinksChange {
  /** Array of links to pages in other projects */
  projectLinks: string[];
}
/** Represents an update to the page's icon list
 * 
 * @property icons - Array of icon names or URLs used in the page
 */
export interface IconsChange {
  /** Array of icon names or URLs used in the page */
  icons: string[];
}
/** Represents an update to the page's descriptions
 * 
 * @property descriptions - Array of description lines for the page
 */
export interface DescriptionsChange {
  /** Array of description lines for the page */
  descriptions: string[];
}
/** Represents an update to the page's thumbnail image
 * 
 * @property image - URL of the new thumbnail image, or null to remove it
 */
export interface ImageChange {
  /** URL of the new thumbnail image, or null to remove it */
  image: string | null;
}
/** Represents a change to the page's title
 * 
 * @property title - The new title for the page
 */
export interface TitleChange {
  /** The new title for the page */
  title: string;
}
/** Represents a change to the page's attached files
 * 
 * This interface tracks changes to file attachments, including
 * images, documents, and other uploaded content.
 */
export interface FilesChange {
  /** Array of file IDs
   *
   * These IDs reference files that have been uploaded to the page.
   * Files can include images, documents, or other attachments.
   */
  files: string[];
}
/** Represents a change to the page's help documentation entries
 * 
 * This interface tracks changes to Helpfeel entries, which are
 * special lines that start with "? " and are used for documentation.
 */
export interface HelpFeelsChange {
  /** Array of Helpfeel entries without the leading "? " prefix
   *
   * Helpfeel is a Scrapbox notation for creating help/documentation entries.
   * Example: "? How to use" becomes "How to use" in this array.
   * These entries are used to build the page's help documentation.
   */
  helpfeels: string[];
}
/** Represents a change to the page's infobox definitions
 * 
 * This interface tracks changes to infobox tables marked with
 * either `table:infobox` or `table:cosense` directives.
 */
export interface infoboxDefinitionChange {
  /** Array of trimmed lines from infobox tables
   *
   * Contains lines from tables marked with either `table:infobox` or `table:cosense`
   */
  infoboxDefinition: string[];
}
/** Represents a change to the page's pin status
 * 
 * @property pin - The new pin value (timestamp when pinned, 0 when unpinned)
 */
export interface PinChange {
  /** The new pin value (timestamp when pinned, 0 when unpinned) */
  pin: number;
}
/** Represents the deletion of an entire page
 * 
 * @property deleted - Always true, indicating page deletion
 * @property merged - If true, indicates the page was merged into another page
 */
export interface DeletePageChange {
  /** Always true, indicating the page was deleted */
  deleted: true;
  /** If true, indicates the page was merged into another page */
  merged?: true;
}

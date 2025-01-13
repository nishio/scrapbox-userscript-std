/** Parse `LinkNode` of [@progfay/scrapbox-parser](https://jsr.io/@progfay/scrapbox-parser) in detail
 *
 * @module
 */

import type { LinkNode } from "@progfay/scrapbox-parser";
import { parseYoutube } from "./parser/youtube.ts";
import { parseVimeo } from "./parser/vimeo.ts";
import { parseSpotify } from "./parser/spotify.ts";
import { parseAnchorFM } from "./parser/anchor-fm.ts";

export type { LinkNode };

/** Regular Absolute Link Node
 * Represents a standard external link that doesn't match any specific
 * media type. This is the fallback type when a link doesn't match
 * patterns for YouTube, Vimeo, or other media platforms.
 *
 * @property type - Always "absoluteLink" to identify regular external links
 * @property content - The visible text content of the link
 * @property href - The complete URL that the link points to
 * @property raw - The original raw text of the link as it appears in Scrapbox
 */
/** Represents an absolute URL link in Scrapbox text
 * 
 * @property type - Always "absoluteLink" to identify this link type
 * @property content - The visible text content of the link
 * @property href - The full URL that the link points to
 * @property raw - The original raw text of the link as it appears in Scrapbox
 */
export interface AbsoluteLinkNode {
  /** Discriminator to identify this as a regular external link */
  type: "absoluteLink";
  /** The visible text content of the link */
  content: string;
  /** The complete URL that the link points to */
  href: string;
  /** The original raw text of the link as it appears in Scrapbox */
  raw: string;
}

/** YouTube Embed Node
 * Represents a YouTube video embed with detailed information about the video
 * and its URL parameters. Supports various YouTube URL formats including
 * youtube.com, youtu.be, and YouTube Shorts.
 */
export interface YoutubeNode {
  /** Discriminator to identify this as a YouTube video node */
  type: "youtube";
  /** The unique identifier of the YouTube video */
  videoId: string;
  /** The type of YouTube URL format:
   * - `com` for youtube.com URLs
   * - `dotbe` for youtu.be URLs
   * - `short` for YouTube Shorts URLs
   */
  pathType: "com" | "dotbe" | "short";
  /** Query parameters from the YouTube URL */
  params: URLSearchParams;
  /** The complete YouTube URL */
  href: string;
  /** The original raw text of the link as it appears in Scrapbox */
  raw: string;
}

/** YouTube Playlist Embed Node
 * Represents a YouTube playlist embed. This type is specifically for
 * playlist URLs that contain a list parameter, allowing for embedding
 * entire playlists rather than single videos.
 */
export interface YoutubeListNode {
  /** Discriminator to identify this as a YouTube playlist node */
  type: "youtube";
  /** The unique identifier of the YouTube playlist */
  listId: string;
  /** Always `list` for playlist URLs */
  pathType: "list";
  /** Query parameters from the YouTube URL */
  params: URLSearchParams;
  /** The complete YouTube playlist URL */
  href: string;
  /** The original raw text of the link as it appears in Scrapbox */
  raw: string;
}

/** Vimeo Embed Node
 * Represents a Vimeo video embed. Extracts and stores the video ID
 * from Vimeo URLs for proper embedding in Scrapbox pages.
 */
export interface VimeoNode {
  /** Discriminator to identify this as a Vimeo video node */
  type: "vimeo";
  /** The unique identifier of the Vimeo video */
  videoId: string;
  /** The complete Vimeo URL */
  href: string;
  /** The original raw text of the link as it appears in Scrapbox */
  raw: string;
}

/** Spotify Embed Node
 * Represents various types of Spotify content embeds including tracks,
 * artists, playlists, albums, episodes, and shows. Supports all major
 * Spotify content types for rich media integration.
 */
export interface SpotifyNode {
  /** Discriminator to identify this as a Spotify content node */
  type: "spotify";
  /** The unique identifier of the Spotify content */
  videoId: string;
  /** The type of Spotify content:
   * - `track` for individual songs
   * - `artist` for artist profiles
   * - `playlist` for user playlists
   * - `album` for full albums
   * - `episode` for podcast episodes
   * - `show` for podcast shows
   */
  pathType: "track" | "artist" | "playlist" | "album" | "episode" | "show";
  /** The complete Spotify URL */
  href: string;
  /** The original raw text of the link as it appears in Scrapbox */
  raw: string;
}

/** Anchor FM Embed Node
 * Represents an Anchor FM podcast episode embed. Extracts the episode ID
 * from Anchor FM URLs to enable podcast episode playback directly within
 * Scrapbox pages.
 */
export interface AnchorFMNode {
  /** Discriminator to identify this as an Anchor FM podcast node */
  type: "anchor-fm";
  /** The unique identifier of the Anchor FM episode */
  videoId: string;
  /** The complete Anchor FM URL */
  href: string;
  /** The original raw text of the link as it appears in Scrapbox */
  raw: string;
}

/** Generic Video Embed Node
 * Represents a direct video file embed (mp4 or webm formats).
 * Used for embedding video files that aren't from specific platforms
 * like YouTube or Vimeo.
 */
export interface VideoNode {
  /** Discriminator to identify this as a direct video file node */
  type: "video";
  /** The URL of the video file (must end in .mp4 or .webm) */
  href: VideoURL;
  /** The original raw text of the link as it appears in Scrapbox */
  raw: string;
}

/** Generic Audio Embed Node
 * Represents a direct audio file embed supporting common formats
 * (mp3, ogg, wav, aac). Used for embedding audio content that
 * isn't from specific platforms like Spotify.
 */
export interface AudioNode {
  /** Discriminator to identify this as a direct audio file node */
  type: "audio";
  /** The visible text content of the audio link */
  content: string;
  /** The URL of the audio file (must end in .mp3, .ogg, .wav, or .aac) */
  href: AudioURL;
  /** The original raw text of the link as it appears in Scrapbox */
  raw: string;
}

/** Parse external link syntax from scrapbox-parser into specific embed types
 *
 * This function analyzes external links that were initially parsed by
 * scrapbox-parser and categorizes them into specific embed types based on
 * their URLs. It supports various media platforms and file types:
 *
 * - YouTube videos and playlists
 * - Vimeo videos
 * - Spotify content (tracks, artists, playlists, etc.)
 * - Anchor FM podcast episodes
 * - Direct video files (mp4, webm)
 * - Direct audio files (mp3, ogg, wav, aac)
 * - Regular absolute links (fallback)
 *
 * The function automatically detects the appropriate embed type and returns
 * a strongly-typed object containing all necessary information for rendering
 * the embed in Scrapbox.
 *
 * @param link - Link node object from scrapbox-parser with absolute path type
 * @returns A {@linkcode ParsedLink} containing:
 *          - Success: Link object with specific embed type and metadata
 *          - Error: {@linkcode null} if parsing fails
 */
export const parseAbsoluteLink = (
  link: LinkNode & { pathType: "absolute" },
):
  | AbsoluteLinkNode
  | VideoNode
  | AudioNode
  | YoutubeNode
  | YoutubeListNode
  | VimeoNode
  | SpotifyNode
  | AnchorFMNode => {
  const { type: _, pathType: __, content, href, ...baseLink } = link;
  if (content === "") {
    const youtube = parseYoutube(href);
    if (youtube) return { type: "youtube", href, ...youtube, ...baseLink };

    const vimeoId = parseVimeo(href);
    if (vimeoId) return { type: "vimeo", videoId: vimeoId, href, ...baseLink };

    const spotify = parseSpotify(href);
    if (spotify) return { type: "spotify", href, ...spotify, ...baseLink };

    const anchorFMId = parseAnchorFM(href);
    if (anchorFMId) {
      return { type: "anchor-fm", videoId: anchorFMId, href, ...baseLink };
    }

    if (isVideoURL(href)) return { type: "video", href, ...baseLink };
  }
  if (isAudioURL(href)) return { type: "audio", content, href, ...baseLink };

  return { type: "absoluteLink", content, href, ...baseLink };
};

/** Audio File URL Type
 * Represents a URL string that ends with a supported audio file extension.
 * Used to validate and type-check URLs for direct audio file embeds.
 *
 * @example
 * ```ts
 * const url: AudioURL = "https://example.com/music.mp3";
 * ```
 */
export type AudioURL = `${string}.${"mp3" | "ogg" | "wav" | "acc"}`;
/** Check if a URL string points to a supported audio file
 * 
 * @param url - The URL string to check
 * @returns True if the URL ends with a supported audio extension (.mp3, .ogg, .wav, .aac)
 * 
 * @example
 * ```ts
 * if (isAudioURL(url)) {
 *   // url is typed as AudioURL
 *   playAudio(url);
 * }
 * ```
 */
export const isAudioURL = (url: string): url is AudioURL =>
  /\.(?:mp3|ogg|wav|aac)$/.test(url);

/** Video File URL Type
 * Represents a URL string that ends with a supported video file extension.
 * Used to validate and type-check URLs for direct video file embeds.
 *
 * @example
 * ```ts
 * const url: VideoURL = "https://example.com/video.mp4";
 * ```
 */
export type VideoURL = `${string}.${"mp4" | "webm"}`;
/** Check if a URL string points to a supported video file
 * 
 * @param url - The URL string to check
 * @returns True if the URL ends with a supported video extension (.mp4, .webm)
 * 
 * @example
 * ```ts
 * if (isVideoURL(url)) {
 *   // url is typed as VideoURL
 *   playVideo(url);
 * }
 * ```
 */
export const isVideoURL = (url: string): url is VideoURL =>
  /\.(?:mp4|webm)$/.test(url);

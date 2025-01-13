// ported from https://github.com/takker99/ScrapBubble/blob/0.4.0/Page.tsx#L662

/** Regular expressions for matching different YouTube URL formats */
// Matches standard youtube.com/watch URLs (including music.youtube.com)
const youtubeRegExp = /https?:\/\/(?:www\.|music\.|)youtube\.com\/watch/;
// Matches short youtu.be URLs with optional query parameters
const youtubeDotBeRegExp =
  /https?:\/\/youtu\.be\/([a-zA-Z\d_-]+)(?:\?([^\s]{0,100})|)/;
// Matches YouTube Shorts URLs
const youtubeShortRegExp =
  /https?:\/\/(?:www\.|)youtube\.com\/shorts\/([a-zA-Z\d_-]+)(?:\?([^\s]+)|)/;
// Matches playlist URLs (including music.youtube.com playlists)
const youtubeListRegExp =
  /https?:\/\/(?:www\.|music\.|)youtube\.com\/playlist\?((?:[^\s]+&|)list=([a-zA-Z\d_-]+)(?:&[^\s]+|))/;

/** Properties extracted from a YouTube URL */
export type YoutubeProps = {
  /** URL query parameters (e.g., timestamp, playlist reference) */
  params: URLSearchParams;
  /** The unique identifier of the video */
  videoId: string;
  /** The URL format type:
   * - `com`: Standard youtube.com/watch?v= format
   * - `dotbe`: Short youtu.be/ format
   * - `short`: YouTube Shorts format
   */
  pathType: "com" | "dotbe" | "short";
} | {
  /** URL query parameters */
  params: URLSearchParams;
  /** The unique identifier of the playlist */
  listId: string;
  /** Always `list` for playlist URLs */
  pathType: "list";
};

/** Parse a YouTube URL to extract video/playlist ID and other properties
 *
 * This function handles various YouTube URL formats:
 * 1. Standard video URLs:
 *    - https://www.youtube.com/watch?v={videoId}
 *    - https://music.youtube.com/watch?v={videoId}
 *
 * 2. Short URLs:
 *    - https://youtu.be/{videoId}
 *    - Can include optional query parameters
 *
 * 3. YouTube Shorts:
 *    - https://youtube.com/shorts/{videoId}
 *    - https://www.youtube.com/shorts/{videoId}
 *
 * 4. Playlist URLs:
 *    - https://youtube.com/playlist?list={listId}
 *    - https://music.youtube.com/playlist?list={listId}
 *
 * The function preserves all query parameters from the original URL.
 *
 * @param url - Any URL or string to parse
 * @returns A {@linkcode Result}<{@linkcode YoutubeProps}, {@linkcode undefined}> containing:
 *          - Success: The extracted video/playlist information with:
 *            - For videos: videoId, params, and pathType (`com`, `dotbe`, or `short`)
 *            - For playlists: listId, params, and pathType (`list`)
 *          - Error: {@linkcode undefined} if not a valid YouTube URL
 */
export const parseYoutube = (url: string): YoutubeProps | undefined => {
  if (youtubeRegExp.test(url)) {
    const params = new URL(url).searchParams;
    const videoId = params.get("v");
    if (videoId) {
      return {
        pathType: "com",
        videoId,
        params,
      };
    }
  }

  {
    const matches = url.match(youtubeDotBeRegExp);
    if (matches) {
      const [, videoId, params] = matches;
      return {
        videoId,
        params: new URLSearchParams(params),
        pathType: "dotbe",
      };
    }
  }

  {
    const matches = url.match(youtubeShortRegExp);
    if (matches) {
      const [, videoId, params] = matches;
      return {
        videoId,
        params: new URLSearchParams(params),
        pathType: "short",
      };
    }
  }

  {
    const matches = url.match(youtubeListRegExp);
    if (matches) {
      const [, params, listId] = matches;

      return { listId, params: new URLSearchParams(params), pathType: "list" };
    }
  }

  return undefined;
};

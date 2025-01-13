/** Retrieves the latest response from the cache storage managed by scrapbox.io
 *
 * This function searches through the cache storage in reverse chronological order
 * to find the most recent cached response for a given request.
 *
 * > [!NOTE]
 * > Implementation inspired by Scrapbox's ServiceWorker and Cache usage pattern.
 * > For details, see the article "ServiceWorker and Cache Usage in Scrapbox" {@see https://scrapbox.io/daiiz/ScrapboxでのServiceWorkerとCacheの活用#5d2efaffadf4e70000651173}
 *
 * @param request - The {@linkcode Request} to find a cached response for
 * @param options - {@linkcode CacheQueryOptions} (e.g., to ignore search params)
 * @returns A {@linkcode Response} if found, otherwise {@linkcode undefined}
 */
export const findLatestCache = async (
  request: Request,
  options?: CacheQueryOptions,
): Promise<Response | undefined> => {
  const cacheNames = await globalThis.caches.keys();

  for (const date of cacheNames.sort().reverse()) {
    const cache = await caches.open(date);
    const res = await cache.match(request, options);
    if (res) return res;
  }
};

/** Saves a response to the REST API cache storage managed by scrapbox.io
 *
 * @param request The {@linkcode Request} to associate with the cached response
 * @param response The {@linkcode Response} to cache
 */
export const saveApiCache = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const res = response.clone();
  const cache = await caches.open(generateCacheName(new Date()));
  return await cache.put(request, res);
};

/** Generate a cache name for storing API responses
 * 
 * Creates a cache name in the format "api-YYYY-MM-DD" where:
 * - YYYY is the full year
 * - MM is the zero-padded month (01-12)
 * - DD is the zero-padded day (01-31)
 * 
 * This format ensures:
 * 1. Cache names are chronologically sortable
 * 2. Each day has its own cache storage
 * 3. Old caches can be easily identified and cleaned up
 * 
 * @param date - Date to generate the cache name from
 * @returns Cache name string in "api-YYYY-MM-DD" format
 */
export const generateCacheName = (date: Date): string =>
  `api-${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}-${
    `${date.getDate()}`.padStart(2, "0")
  }`;

/** Executes prefetch operations for specified API URLs
 *
 * Prefetched data is stored in two locations:
 * 1. `"prefetch"` cache - temporary storage, cleared after first use
 * 2. `"api-yyyy-MM-dd"` cache - date-based persistent storage
 *
 * > [!NOTE]
 * > Throws an exception if the network connection is slow
 *
 * @param urls List of API URLs to prefetch
 */
export const prefetch = (urls: (string | URL)[]): Promise<void> =>
  postMessage({
    title: "prefetch",
    body: { urls: urls.map((url) => url.toString()) },
  });

/** Requests a cache update for the specified API
 *
 * Updates are processed one at a time with a 10-second interval between each update
 *
 * @param url The URL of the API to cache
 */
export const fetchApiCache = (url: string): Promise<void> =>
  postMessage({ title: "fetchApiCache", body: { url } });

const postMessage = <T, U = unknown>(
  data: { title: string; body: T },
): Promise<U> => {
  const { controller } = navigator.serviceWorker;
  if (!controller) {
    const error = new Error();
    error.name = "ServiceWorkerNotActiveYetError";
    error.message = "Service worker is not active yet";
    throw error;
  }

  return new Promise<U>((resolve, reject) => {
    const channel = new MessageChannel();
    channel.port1.addEventListener(
      "message",
      (event) =>
        event.data?.error ? reject(event.data.error) : resolve(event.data),
    );
    controller.postMessage(data, [channel.port2]);
  });
};

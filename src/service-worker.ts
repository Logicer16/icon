/**
 * @file The site's service worker.
 */
/// <reference types="@sveltejs/kit" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import "workbox-precaching";
import {version} from "$service-worker";
import {
  ServiceWorkerClientMessageTypes,
  ServiceWorkerMessageTypes,
  validateMessageData
} from "./lib/ServiceWorker/messages.js";
import {initShouldAutoReload, register} from "./lib/ServiceWorker/register.js";

declare let self: ServiceWorkerGlobalScope;

const cacheId = "SW Cache";
// const externalCacheId = "SW External Cache";

let coepCredentialless = false;

type Files = Record<string, string | undefined>;

// Is an empty array whilst running the dev server due to the sev server using SSR.
const fileManifest = self.__WB_MANIFEST;

const files: Files = Object.fromEntries(
  fileManifest.map((entry) => {
    const isString = typeof entry === "string";

    let path = isString ? entry : entry.url;
    if (!path.startsWith("/")) path = `/${path}`;

    let revision: string | undefined;
    if (!isString) revision = entry.revision ?? undefined;

    return [path, revision];
  })
);

// Register service worker if script is running in the browser
if (typeof window === "undefined") {
  initServiceWorker();
} else {
  if (typeof document !== "undefined") initShouldAutoReload();
  register();
}

/**
 * Files excluded from bundling by workbox.
 */
const cacheExcluded = new Set(["/service-worker.js"]);

/**
 * Format a local path to include it's revision.
 * @param path The path of the file.
 * @returns The formatted path.
 */
function formatPath(path: keyof Files): string {
  // As long as there are no other query parameters (which there shouldn't be for cacheable resources) this should keep working
  // Default to use the build version if a file version is unavailable.
  return `${path}?__WB_REVISION__=${files[path] ?? version}`;
}

/**
 * Add a HTTP response header to a response.
 * @param headers The set of headers to add the header to.
 * @param name The name of the header to add.
 * @param value The value of the new header.
 * @returns The updated set of headers.
 */
function addHeader(headers: Headers, name: string, value: string): Headers {
  const newHeaders = new Headers(headers);
  if (!newHeaders.has(name)) newHeaders.set(name, value);
  return newHeaders;
}

/**
 * Adds a HTTP response headers to a response.
 * @param originalResponse The response to add the headers to.
 * @returns The modified response.
 */
function addHeaders(originalResponse: Response): Response {
  let newHeaders = addHeader(
    originalResponse.headers,
    "Cross-Origin-Embedder-Policy",
    coepCredentialless ? "credentialless" : "require-corp"
  );
  if (!coepCredentialless) {
    newHeaders = addHeader(
      newHeaders,
      "Cross-Origin-Resource-Policy",
      "cross-origin"
    );
  }
  newHeaders = addHeader(
    newHeaders,
    "Cross-Origin-Opener-Policy",
    "same-origin"
  );

  return new Response(originalResponse.body, {
    headers: newHeaders,
    status: originalResponse.status,
    statusText: originalResponse.statusText
  });
}

/**
 * Extract the path component of a URL.
 * @param url The url to extract the path from.
 * @returns The url's path component.
 */
function extractPath(url: URL): string {
  return url.href.slice(url.href.indexOf(url.host) + url.host.length);
}

/**
 * Create a new cache and add the site's files to the cache to allow offline use.
 * @returns A promise which fulfils when all of the files have been added to the cache.
 */
// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
async function addFilesToCache(): Promise<void[]> {
  const cache = await caches.open(cacheId);
  const cachedPaths = new Set(
    (await cache.keys()).map((request) => {
      return extractPath(new URL(request.url));
    })
  );
  const filePaths = Object.keys(files).map((entry) => {
    return formatPath(entry);
  });
  return Promise.all(
    filePaths.map(async (path) => {
      if (!cachedPaths.has(path)) return cache.add(path);
    })
  );
}

/**
 * Removes files from the cache which are no longer needed.
 * @returns A promise which resolves with the status of each of the `cache.delete()` calls.
 */
async function pruneCache(): Promise<boolean[]> {
  const promises: Promise<boolean>[] = [];

  const cache = await caches.open(cacheId);
  for (const key of await cache.keys()) {
    const url = new URL(key.url);
    const path = extractPath(url);
    if (path !== formatPath(url.pathname)) promises.push(cache.delete(key));
  }
  return Promise.all(promises);
}

/**
 * Adds service worker listeners.
 */
function initServiceWorker(): void {
  self.addEventListener("install", (event) => {
    event.waitUntil(addFilesToCache());
  });

  self.addEventListener("activate", (event) => {
    event.waitUntil(pruneCache());
  });

  self.addEventListener("message", (event) => {
    // type-coverage:ignore-next-line
    const data: unknown = event.data;
    if (!validateMessageData<false>(data)) return;

    switch (data.type) {
      case ServiceWorkerMessageTypes.coepCredentialless: {
        if (!("value" in data) || typeof data.value !== "boolean") break;
        coepCredentialless = data.value;
        break;
      }

      case ServiceWorkerMessageTypes.canReloadServiceWorker: {
        self.clients
          .matchAll()
          .then((clients) => {
            for (const client of clients) {
              client.postMessage({
                type: ServiceWorkerClientMessageTypes.canReloadServiceWorker
              });
            }
          })
          .catch((error: unknown) => {
            throw error;
          });
        break;
      }

      case ServiceWorkerMessageTypes.reloadServiceWorker: {
        self
          .skipWaiting()
          .then(async () => {
            return self.clients.claim();
          })
          .then(async () => {
            return self.clients.matchAll();
          })
          .then((clients) => {
            for (const client of clients) {
              client.postMessage({
                type: ServiceWorkerClientMessageTypes.reloadClient
              });
            }
          })
          .catch((error: unknown) => {
            throw error;
          });
      }
    }
  });

  self.addEventListener("fetch", (event) => {
    /**
     * Responds to a fetch request. Adds the cross origin isolation headers and falls back to the local cache if the server is unavailable.
     * @returns The processed fetch response.
     */
    async function respondToFetch(): Promise<Response> {
      const request =
        coepCredentialless && event.request.mode === "no-cors"
          ? new Request(event.request, {
              credentials: "omit"
            })
          : event.request;

      const url = new URL(request.url);

      // Resources cached on install can always be served from the cache
      const cache = await caches.open(cacheId);
      const path = url.pathname;
      if (Object.keys(files).includes(path)) {
        const cacheMatch = await cache.match(formatPath(path));
        if (cacheMatch !== undefined) {
          return addHeaders(cacheMatch);
        }
      }

      if (
        process.env.NODE_ENV === "production" &&
        !cacheExcluded.has(url.pathname)
      ) {
        console.warn(
          `Requested to fetch external resource at: ${url.href}\nThis resource will not be cached for offline use.`
        );
      }
      // Try an online request first, then fall back to the cache if we're offline
      // const externalCache = await caches.open(externalCacheId);
      // const cacheURL = formatPath(url.href, version);
      // try {
      const response = await fetch(request);

      // if (response.status === 200) {
      //   externalCache.put(cacheURL, response.clone()).catch((error) => {
      //     throw error;
      //   });
      // }

      return addHeaders(response);
      // } catch (error) {
      //   const cacheMatch = await externalCache.match(cacheURL);
      //   if (cacheMatch !== undefined) return cacheMatch;
      //   throw error;
      // }
    }

    event.respondWith(respondToFetch());
  });
}

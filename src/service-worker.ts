/// <reference types="@sveltejs/kit" />
///// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import "workbox-precaching";
import {registerServiceWorker} from "./lib/ServiceWorker/register.js";
import {ServiceWorkerMessageTypes} from "./lib/ServiceWorker/messages.js";

// import {version} from "$service-worker";

declare let self: ServiceWorkerGlobalScope;

function serviceWorker(): void {
  // Register service worker if script is running in the browser
  if (typeof window !== "undefined") {
    registerServiceWorker();
    return;
  }

  const cacheId = "SW Cache";
  // const externalCacheId = "SW External Cache";

  let coepCredentialless = false;

  type Files = Record<string, string | undefined>;
  type Value<T> = T[keyof T];

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

  const cacheExclude = ["/service-worker.js"];

  function formatPath(path: keyof Files, revision: Value<Files>): string {
    // As long as there are no other query parameters (which there shouldn't be for cacheable resources) this should keep working
    if (revision === undefined) return path;
    return `${path}?__WB_REVISION__=${revision}`;
  }

  function addHeader(headers: Headers, name: string, value: string): Headers {
    const newHeaders = new Headers(headers);
    if (!newHeaders.has(name)) newHeaders.set(name, value);
    return newHeaders;
  }

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

  function extractPath(url: URL): string {
    return url.href.substring(url.href.indexOf(url.host) + url.host.length);
  }

  self.addEventListener("install", (event) => {
    // Create a new cache and add all files to it
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    async function addFilesToCache(): Promise<void[]> {
      const cache = await caches.open(cacheId);
      const cachedPaths = (await cache.keys()).map((request) => {
        return extractPath(new URL(request.url));
      });
      const filePaths = Object.entries(files).map((entry) => {
        return formatPath(...entry);
      });
      return Promise.all(
        filePaths.map(async (path) => {
          if (!cachedPaths.includes(path)) return cache.add(path);
        })
      );
    }

    event.waitUntil(addFilesToCache());
  });

  self.addEventListener("activate", (event) => {
    // Purge caches
    async function pruneOldCaches(): Promise<void> {
      // App
      const cache = await caches.open(cacheId);
      for (const key of await cache.keys()) {
        const url = new URL(key.url);
        const path = extractPath(url);
        if (path !== formatPath(url.pathname, files[url.pathname]))
          await cache.delete(key);
      }
    }

    const promises = Promise.all([self.clients.claim(), pruneOldCaches()]);

    event.waitUntil(promises);
  });

  self.addEventListener("message", (event) => {
    const data: unknown = event.data;
    if (!(data instanceof Object)) {
      return;
    }
    if (!("type" in data)) return;

    if (data.type === ServiceWorkerMessageTypes.coepCredentialless) {
      if (!("value" in data) || typeof data.value !== "boolean") return;
      coepCredentialless = data.value;
    }
  });

  self.addEventListener("fetch", (event) => {
    async function respond(): Promise<Response> {
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
        const cacheMatch = await cache.match(formatPath(path, files[path]));
        if (cacheMatch !== undefined) {
          return addHeaders(cacheMatch);
        }
      }

      if (
        process.env.NODE_ENV === "production" &&
        !cacheExclude.includes(url.pathname)
      )
        console.warn(
          `Requested to fetch external resource at: ${url.href}\nThis resource will not be cached for offline use.`
        );
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

    event.respondWith(respond());
  });
}

serviceWorker();

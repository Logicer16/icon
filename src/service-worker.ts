/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import {cleanupOutdatedCaches, precacheAndRoute} from "workbox-precaching";
import {ServiceWorkerMessageTypes} from "./lib/serviceWorkerMessages.js";

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

let coepCredentialless = false;

function addHeader(headers: Headers, name: string, value: string): Headers {
  const newHeaders = new Headers(headers);
  if (!newHeaders.has(name)) newHeaders.set(name, value);
  return newHeaders;
}

function initServiceWorker(): void {
  self.addEventListener("install", () => {
    self.skipWaiting().catch((error) => {
      throw error;
    });
  });

  self.addEventListener("activate", (event: ExtendableEvent) => {
    event.waitUntil(self.clients.claim());
  });

  self.addEventListener("message", (event) => {
    const data: unknown = event.data;
    if (!(data instanceof Object)) {
      return;
    }
    if (!("type" in data)) return;

    if (data.type === ServiceWorkerMessageTypes.deregister) {
      self.registration
        .unregister()
        .then(async () => {
          return self.clients.matchAll();
        })
        .then(async (clients) => {
          return Promise.all(
            clients.map(async (client) => {
              if (client instanceof WindowClient)
                return client.navigate(client.url);
            })
          );
        })
        .catch((error) => {
          throw error;
        });
    } else if (data.type === ServiceWorkerMessageTypes.coepCredentialless) {
      if (!("value" in data) || typeof data.value !== "boolean") return;
      coepCredentialless = data.value;
    }
  });

  self.addEventListener("fetch", (event: FetchEvent) => {
    const rawRequest = event.request;
    if (
      rawRequest.cache === "only-if-cached" &&
      rawRequest.mode !== "same-origin"
    ) {
      return;
    }

    const request =
      coepCredentialless && rawRequest.mode === "no-cors"
        ? new Request(rawRequest, {
            credentials: "omit"
          })
        : rawRequest;

    event.respondWith(
      fetch(request).then((response) => {
        if (response.status === 0) {
          return response;
        }

        let newHeaders = addHeader(
          response.headers,
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

        return new Response(response.body, {
          headers: newHeaders,
          status: response.status,
          statusText: response.statusText
        });
      })
    );
  });
}
initServiceWorker();

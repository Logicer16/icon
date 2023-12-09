/**
 * @file Functions for a client page to interact with the service worker.
 */
import {
  ServiceWorkerClientMessageTypes,
  ServiceWorkerMessageTypes
} from "./messages";
import {fetchUpdatedServiceWorker} from "./common";

/**
 * Reload the service worker.
 */
export async function reloadServiceWorker(): Promise<void> {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration === undefined) return;
  fetchUpdatedServiceWorker(registration)?.postMessage({
    type: ServiceWorkerMessageTypes.reloadServiceWorker
  });
}

/**
 * Handlers for events in the flow of reloading a service worker.
 */
export interface ReloadHandlers {
  /** The handler which should reload the client to use the new service worker. Defaults to `window.location.reload()`. */
  reload?: () => void;
  /** The handler which is called when an update is available and the service worker is ready to be reloaded. */
  updateReady?: () => void;
}

/**
 * Add handlers for events in the flow of reloading a service worker.
 * @param reloadHandlers The handlers for events in the flow of reloading a service worker.
 */
export function registerUpdateHandlers(reloadHandlers: ReloadHandlers): void {
  navigator.serviceWorker.addEventListener("message", (event) => {
    const data: unknown = event.data;
    if (!(data instanceof Object)) {
      return;
    }
    if (!("type" in data)) return;

    switch (data.type) {
      case ServiceWorkerClientMessageTypes.reloadClient:
        if (reloadHandlers.reload !== undefined) {
          reloadHandlers.reload();
        } else {
          window.location.reload();
        }
        break;

      case ServiceWorkerClientMessageTypes.canReloadServiceWorker:
        if (reloadHandlers.updateReady !== undefined) {
          reloadHandlers.updateReady();
        }
    }
  });
  navigator.serviceWorker.startMessages();
}

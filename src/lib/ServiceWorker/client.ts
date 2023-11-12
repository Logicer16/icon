import {
  ServiceWorkerClientMessageTypes,
  ServiceWorkerMessageTypes
} from "./messages";
import {fetchWaitingServiceWorker} from "./common";

export async function reloadServiceWorker(): Promise<void> {
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration === undefined) return;
  fetchWaitingServiceWorker(registration)?.postMessage({
    type: ServiceWorkerMessageTypes.reloadServiceWorker
  });
}

export function registerReloadHandler(
  reloadHandler: (() => void) | undefined,
  canReloadHandler: (() => void) | undefined
): void {
  navigator.serviceWorker.addEventListener("message", (event) => {
    const data: unknown = event.data;
    if (!(data instanceof Object)) {
      return;
    }
    if (!("type" in data)) return;

    switch (data.type) {
      case ServiceWorkerClientMessageTypes.reloadClient:
        if (reloadHandler !== undefined) {
          reloadHandler();
        } else {
          window.location.reload();
        }
        break;
      case ServiceWorkerClientMessageTypes.canReloadServiceWorker:
        if (canReloadHandler !== undefined) canReloadHandler();
    }
  });
  navigator.serviceWorker.startMessages();
}

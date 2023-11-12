import {fetchWaitingServiceWorker} from "./common";
import {ServiceWorkerMessageTypes} from "./messages";
import {serviceWorkerName} from "$lib/const";

let loaded = false;
let updateIntervalID: number | NodeJS.Timeout | undefined;
let updateCheckIntervalID: number | NodeJS.Timeout | undefined;

function coepCredentialless(): boolean {
  // Support is not yet universal.
  return false;
}

function fatalError(error: string): void {
  console.error(error);
  alert(error);
}

function fetchNewServiceWorker(
  registration: ServiceWorkerRegistration
): ServiceWorker | undefined {
  let serviceWorker: ServiceWorker | null =
    fetchWaitingServiceWorker(registration) ?? null;
  serviceWorker = registration.active ?? serviceWorker;
  return serviceWorker ?? undefined;
}

function reload(): void {
  window.location.reload();
}

function processServiceWorkerState(serviceWorker: ServiceWorker): void {
  if (serviceWorker.state === "activated") {
    // If the registration is active, but it's not controlling the page
    if (!navigator.serviceWorker.controller) {
      reload();
    }
  }
}

function promptServiceWorkerUpdate(): void {
  navigator.serviceWorker.controller?.postMessage({
    type: ServiceWorkerMessageTypes.canReloadServiceWorker
  });
}

function checkForUpdate(registration: ServiceWorkerRegistration): void {
  const waitingServiceWorker = fetchWaitingServiceWorker(registration);
  if (waitingServiceWorker?.state === "installed") {
    promptServiceWorkerUpdate();
  }
}

function prepareUpdate(registration: ServiceWorkerRegistration): void {
  const waitingServiceWorker = fetchWaitingServiceWorker(registration);
  waitingServiceWorker?.addEventListener("statechange", () => {
    checkForUpdate(registration);
  });
}

function onLoad(): void {
  if (loaded) return;
  navigator.serviceWorker
    .register(`./${serviceWorkerName}.js`, {
      type: process.env.NODE_ENV !== "production" ? "module" : "classic"
    })
    .then((registration) => {
      const serviceWorker = fetchNewServiceWorker(registration);
      if (serviceWorker === undefined) {
        throw new Error("Could not find registered service worker");
      }

      registration.addEventListener("updatefound", () => {
        prepareUpdate(registration);
      });
      if (
        registration.active !== null &&
        (registration.installing ?? registration.waiting) !== null
      ) {
        prepareUpdate(registration);
      }

      clearInterval(updateIntervalID);
      updateIntervalID = setInterval(
        () => {
          registration.update().catch((error) => {
            console.error(
              `Could not register service worker with error: ${error}`
            );
          });
        },
        60 * 60 * 1000 /* 1h */
      );

      clearInterval(updateCheckIntervalID);
      updateCheckIntervalID = setInterval(() => {
        checkForUpdate(registration);
      }, 10 * 1000 /* 1m */);

      serviceWorker.addEventListener("statechange", () => {
        processServiceWorkerState(serviceWorker);
      });
      processServiceWorkerState(serviceWorker);
    })
    .catch((error) => {
      throw error;
    });
  loaded = true;
}

export function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator)) {
    fatalError(
      "Error: Browser not compatible; service workers are not available in the current browser context."
    );
    return;
  }

  if (document.readyState !== "complete") {
    addEventListener("load", onLoad);
  } else {
    onLoad();
  }

  if (navigator.serviceWorker.controller !== null) {
    navigator.serviceWorker.controller.postMessage({
      type: ServiceWorkerMessageTypes.coepCredentialless,
      value: coepCredentialless()
    });
  }
}

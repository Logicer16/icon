/**
 * @file Register the service worker.
 */
import {fetchUpdatedServiceWorker} from "./common.js";
import {ServiceWorkerMessageTypes} from "./messages.js";
import {serviceWorkerName} from "$lib/const";

let loaded = false;
let updateIntervalID: number | NodeJS.Timeout | undefined;
let updateCheckIntervalID: number | NodeJS.Timeout | undefined;

let shouldAutoReload: true | undefined;

// Support is not yet universal and no features of the site rely on unsecured external resources.
const coepCredentialless = false;

/**
 * Initialise the `shouldAutoReload` based on the attributes of the html tag responsible for loading this script.
 */
export function initShouldAutoReload(): void {
  if (
    document.currentScript?.getAttribute("data-should-auto-reload") === "true"
  ) {
    shouldAutoReload = true;
  }
}

/**
 * Throws an error which cannot be recovered from.
 * @param errorMessage A string describing the error.
 * @throws The error created from the string.
 */
function fatalError(errorMessage: string): void {
  alert(errorMessage);
  throw new Error(errorMessage);
}

/**
 * Get the latest revision of the service worker being processed.
 * @param registration The registration associated with the service workers.
 * @returns The latest revision of the service worker being processed.
 */
function fetchNewestServiceWorker(
  registration: ServiceWorkerRegistration
): ServiceWorker | undefined {
  const serviceWorker: ServiceWorker | null =
    fetchUpdatedServiceWorker(registration) ?? registration.active;
  return serviceWorker ?? undefined;
}

/**
 * Reload the window.
 */
function reload(): void {
  window.location.reload();
}

/**
 * Respond to the state of the service worker.
 * @param serviceWorker The service worker whose state is to be responded to.
 */
function processServiceWorkerState(serviceWorker: ServiceWorker): void {
  if (
    serviceWorker.state === "activated" &&
    // If a registration is active, but it's not controlling the page
    navigator.serviceWorker.controller === null &&
    shouldAutoReload
  ) {
    reload();
  }
}

/**
 * Prompt all clients of the service worker that an update is available.
 */
function promptServiceWorkerUpdate(): void {
  navigator.serviceWorker.controller?.postMessage({
    type: ServiceWorkerMessageTypes.canReloadServiceWorker
  });
}

/**
 * Check for updates to the service worker.
 * @param registration The registration associated with the service workers.
 */
function checkForUpdate(registration: ServiceWorkerRegistration): void {
  const updatedServiceWorker = fetchUpdatedServiceWorker(registration);
  if (updatedServiceWorker?.state === "installed") {
    promptServiceWorkerUpdate();
  }
}

/**
 * Respond to service worker updates when they become available.
 * @param registration The registration associated with the service workers.
 */
function listenForUpdate(registration: ServiceWorkerRegistration): void {
  const updatedServiceWorker = fetchUpdatedServiceWorker(registration);
  updatedServiceWorker?.addEventListener("statechange", () => {
    checkForUpdate(registration);
  });
  if (updatedServiceWorker?.state === "installed") checkForUpdate(registration);
}

/**
 * Run on the load of the page.
 */
function onLoad(): void {
  if (loaded) return;
  navigator.serviceWorker
    .register(`./${serviceWorkerName}.js`, {
      type: process.env.NODE_ENV === "production" ? "classic" : "module"
    })
    .then((registration) => {
      const serviceWorker = fetchNewestServiceWorker(registration);
      if (serviceWorker === undefined) {
        throw new Error("Could not find registered service worker");
      }

      registration.addEventListener("updatefound", () => {
        listenForUpdate(registration);
      });
      if (
        registration.active !== null &&
        (registration.installing ?? registration.waiting) !== null
      ) {
        listenForUpdate(registration);
      }

      clearInterval(updateIntervalID);
      updateIntervalID = setInterval(
        () => {
          registration.update().catch((error: unknown) => {
            console.error(
              `Could not register service worker with error:`,
              error
            );
          });
        },
        60 * 60 * 1000 /* 1h */
      );

      clearInterval(updateCheckIntervalID);
      updateCheckIntervalID = setInterval(() => {
        checkForUpdate(registration);
      }, 60 * 1000 /* 1m */);

      serviceWorker.addEventListener("statechange", () => {
        processServiceWorkerState(serviceWorker);
      });
      processServiceWorkerState(serviceWorker);
    })
    .catch((error: unknown) => {
      throw error;
    });
  loaded = true;
}

/**
 * Register the service worker.
 */
export function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator)) {
    fatalError(
      "Error: Browser not compatible; service workers are not available in the current browser context."
    );
    return;
  }

  addEventListener("load", onLoad);
  if (document.readyState === "complete") {
    onLoad();
  }

  if (navigator.serviceWorker.controller !== null) {
    navigator.serviceWorker.controller.postMessage({
      type: ServiceWorkerMessageTypes.coepCredentialless,
      value: coepCredentialless
    });
  }
}

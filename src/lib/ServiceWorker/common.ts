/**
 * @file Service worker functions common to both the client and the service worker.
 */

/**
 * Get the service worker which is currently in the waiting or installing state.
 * @param registration The registration associated with the service workers.
 * @returns The waiting or installing service worker.
 */
export function fetchUpdatedServiceWorker(
  registration: ServiceWorkerRegistration
): ServiceWorker | undefined {
  let serviceWorker: ServiceWorker | null = registration.installing;
  serviceWorker = registration.waiting ?? serviceWorker;
  return serviceWorker ?? undefined;
}

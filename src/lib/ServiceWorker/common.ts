export function fetchWaitingServiceWorker(
  registration: ServiceWorkerRegistration
): ServiceWorker | undefined {
  let serviceWorker: ServiceWorker | null = registration.installing;
  serviceWorker = registration.waiting ?? serviceWorker;
  return serviceWorker ?? undefined;
}

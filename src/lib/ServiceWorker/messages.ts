/**
 * @file The types of messages which are sent in communications between the service worker and the client.
 */

/**
 * The types of messages which are sent in communications from the client to the service worker.
 */
export enum ServiceWorkerMessageTypes {
  /**
   * The availability of COEP Credentialless for the current browser.
   */
  coepCredentialless,
  /**
   * An updated service worker has been installed. The existing service worker should communicate this to all of its clients.
   */
  canReloadServiceWorker,
  reloadServiceWorker
}

/**
 * The types of messages which are sent in communications from the service worker to the client.
 */
export enum ServiceWorkerClientMessageTypes {
  /**
   * An update is available for the service worker.
   */
  canReloadServiceWorker,
  reloadClient
}

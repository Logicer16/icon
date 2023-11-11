export function registerServiceWorker(): void {
  addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js", {
        type: process.env.NODE_ENV === "production" ? "module" : "classic"
      })
      .catch((error) => {
        throw error;
      });
  });
}

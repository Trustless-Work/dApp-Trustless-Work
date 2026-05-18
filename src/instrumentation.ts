/** Remove Node's broken experimental localStorage polyfill before SSR. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const storage = globalThis.localStorage;
  if (storage && typeof storage.getItem !== "function") {
    Reflect.deleteProperty(globalThis, "localStorage");
  }
}

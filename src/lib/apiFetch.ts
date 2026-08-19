type CacheEntry = {
  expiresAt: number;
  response: Response;
};

const STALE_MS = 30_000;
const getCache = new Map<string, CacheEntry>();
const inFlight = new Map<string, Promise<Response>>();

export async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  // The backend uses session cookies for auth — always send them, so every
  // dashboard call (including ones that forget to pass credentials) works
  // against the protected endpoints.
  const merged: RequestInit = { ...init, credentials: "include" };
  const method = (merged.method ?? "GET").toUpperCase();

  if (method === "GET") {
    const cached = getCache.get(input);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.response.clone();
    }

    const pending = inFlight.get(input);
    if (pending) {
      return pending.then((response) => response.clone());
    }

    const request = fetch(input, merged)
      .then((response) => {
        if (response.ok) {
          getCache.set(input, {
            expiresAt: Date.now() + STALE_MS,
            response: response.clone(),
          });
        }
        inFlight.delete(input);
        return response;
      })
      .catch((error) => {
        inFlight.delete(input);
        throw error;
      });

    inFlight.set(input, request);
    return request;
  }

  getCache.clear();
  inFlight.clear();
  return fetch(input, merged);
}

export function clearApiCache(): void {
  getCache.clear();
  inFlight.clear();
}

import { session } from "@/features/auth/session";
import { API_URL } from "./config";

const createHeaders = (customHeaders: HeadersInit = {}): HeadersInit => {
  const { getAuthToken } = session;
  const token = getAuthToken();
  return {
    ...customHeaders,
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const authFetch = {
  get: async <T>(url: string, options: RequestInit = {}): Promise<T> => {
    const res = await fetch(API_URL + url, {
      ...options,
      method: "GET",
      headers: createHeaders(options.headers),
    });

    if (!res.ok) {
      throw new Error(`GET ${url} failed with status ${res.status}`);
    }

    return res.json();
  },

  post: async <T, B>(
    url: string,
    body: B,
    options: RequestInit = {}
  ): Promise<T> => {
    const isFormData = body instanceof FormData;
    const headers = isFormData
      ? {
          ...(options.headers || {}),
          ...(session.getAuthToken()
            ? { Authorization: `Bearer ${session.getAuthToken()}` }
            : {}),
        }
      : createHeaders(options.headers);
    const res = await fetch(API_URL + url, {
      ...options,
      method: "POST",
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(`POST ${url} failed with status ${res.status}`);
    }

    return res.json();
  },
};

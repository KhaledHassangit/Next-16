/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';

/* ===============================
   CONFIG
================================ */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const BASE_URL =
  'https://egyptrapro-nestjs-production.up.railway.app';

/* ===============================
   TOKEN ACCESS
================================ */

// Get the JWT token from cookies
export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value;
}

/* ===============================
   CORE REQUEST (Next Fetch)
================================ */
type RequestOptions = {
  endpoint: string;
  method: HttpMethod;
  params?: Record<string, any>;
  data?: any;
  isFormData?: boolean;
  cache?: RequestCache;
  revalidate?: number;
  token?: boolean | string;
};

async function request<T>({
  endpoint,
  method,
  params,
  data,
  isFormData = false,
  cache = 'no-store',
  revalidate,
  token = false,
}: RequestOptions): Promise<T> {
  /* ---------- Query Params ---------- */
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    // --- START OF NEW LOGIC ---
    // Filter out parameters with empty, null, or undefined values
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => {
        // Check for null, undefined, and empty string
        return value !== null && value !== undefined && value !== '';
      })
    );

    // Only build the query string if there are any valid parameters left
    if (Object.keys(filteredParams).length > 0) {
      const qs = new URLSearchParams(filteredParams).toString();
      url += `?${qs}`;
    }
    // --- END OF NEW LOGIC ---
  }

  /* ---------- Headers ---------- */
  const headers: HeadersInit = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  // Handle token based on its type
  if (token === true) {
    // If token is true, get it from cookies
    const authToken = await getAuthToken();
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`;
    }
  } else if (typeof token === 'string' && token) {
    // If token is a string, use it directly
    headers.Authorization = `Bearer ${token}`;
  }
  // If token is false or undefined, don't include any Authorization header

  /* ---------- Fetch ---------- */
  const res = await fetch(url, {
    method,
    headers,
    body: data
      ? isFormData
        ? data
        : JSON.stringify(data)
      : undefined,
    cache,
    next: revalidate ? { revalidate } : undefined,
  });

  /* ---------- Error Handling ---------- */
  if (!res.ok) {
    throw {
      status: res.status,
      message: await res.text(),
    };
  }

  /* ---------- Response ---------- */
  return res.json();
}

/* ===============================
   CRUD METHODS
================================ */
export const api = {
  get: <T>(
    endpoint: string,
    options?: {
      params?: any;
      cache?: RequestCache;
      revalidate?: number;
      token?: boolean | string;
    }
  ) =>
    request<T>({
      endpoint,
      method: 'GET',
      ...options,
    }),

  post: <T>(
    endpoint: string,
    data?: any,
    options?: {
      isFormData?: boolean;
      token?: boolean | string;
    }
  ) =>
    request<T>({
      endpoint,
      method: 'POST',
      data,
      ...options,
    }),

  put: <T>(
    endpoint: string,
    data?: any,
    options?: {
      token?: boolean | string;
    }
  ) =>
    request<T>({
      endpoint,
      method: 'PUT',
      data,
      ...options,
    }),

  patch: <T>(
    endpoint: string,
    data?: any,
    options?: {
      token?: boolean | string;
    }
  ) =>
    request<T>({
      endpoint,
      method: 'PATCH',
      data,
      ...options,
    }),

  delete: <T>(
    endpoint: string,
    options?: {
      token?: boolean | string;
    }
  ) =>
    request<T>({
      endpoint,
      method: 'DELETE',
      ...options,
    }),
};
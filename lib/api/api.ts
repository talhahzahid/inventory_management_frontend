import { getAuthToken } from "@/lib/auth";

// export const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:9000/api/v1";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://inventory-management-backend-y0vo.onrender.com/api/v1";

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRequestOptions = {
  endpoint: string;
  method?: ApiMethod;
  body?: unknown;
  headers?: Record<string, string>;
  /** Set false for public routes like login. Token is attached automatically when available. */
  auth?: boolean;
};

type ApiResponseWrapper<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
) {
  return error instanceof Error ? error.message : fallback;
}

function buildUrl(endpoint: string) {
  if (endpoint.startsWith("http")) {
    return endpoint;
  }

  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
}

export async function apiRequest<T>({
  endpoint,
  method = "GET",
  body,
  headers = {},
  auth = true,
}: ApiRequestOptions): Promise<T> {
  const isFormData = body instanceof FormData;
  console.log("IS FORMDATA:", body instanceof FormData);

  const requestHeaders: Record<string, string> = {
    ...headers,
  };

  if (!isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getAuthToken();

    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(buildUrl(endpoint), {
    method,
    headers: requestHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new ApiError(
      result.message || "Request failed",
      result.statusCode || response.status,
    );
  }

  return result.data;
}

// export async function apiRequest<T>({
//   endpoint,
//   method = "GET",
//   body,
//   headers = {},
//   auth = true,
// }: ApiRequestOptions): Promise<T> {
//   const isFormData = body instanceof FormData;

//   // const requestHeaders: Record<string, string> = {
//   //   "Content-Type": "application/json",
//   //   ...headers,
//   // };

//   const requestHeaders: Record<string, string> = {
//     ...headers,
//   };

//   if (!isFormData) {
//     requestHeaders["Content-Type"] = "application/json";
//   }

//   if (auth) {
//     const token = getAuthToken();
//     if (token) {
//       requestHeaders.Authorization = `Bearer ${token}`;
//     }
//   }

//   const response = await fetch(buildUrl(endpoint), {
//     method,
//     headers: requestHeaders,
//     // body: body !== undefined ? JSON.stringify(body) : undefined,
//      body: body
//       ? isFormData
//         ? body
//         : JSON.stringify(body)
//       : undefined,
//   });

//   let result: ApiResponseWrapper<T>;

//   try {
//     result = await response.json();
//   } catch {
//     throw new ApiError("Invalid response from server", response.status);
//   }

//   if (!response.ok) {
//     throw new ApiError(
//       result.message || "Request failed",
//       result.statusCode || response.status,
//     );
//   }

//   if (result.statusCode >= 400) {
//     throw new ApiError(result.message || "Request failed", result.statusCode);
//   }

//   return result.data;
// }

// // src/features/api/baseApi.js
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import Cookies from "js-cookie";

// export const baseApi = createApi({
//   baseQuery: fetchBaseQuery({
//     // baseUrl: process.env.NEXT_PUBLIC_API_URL || "",
//     // baseUrl: "http://206.162.244.131:5400/api/v1",
//     baseUrl: "http://206.162.244.134:8090/api/v1/",
//     credentials: "include",
//     prepareHeaders: (headers) => {
//       const token = Cookies?.get("token");
//       console.log("Token from prepareHeaders:", token);
//       if (token) {
//         // headers.set("Authorization", `${token}`);
//         headers.set("authorization", `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   endpoints: () => ({}),
//   tagTypes: ["User"],
// });

// // Export hooks for usage in functional components
// export default baseApi;

// src/features/api/baseApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import Cookies from "js-cookie";

/**
 * Base Query
 */
const baseQuery = fetchBaseQuery({
  baseUrl: "http://206.162.244.134:8090/api/v1/",
  credentials: "include",

  prepareHeaders: (headers) => {
    const accessToken = Cookies.get("token");

    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

/**
 * Base Query With Auto Re-Authentication
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // If unauthorized → try refresh token
  if (result?.error?.status === 401) {
    const refreshToken = Cookies.get("refreshToken");

    // If no refresh token → logout
    if (!refreshToken) {
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      return result;
    }

    // Call refresh endpoint
    const refreshResult = await baseQuery(
      {
        url: "auth/refresh-token",
        method: "POST",
        body: {
          refreshToken: refreshToken,
        },
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const newAccessToken = (refreshResult.data as any)?.data?.accessToken;

      if (newAccessToken) {
        // Save new token
        Cookies.set("token", newAccessToken);

        // Retry original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // If refresh response structure invalid
        Cookies.remove("token");
        Cookies.remove("refreshToken");
      }
    } else {
      // Refresh failed → clear tokens
      Cookies.remove("token");
      Cookies.remove("refreshToken");
    }
  }

  return result;
};

/**
 * Create API
 */
export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Meeting"],
  endpoints: () => ({}),
});

export default baseApi;
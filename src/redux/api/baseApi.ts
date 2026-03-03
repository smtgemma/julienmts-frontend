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
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const baseQuery = fetchBaseQuery({
  // baseUrl: "http://206.162.244.134:8090/api/v1/",
  baseUrl: "https://0227-103-174-189-65.ngrok-free.app/api/v1",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = Cookies?.get("token");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// ✅ Properly Typed baseQueryWithReauth
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      {
        url: "auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      const newToken = (refreshResult.data as any)?.accessToken;

      Cookies.set("token", newToken);

      result = await baseQuery(args, api, extraOptions);
    } else {
      Cookies.remove("token");
    }
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Meeting"],
  endpoints: () => ({}),
});

export default baseApi;
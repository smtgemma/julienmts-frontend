

// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type {
//   BaseQueryFn,
//   FetchArgs,
//   FetchBaseQueryError,
// } from "@reduxjs/toolkit/query";
// import Cookies from "js-cookie";

// /**
//  * Base Query
//  */
// const baseQuery = fetchBaseQuery({
//   // baseUrl: "http://206.162.244.134:8090/api/v1/",
//   // baseUrl: "http://206.162.244.131:8092/api/v1",
//   // baseUrl: "http://206.162.244.134:8092/api/v1",
//   baseUrl: "https://api-julientmts.aiteamtwo.com/api/v1",
//   credentials: "include",

//   prepareHeaders: (headers) => {
//     const accessToken = Cookies.get("token");

//     if (accessToken) {
//       headers.set("authorization", `Bearer ${accessToken}`);
//     }

//     return headers;
//   },
// });

// /**
//  * Base Query With Auto Re-Authentication
//  */
// const baseQueryWithReauth: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   // If unauthorized → try refresh token
//   if (result?.error?.status === 401) {
//     const refreshToken = Cookies.get("refreshToken");

//     // If no refresh token → logout
//     if (!refreshToken) {
//       Cookies.remove("token");
//       Cookies.remove("refreshToken");
//       return result;
//     }

//     // Call refresh endpoint
//     const refreshResult = await baseQuery(
//       {
//         url: "auth/refresh-token",
//         method: "POST",
//         body: {
//           refreshToken: refreshToken,
//         },
//       },
//       api,
//       extraOptions
//     );

//     if (refreshResult?.data) {
//       const newAccessToken = (refreshResult.data as any)?.data?.accessToken;

//       if (newAccessToken) {
//         // Save new token
//         Cookies.set("token", newAccessToken);

//         // Retry original request
//         result = await baseQuery(args, api, extraOptions);
//       } else {
//         // If refresh response structure invalid
//         Cookies.remove("token");
//         Cookies.remove("refreshToken");
//       }
//     } else {
//       // Refresh failed → clear tokens
//       Cookies.remove("token");
//       Cookies.remove("refreshToken");
//     }
//   }

//   return result;
// };

// /**
//  * Create API
//  */
// export const baseApi = createApi({
//   reducerPath: "baseApi",
//   baseQuery: baseQueryWithReauth,
//   tagTypes: ["User", "Meeting", "Subscripton", "MyAccount", "Notification"],
//   endpoints: () => ({}),
// });

// export default baseApi;





// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type {
//   BaseQueryFn,
//   FetchArgs,
//   FetchBaseQueryError,
// } from "@reduxjs/toolkit/query";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";

// /**
//  * Base Query
//  */
// const baseQuery = fetchBaseQuery({
//   // baseUrl: "http://206.162.244.134:8090/api/v1/",
//   // baseUrl: "http://206.162.244.131:8092/api/v1",
//   // baseUrl: "http://206.162.244.134:8092/api/v1",
//   baseUrl: "https://api-julientmts.aiteamtwo.com/api/v1",
//   credentials: "include",

//   prepareHeaders: (headers) => {
//     const accessToken = Cookies.get("token");

//     if (accessToken) {
//       headers.set("authorization", `Bearer ${accessToken}`);
//     }

//     return headers;
//   },
// });

// /**
//  * Base Query With Auto Re-Authentication
//  */
// const baseQueryWithReauth: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   // If unauthorized → try refresh token
//   if (result?.error?.status === 401) {
//     const refreshToken = Cookies.get("refreshToken");
//     const router = useRouter();

//     // If no refresh token → logout
//     if (!refreshToken) {
//       Cookies.remove("token");
//       Cookies.remove("refreshToken");
//       // window.location.href = "/signIn";
//       router.push('/')
//       return result;
//     }

//     // Call refresh endpoint
//     const refreshResult = await baseQuery(
//       {
//         url: "auth/refresh-token",
//         method: "POST",
//         body: {
//           refreshToken: refreshToken,
//         },
//       },
//       api,
//       extraOptions
//     );

//     if (refreshResult?.data) {
//       const newAccessToken = (refreshResult.data as any)?.data?.accessToken;

//       if (newAccessToken) {
//         // Save new token
//         Cookies.set("token", newAccessToken);
//         // Cookies.set("token", newAccessToken, {
//         //   domain: ".aiteamtwo.com",
//         //   secure: true,
//         //   sameSite: "None",
//         // });

//         // Retry original request
//         result = await baseQuery(args, api, extraOptions);
//       } else {
//         // If refresh response structure invalid
//         Cookies.remove("token");
//         Cookies.remove("refreshToken");
//         // window.location.href = "/signIn";
//         router.push('/')
//         // Cookies.remove("token", {
//         //   domain: ".aiteamtwo.com",
//         // });
//         // Cookies.remove("refreshToken", {
//         //   domain: ".aiteamtwo.com",
//         // });
//       }
//     } else {
//       // Refresh failed → clear tokens
//       Cookies.remove("token");
//       Cookies.remove("refreshToken");
//       // window.location.href = "/signIn"; 
//       router.push('/')
//       // Cookies.remove("token", {
//       //   domain: ".aiteamtwo.com",
//       // });
//       // Cookies.remove("refreshToken", {
//       //   domain: ".aiteamtwo.com",
//       // });
//     }
//   }

//   return result;
// };

// /**
//  * Create API
//  */
// export const baseApi = createApi({
//   reducerPath: "baseApi",
//   baseQuery: baseQueryWithReauth,
//   tagTypes: ["User", "Meeting", "Subscripton", "MyAccount", "Notification"],
//   endpoints: () => ({}),
// });

// export default baseApi;


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import Cookies from "js-cookie";

/**
 * Logout Helper
 */
const logout = () => {
  Cookies.remove("token");
  Cookies.remove("refreshToken");
};

/**
 * Base Query
 */
const baseQuery = fetchBaseQuery({
  // baseUrl: "https://api-julientmts.aiteamtwo.com/api/v1",
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://api-julientmts.aiteamtwo.com/api/v1",
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

  // 👉 If unauthorized → try refresh token
  if (result?.error?.status === 401) {
    const refreshToken = Cookies.get("refreshToken");

    // ❌ No refresh token → logout
    if (!refreshToken) {
      logout();
      return result;
    }

    // 👉 Call refresh endpoint (IMPORTANT: no auth header)
    const refreshResult = await fetchBaseQuery({
      baseUrl: "https://api-julientmts.aiteamtwo.com/api/v1",
      credentials: "include",
    })(
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

    // 👉 Debug (optional)
    console.log("Refresh Result:", refreshResult);

    if (refreshResult?.data) {
      const newAccessToken = (refreshResult.data as any)?.data?.accessToken;

      if (newAccessToken) {
        // ✅ Save new token
        Cookies.set("token", newAccessToken, {
          secure: true,
          sameSite: "strict",
        });

        // ✅ Retry original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        logout();
      }
    } else {
      // ❌ Refresh failed
      logout();
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
  tagTypes: ["User", "Meeting", "Subscripton", "MyAccount", "Notification"],
  endpoints: () => ({}),
});

export default baseApi;
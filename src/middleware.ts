// import { jwtDecode } from "jwt-decode"; // Ensure proper import for jwtDecode
// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   // Get token from cookies
//   const token = request.cookies.get("accessToken")?.value;
//   if (!token) {
//     // Redirect to home if no token is present
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // Decode token to get user info
//   let userInfo: { role?: string; exp: number };
//   try {
//     userInfo = jwtDecode(token as string) as { role?: string; exp: number };
//     if (userInfo.exp && userInfo.exp * 1000 < Date.now()) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   } catch (error) {
//     if (error) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//     return;
//   }
//   const currentPath = request.nextUrl.pathname;

//   // Restrict access to admin paths if user is not an ADMIN
//   if (
//     currentPath.startsWith("/dashboard/home") &&
//     userInfo?.role !== "USER"
//   ) {
//     return NextResponse.redirect(new URL("/signIn", request.url));
//   }

//   // Allow the request to proceed
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/home"], // Apply middleware to all routes
// };


// import { jwtDecode } from "jwt-decode";
// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;
//   // console.log("Middleware token:=============", token);

//   // ❌ No token → redirect to signIn
//   if (!token) {
//     return NextResponse.redirect(new URL("/signIn", request.url));
//   }

//   let userInfo: { role?: string; exp: number };

//   try {
//     userInfo = jwtDecode(token) as { role?: string; exp: number };

//     // ❌ Token expired → redirect
//     if (userInfo.exp * 1000 < Date.now()) {
//       return NextResponse.redirect(new URL("/signIn", request.url));
//     }
//   } catch (error) {
//     // ❌ Invalid token → redirect
//     return NextResponse.redirect(new URL("/signIn", request.url));
//   }

//   const currentPath = request.nextUrl.pathname;

//   // ❌ If NOT USER → redirect to signIn
//   if (
//     currentPath.startsWith("/dashboard") &&
//     userInfo?.role !== "USER"
//   )
//    {
//     return NextResponse.redirect(new URL("/signIn", request.url));
//   }

//   // ✅ Allow request
//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*"], // all nested routes included
// };




import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const signInUrl = "/signIn";

  // ❌ No token AND no refresh token → redirect to signIn
  // If there's a refresh token, let the app handle it client-side
  if (!token && !refreshToken) {
    return NextResponse.redirect(new URL(signInUrl, request.url));
  }

  // If there's a refresh token but no access token, let the app try to refresh
  if (!token && refreshToken) {
    return NextResponse.next(); // ✅ Let RTK Query handle the refresh
  }

  let userInfo: { role?: string; exp: number };

  try {
    userInfo = jwtDecode(token!);

    // ✅ DON'T check expiry here — let RTK Query handle refresh
    // Only redirect if token is completely malformed (caught below)
  } catch {
    // ❌ Unparseable token — but if refresh token exists, give app a chance
    if (refreshToken) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL(signInUrl, request.url));
  }

  const currentPath = request.nextUrl.pathname;

  // ❌ Role restriction
  if (
    currentPath.startsWith("/dashboard") &&
    userInfo?.role !== "USER"
  ) {
    return NextResponse.redirect(new URL(signInUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};


// solve refresh token problem by this link
// https://claude.ai/chat/a6a57ead-d120-4025-8f85-bd77c8e3108e 
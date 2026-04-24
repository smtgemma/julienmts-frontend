

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





// import { jwtDecode } from "jwt-decode";
// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;
//   const refreshToken = request.cookies.get("refreshToken")?.value;

//   const currentPath = request.nextUrl.pathname;
//   const signInUrl = "/signIn";

//   // ✅ Only run logic for dashboard
//   if (!currentPath.startsWith("/dashboard")) {
//     return NextResponse.next(); // 🔥 VERY IMPORTANT
//   }

//   // ❌ No token + no refresh
//   if (!token && !refreshToken) {
//     return NextResponse.redirect(new URL(signInUrl, request.url));
//   }

//   // ✅ Let refresh happen
//   if (!token && refreshToken) {
//     return NextResponse.next();
//   }

//   try {
//     const userInfo: { role?: string } = jwtDecode(token!);

//     if (userInfo?.role !== "USER") {
//       return NextResponse.redirect(new URL(signInUrl, request.url));
//     }
//   } catch {
//     if (!refreshToken) {
//       return NextResponse.redirect(new URL(signInUrl, request.url));
//     }
//   }

//   return NextResponse.next();
// }
// export const config = {
//   matcher: ["/dashboard/:path*"],
// };





// solve refresh token problem by this link
// https://claude.ai/chat/a6a57ead-d120-4025-8f85-bd77c8e3108e 
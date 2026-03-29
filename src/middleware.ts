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


import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  console.log("Middleware token:=============", token);

  // ❌ No token → redirect to signIn
  if (!token) {
    return NextResponse.redirect(new URL("/signIn", request.url));
  }

  let userInfo: { role?: string; exp: number };

  try {
    userInfo = jwtDecode(token) as { role?: string; exp: number };

    // ❌ Token expired → redirect
    if (userInfo.exp * 1000 < Date.now()) {
      return NextResponse.redirect(new URL("/signIn", request.url));
    }
  } catch (error) {
    // ❌ Invalid token → redirect
    return NextResponse.redirect(new URL("/signIn", request.url));
  }

  const currentPath = request.nextUrl.pathname;

  // ❌ If NOT USER → redirect to signIn
  if (
    currentPath.startsWith("/dashboard/home") &&
    userInfo?.role !== "USER"
  )
   {
    return NextResponse.redirect(new URL("/signIn", request.url));
  }

  // ✅ Allow request
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/home/:path*"], // all nested routes included
};


// import { jwtDecode } from "jwt-decode";
// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("token")?.value;

//   console.log("Middleware token:", token);

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

//   const role = userInfo?.role;
//   const currentPath = request.nextUrl.pathname;

//   console.log("ROLE:", role);

//   // ✅ USER → allow dashboard
//   if (role === "USER") {
//     return NextResponse.next();
//   }

//   // ✅ ADMIN / SUPER_ADMIN → redirect to admin panel
//   if (role === "SUPER_ADMINee" || role === "ADMINee") {
//     return NextResponse.redirect(
//       "https://admin-julientmts.aiteamtwo.com/"
//     );
//   }

//   // ❌ অন্য সবাই → signIn
//   return NextResponse.redirect(new URL("/signIn", request.url));
// }
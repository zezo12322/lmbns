import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth"

const protectedPaths = [
  "/admin",
  "/dashboard",
  "/cases",
  "/households",
  "/people",
  "/volunteers",
  "/programs",
  "/trainings",
  "/settings",
  "/cms",
  "/news-cms"
]

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  
  const isProtectedPath = protectedPaths.some((path) =>
    nextUrl.pathname.startsWith(path)
  )

  if (isProtectedPath && !isLoggedIn) {
    let from = nextUrl.pathname;
    if (nextUrl.search) from += nextUrl.search;
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, nextUrl)
    )
  }

  return NextResponse.next()
})

// Options for regex matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

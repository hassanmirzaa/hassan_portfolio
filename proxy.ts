import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Refreshes the Supabase session cookie and bounces logged-out visitors away from /admin.
// This is only a fast, optimistic check. Every admin page and action re-checks with requireAdmin().
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isLogin = request.nextUrl.pathname.startsWith("/admin/login")
  if (!url || !key) return isLogin ? response : NextResponse.redirect(new URL("/admin/login?e=config", request.url))

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })
  const { data } = await supabase.auth.getUser()
  if (!data.user && !isLogin) return NextResponse.redirect(new URL("/admin/login", request.url))
  if (data.user && isLogin && !request.nextUrl.searchParams.get("e")) return NextResponse.redirect(new URL("/admin", request.url))
  response.headers.set("Cache-Control", "no-store")
  response.headers.set("X-Robots-Tag", "noindex, nofollow")
  return response
}

export const config = { matcher: ["/admin/:path*"] }

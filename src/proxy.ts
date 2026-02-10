import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })


  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const isAuthRoute =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/sign-up";

  if (isAuthRoute) {
    const { data } = await supabase.auth.getUser()

    const user = data?.user;
    if (user) {
      return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL));
    }
  }

  const { searchParams, pathname } = new URL(request.url);

  if (!searchParams.get("betId") && pathname === "/") {
    const { data } = await supabase.auth.getUser()

    const user = data?.user;

    if (user) {
      const { newestBetId } = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-newest-bet?userId=${user.id}`).then((res) => res.json());

      if (newestBetId) {
        const url = request.nextUrl.clone();
        url.searchParams.set("betId", newestBetId);
        return NextResponse.redirect(url);
      } else {
        const { betId } = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/create-new-bet?userId=${user.id}`,
          {
            method: "POST",
          }
        ).then((res) => res.json());

        const url = request.nextUrl.clone();
        url.searchParams.set("betId", betId);
        return NextResponse.redirect(url);
      }
    }
  }

  // const { data } = await supabase.auth.getUser()

  // const user = data?.user;

  return supabaseResponse
}
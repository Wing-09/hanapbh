import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const exit = request.nextUrl.searchParams.get("exit");
  const pathname = request.nextUrl.pathname;
  const client_url = process.env.CLIENT_URL;
  if (!client_url)
    throw new Error("CLIENT_URL is missing from your .env.local file");
  try {
    const token = await getToken({ req: request });

    console.log(pathname.startsWith("/hosting") && !token);
    if (pathname.startsWith("/hosting") && !token) {
      NextResponse.json({ message: "user unauthenticated" }, { status: 401 });
      return NextResponse.redirect(
        client_url + "/login?exit=" + exit + "&cb_url=" + pathname
      );
    }
    if (
      (pathname.startsWith("/login") || pathname.startsWith("/signup")) &&
      token
    ) {
      return NextResponse.redirect(client_url + (exit ? exit : "/nearby"));
    }
  } catch (error) {
    throw error;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

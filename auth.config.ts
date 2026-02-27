import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnUserDashboard = /^\/[^/]+\/dashboard(?:\/.*)?$/.test(
        nextUrl.pathname,
      );

      if (
        isLoggedIn &&
        (nextUrl.pathname === "/login" || nextUrl.pathname === "/signin")
      ) {
        const userId = auth.user?.id;
        const target = userId ? `/${userId}/dashboard` : "/";
        return Response.redirect(new URL(target, nextUrl));
      }

      if (isLoggedIn && isOnUserDashboard) {
        const pathUserId = nextUrl.pathname.split("/")[1];
        const sessionUserId = auth.user?.id;
        if (sessionUserId && pathUserId !== sessionUserId) {
          return Response.redirect(
            new URL(`/${sessionUserId}/dashboard`, nextUrl),
          );
        }
      }

      if (isOnUserDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      if (isLoggedIn) {
        const userId = auth?.user?.id;
        const target = userId ? `/${userId}/dashboard` : "/login";
        return Response.redirect(new URL(target, nextUrl));
      }

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

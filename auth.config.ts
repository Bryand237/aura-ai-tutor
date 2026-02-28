import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage =
        nextUrl.pathname === "/login" || nextUrl.pathname === "/signin";
      const isOnUserDashboard = /^\/[^/]+\/dashboard(?:\/.*)?$/.test(
        nextUrl.pathname,
      );

      if (isAuthPage) return true;

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

      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;

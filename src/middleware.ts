export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*"], // ✅ only protect dashboard pages
};

import { cookies } from "next/headers";

const COOKIE = "slidexl_admin_session";
const TOKEN = "slidexl-admin-ok";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "slidexl-admin";
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(COOKIE)?.value === TOKEN;
}

export function adminCookieOptions(maxAge = 60 * 60 * 24 * 7) {
  return {
    name: COOKIE,
    value: TOKEN,
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function clearAdminCookieOptions() {
  return {
    name: COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminPassword, adminCookieOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = String(body.password || "");
  if (password !== getAdminPassword()) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const jar = await cookies();
  const opts = adminCookieOptions();
  jar.set(opts.name, opts.value, opts);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.set("slidexl_admin_session", "", { httpOnly: true, path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}

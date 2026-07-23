import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getStats } from "@/lib/store";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const stats = await getStats();
  return NextResponse.json(stats);
}

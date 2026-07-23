"use client";

import { useRouter } from "next/navigation";
import type { OrderStatus } from "@/lib/types";

const STATUSES: OrderStatus[] = [
  "pending",
  "paid",
  "fulfilled",
  "cancelled",
  "refunded",
];

export function AdminLogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/login", { method: "DELETE" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="rounded-md border border-purple/20 px-3 py-1.5 text-sm font-semibold text-ink hover:border-purple"
    >
      Log out
    </button>
  );
}

export function OrderStatusSelect({
  id,
  status,
}: {
  id: string;
  status: OrderStatus;
}) {
  const router = useRouter();
  return (
    <select
      defaultValue={status}
      className="rounded border border-purple/20 bg-white px-2 py-1 text-xs font-semibold capitalize"
      onChange={async (e) => {
        await fetch("/api/admin/orders", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: e.target.value }),
        });
        router.refresh();
      }}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

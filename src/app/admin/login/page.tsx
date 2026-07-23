"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const password = String(new FormData(e.currentTarget).get("password") || "");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("Wrong password");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-ink px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-brand"
      >
        <h1 className="font-display text-2xl font-bold text-ink">Admin login</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Shopify-style backend for Slide XL orders & catalogue.
        </p>
        <label className="mt-6 block text-sm font-semibold">
          Password
          <input
            type="password"
            name="password"
            required
            className="mt-1 w-full rounded-md border border-purple/20 px-3 py-2.5"
            autoComplete="current-password"
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-md bg-purple py-3 text-sm font-bold uppercase tracking-wide text-white disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="mt-4 text-xs text-ink-muted">
          Default password: <code>slidexl-admin</code> (override with{" "}
          <code>ADMIN_PASSWORD</code>)
        </p>
      </form>
    </div>
  );
}

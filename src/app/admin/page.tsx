import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { getStats, listOrders, listProducts } from "@/lib/store";
import { formatMoney } from "@/lib/products";
import { AdminLogoutButton, OrderStatusSelect } from "@/components/AdminClient";

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const [stats, orders, products] = await Promise.all([
    getStats(),
    listOrders(),
    listProducts(),
  ]);

  return (
    <div className="min-h-screen bg-[#f4f1f7]">
      <div className="border-b border-purple/10 bg-white">
        <div className="mx-auto flex max-w-content items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-purple">
              Slide XL Admin
            </p>
            <h1 className="font-display text-2xl font-bold text-ink">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-semibold text-ink-muted hover:text-purple">
              View store
            </Link>
            <AdminLogoutButton />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-content space-y-8 px-4 py-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Orders", value: String(stats.orderCount) },
            { label: "Revenue", value: formatMoney(stats.revenue) },
            { label: "To fulfill", value: String(stats.pending) },
            { label: "Fulfilled", value: String(stats.fulfilled) },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-purple/10 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                {s.label}
              </p>
              <p className="mt-2 font-display text-2xl font-bold text-ink">
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <section className="rounded-xl border border-purple/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-bold text-ink">Products</h2>
            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-purple hover:underline"
            >
              All orders →
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-ink-muted">
                <tr>
                  <th className="pb-2 pr-4">Product</th>
                  <th className="pb-2 pr-4">Price</th>
                  <th className="pb-2 pr-4">Compare-at</th>
                  <th className="pb-2 pr-4">Inventory</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-t border-purple/10">
                    <td className="py-3 pr-4 font-semibold">{p.title}</td>
                    <td className="py-3 pr-4">{formatMoney(p.price.amount)}</td>
                    <td className="py-3 pr-4">
                      {formatMoney(p.compareAtPrice.amount)}
                    </td>
                    <td className="py-3 pr-4">{p.inventory}</td>
                    <td className="py-3 capitalize">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-purple/10 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-bold text-ink">Recent orders</h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">No orders yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="text-xs uppercase tracking-wide text-ink-muted">
                  <tr>
                    <th className="pb-2 pr-4">Order</th>
                    <th className="pb-2 pr-4">Customer</th>
                    <th className="pb-2 pr-4">Total</th>
                    <th className="pb-2 pr-4">Market</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 10).map((o) => (
                    <tr key={o.id} className="border-t border-purple/10">
                      <td className="py-3 pr-4 font-semibold">{o.orderNumber}</td>
                      <td className="py-3 pr-4">
                        {o.shippingAddress.firstName}{" "}
                        {o.shippingAddress.lastName}
                        <div className="text-xs text-ink-muted">
                          {o.shippingAddress.email}
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        {formatMoney(o.total.amount)}
                      </td>
                      <td className="py-3 pr-4">{o.market}</td>
                      <td className="py-3">
                        <OrderStatusSelect id={o.id} status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

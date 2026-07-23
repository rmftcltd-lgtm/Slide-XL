import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { listOrders } from "@/lib/store";
import { formatMoney } from "@/lib/products";
import { OrderStatusSelect } from "@/components/AdminClient";

export default async function AdminOrdersPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
  const orders = await listOrders();

  return (
    <div className="min-h-screen bg-[#f4f1f7]">
      <div className="mx-auto max-w-content px-4 py-8 sm:px-6">
        <Link href="/admin" className="text-sm font-semibold text-purple">
          ← Dashboard
        </Link>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">Orders</h1>
        <div className="mt-6 overflow-x-auto rounded-xl border border-purple/10 bg-white p-4 shadow-sm">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-ink-muted">
              <tr>
                <th className="pb-2 pr-4">Order</th>
                <th className="pb-2 pr-4">Date</th>
                <th className="pb-2 pr-4">Customer</th>
                <th className="pb-2 pr-4">Ship to</th>
                <th className="pb-2 pr-4">Total</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-purple/10 align-top">
                  <td className="py-3 pr-4 font-semibold">{o.orderNumber}</td>
                  <td className="py-3 pr-4 text-ink-muted">
                    {new Date(o.createdAt).toLocaleString("en-US")}
                  </td>
                  <td className="py-3 pr-4">
                    {o.shippingAddress.firstName} {o.shippingAddress.lastName}
                    <div className="text-xs text-ink-muted">
                      {o.shippingAddress.email}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-ink-muted">
                    {o.shippingAddress.city}, {o.shippingAddress.state}{" "}
                    {o.shippingAddress.postalCode}
                  </td>
                  <td className="py-3 pr-4">{formatMoney(o.total.amount)}</td>
                  <td className="py-3">
                    <OrderStatusSelect id={o.id} status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="py-8 text-center text-ink-muted">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

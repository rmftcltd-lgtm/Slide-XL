import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/store";
import { formatMoney } from "@/lib/products";

type Props = { params: Promise<{ id: string }> };

export default async function OrderConfirmationPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const addr = order.shippingAddress;

  return (
    <div className="bg-aussie-wash min-h-[70vh] py-16">
      <div className="mx-auto max-w-xl px-4 text-center sm:px-6">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-ocean">
          Order confirmed
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink">
          Crikey — it&apos;s on the way!
        </h1>
        <p className="mt-4 text-ink-muted">
          Thanks {addr.firstName}. Order{" "}
          <span className="font-semibold text-ink">{order.orderNumber}</span> is
          locked in. We&apos;ll email {addr.email} with shipping updates.
        </p>

        <div className="mt-10 rounded-2xl border border-purple/15 bg-white p-6 text-left shadow-brand">
          <h2 className="font-display text-lg font-bold text-ink">Summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {order.items.map((item) => (
              <li key={item.productId} className="flex justify-between">
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span className="font-semibold">
                  {formatMoney(item.unitPrice.amount * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-purple/10 pt-4 font-display text-xl font-bold text-purple">
            <span>Total</span>
            <span>{formatMoney(order.total.amount)}</span>
          </div>
          <p className="mt-4 text-sm text-ink-muted">
            Ship to: {addr.line1}
            {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state}{" "}
            {addr.postalCode}, {addr.country}
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-md bg-purple px-5 py-3 text-sm font-bold uppercase tracking-wide text-white"
        >
          Back to Slide XL
        </Link>
      </div>
    </div>
  );
}

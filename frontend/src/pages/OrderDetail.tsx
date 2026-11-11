import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Package, CreditCard, AlertCircle } from "lucide-react";
import { getOrderById } from "@/api/orders";
import type { Order } from "@/types";

export function OrderDetail() {
  const { id } = useParams();
  const orderId = id ?? "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });

  const order = data?.data as Order | undefined;

  if (isLoading) {
    return (
      <div className="container-page py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="shimmer h-80 rounded-2xl" />
          <div className="shimmer h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-200"><AlertCircle size={26} /></div>
        <h2 className="text-xl font-bold text-foreground">Order not found</h2>
        <Link to="/orders" className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700">
          <ArrowLeft size={16} /> Back to orders
        </Link>
      </div>
    );
  }

  const statusLabel = order.isDelivered ? "Delivered" : order.isPaid ? "Paid" : "Pending";
  const statusCls = order.isDelivered ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : order.isPaid ? "bg-amber-50 text-amber-700 ring-amber-200" : "bg-red-50 text-red-700 ring-red-200";

  return (
    <div className="bg-mesh min-h-full">
      <div className="container-page py-10">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/orders" className="inline-flex items-center gap-1 hover:text-foreground"><ArrowLeft size={14} /> Orders</Link>
          <span>/</span>
          <span className="font-medium text-foreground">Order #{order._id.slice(-6).toUpperCase()}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Order items</h2>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusCls}`}>{statusLabel}</span>
            </div>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.product} className="flex items-center gap-4 border-b border-border pb-4 last:border-b-0 last:pb-0">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground"><Package size={20} /></div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">${item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Order summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Items</span><span>${order.itemsPrice.toFixed(2)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>${order.shippingPrice.toFixed(2)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-bold text-foreground"><span>Total</span><span>${order.totalPrice.toFixed(2)}</span></div>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Payment</h3>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground"><CreditCard size={16} className="text-indigo-600" /> {order.paymentMethod}</div>
              <p className={`mt-1 text-sm font-semibold ${order.isPaid ? "text-emerald-600" : "text-red-600"}`}>{order.isPaid ? "Paid" : "Pending"}</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Shipping address</h3>
              <p className="text-sm leading-relaxed text-foreground">
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Order date</h3>
              <p className="text-sm text-foreground">{new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

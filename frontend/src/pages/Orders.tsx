import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Package, ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { getMyOrders } from "@/api/orders";
import type { Order } from "@/types";

function statusInfo(order: Order) {
  if (order.isDelivered) return { label: "Delivered", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" };
  if (order.isPaid) return { label: "Paid", cls: "bg-amber-50 text-amber-700 ring-amber-200" };
  return { label: "Pending", cls: "bg-red-50 text-red-700 ring-red-200" };
}

export function Orders() {
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ["my-orders"], queryFn: () => getMyOrders() });
  const orders: Order[] = Array.isArray(data?.data) ? data.data : [];

  if (isLoading) {
    return (
      <div className="container-page py-10">
        <div className="shimmer mb-6 h-10 w-48 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <div key={i} className="shimmer h-56 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-200"><AlertCircle size={26} /></div>
        <h2 className="text-xl font-bold text-foreground">Failed to load orders</h2>
        <button onClick={() => refetch()} className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700">
          <RefreshCw size={16} /> Try again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-mesh flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100"><Package size={34} /></div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">No orders yet</h2>
        <p className="mt-2 text-sm text-muted-foreground">Your order history will appear here once you place an order.</p>
        <Link to="/" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-700">
          Start shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-mesh min-h-full">
      <div className="container-page py-10">
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-foreground">My orders</h1>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => {
            const st = statusInfo(order);
            return (
              <div key={order._id} className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <div className="text-sm font-semibold text-foreground">Order #{order._id.slice(-6).toUpperCase()}</div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${st.cls}`}>{st.label}</span>
                </div>
                <div className="flex flex-1 items-center gap-4 px-5 py-4">
                  <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                    {order.items[0]?.imageUrl ? (
                      <img src={order.items[0].imageUrl} alt={order.items[0]?.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground"><Package size={20} /></div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{order.items[0]?.name}</p>
                    {order.items.length > 1 && <p className="mt-0.5 text-xs text-muted-foreground">+{order.items.length - 1} more item{order.items.length > 2 ? "s" : ""}</p>}
                  </div>
                </div>
                <div className="flex items-center justify-between px-5 text-sm text-muted-foreground">
                  <span>{new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>
                  <span className="text-base font-bold text-foreground">${order.totalPrice.toFixed(2)}</span>
                </div>
                <div className="mt-4 border-t border-border p-4">
                  <Link to={`/orders/${order._id}`} className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100">
                    View details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

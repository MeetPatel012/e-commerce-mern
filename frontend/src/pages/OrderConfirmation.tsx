import { Link, useLocation } from "react-router-dom";
import { CheckCircle2, ArrowRight, Package, CreditCard, Clock } from "lucide-react";

export function OrderConfirmation() {
  const location = useLocation();
  const state = location.state as { order?: any; total?: number } | undefined;
  const order = state?.order;
  const total = state?.total ?? 0;

  return (
    <div className="bg-mesh flex min-h-full items-center justify-center px-4 py-12">
      <div className="animate-fade-in-up w-full max-w-xl text-center">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200">
          <CheckCircle2 size={40} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Order placed</h1>
        <p className="mt-2 text-sm text-muted-foreground">Thank you for your purchase. We're getting your order ready.</p>

        {order && (
          <div className="mt-8 rounded-2xl border border-border bg-white p-6 text-left shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Package size={18} className="text-indigo-600" />
              <span className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Order #{order._id?.slice(-6)?.toUpperCase() ?? "N/A"}</span>
            </div>
            <div className="space-y-4 text-sm">
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Shipping address</div>
                <p className="text-foreground">
                  {order.shippingAddress?.address}<br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                  {order.shippingAddress?.country}
                </p>
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment</div>
                <div className="flex items-center gap-2 text-foreground"><CreditCard size={15} className="text-indigo-600" /> {order.paymentMethod ?? "Card"}</div>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-4 text-base font-bold text-foreground">
                <span>Total paid</span>
                <span>${total?.toFixed(2) ?? order.totalPrice?.toFixed(2) ?? "0.00"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                <Clock size={14} /> Estimated delivery: 3-5 business days
              </div>
            </div>
          </div>
        )}

        <Link to="/orders" className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700">
          View my orders <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

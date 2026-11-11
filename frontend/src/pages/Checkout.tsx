import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getCart } from "@/api/cart";
import { createOrder } from "@/api/orders";
import { MapPin, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";

export function Checkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ["cart"], queryFn: () => getCart() });

  const response = data as {
    data?: { items?: { product: { _id?: string; name?: string; price?: number; imageUrl?: string }; quantity: number }[] };
  } | undefined;
  const items = Array.isArray(response?.data?.items) ? response!.data!.items! : [];
  const total = items.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0);

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["my-orders"] });
      navigate("/order-confirmation", { state: { order: res.data, total } });
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to place order"
          : "Failed to place order";
      toast.error(message);
      setLoading(false);
    },
  });

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !city || !postalCode || !country) {
      toast.error("Please fill in all shipping details");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setLoading(true);
    createOrderMutation.mutate({
      shippingAddress: { address, city, postalCode, country },
      paymentMethod,
      itemsPrice: total,
      shippingPrice: 0,
      taxPrice: 0,
      totalPrice: total,
    });
  };

  if (isLoading) {
    return (
      <div className="container-page py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="shimmer h-96 rounded-2xl" />
          <div className="shimmer h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-mesh flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
          <ShoppingBag size={34} />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">Your cart is empty</h2>
        <p className="mt-2 text-sm text-muted-foreground">Add some items before checkout.</p>
        <Link to="/" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-700">
          <ShoppingCart size={16} /> Continue shopping
        </Link>
      </div>
    );
  }

  const inputClass = "h-11 w-full rounded-xl border border-border bg-muted/30 px-4 text-sm outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100";

  return (
    <div className="bg-mesh min-h-full">
      <div className="container-page py-10">
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-foreground">Checkout</h1>
        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <MapPin size={18} className="text-indigo-600" />
              <h2 className="text-lg font-bold text-foreground">Shipping details</h2>
            </div>
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label htmlFor="address" className="mb-1.5 block text-sm font-semibold text-foreground">Address</label>
                <input id="address" type="text" placeholder="123 Main St" value={address} onChange={(e) => setAddress(e.target.value)} required className={inputClass} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="city" className="mb-1.5 block text-sm font-semibold text-foreground">City</label>
                  <input id="city" type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required className={inputClass} />
                </div>
                <div>
                  <label htmlFor="postalCode" className="mb-1.5 block text-sm font-semibold text-foreground">Postal code</label>
                  <input id="postalCode" type="text" placeholder="12345" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required className={inputClass} />
                </div>
              </div>
              <div>
                <label htmlFor="country" className="mb-1.5 block text-sm font-semibold text-foreground">Country</label>
                <input id="country" type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required className={inputClass} />
              </div>
              <div>
                <label htmlFor="paymentMethod" className="mb-1.5 block text-sm font-semibold text-foreground">Payment method</label>
                <select id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className={inputClass}>
                  <option value="Card">Credit/Debit Card</option>
                  <option value="PayPal">PayPal</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading || createOrderMutation.isPending}
                className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading || createOrderMutation.isPending ? "Processing..." : "Place order"}
                {!loading && !createOrderMutation.isPending && <ArrowRight size={16} />}
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-foreground">Order summary</h2>
            <p className="mt-1 text-sm text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</p>
            <div className="mt-4 space-y-3">
              {items.map((item) => {
                const p = item.product;
                const name = p?.name ?? "";
                const price = p?.price ?? 0;
                return (
                  <div key={p?._id ?? Math.random()} className="flex items-center gap-3 border-b border-border pb-3 last:border-b-0 last:pb-0">
                    {p?.imageUrl && <img src={p.imageUrl} alt={name} className="h-12 w-12 flex-shrink-0 rounded-lg border border-border object-cover" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">${(price * item.quantity).toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span className="font-medium text-emerald-600">Free</span></div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-foreground">Total</span>
                <span className="text-xl font-extrabold tracking-tight text-foreground">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

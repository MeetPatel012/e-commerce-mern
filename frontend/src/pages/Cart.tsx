import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/api/cart";
import { useUpdateCartItem, useRemoveFromCart } from "@/hooks/useCart";
import type { CartItem, Cart } from "@/types";

function CartItemRow({ item }: { item: CartItem }) {
  const updateCart = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const product = item.product;
  const isProduct = product && typeof product === "object" && "price" in product;
  const price = isProduct ? (product as { price: number }).price : 0;
  const subtotal = price * item.quantity;
  const productId = isProduct ? (product as { _id: string })._id : "";
  const stock = isProduct ? (product as { stock?: number }).stock ?? 999 : 999;

  if (!isProduct || !productId) return null;

  return (
    <div className="flex flex-col gap-4 border-b border-border py-5 last:border-b-0 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-4">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
          <img
            src={(product as { imageUrl?: string }).imageUrl || ""}
            alt={(product as { name?: string }).name || "Product"}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground">{(product as { name?: string }).name}</h3>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-muted-foreground">{(product as { category?: string }).category}</p>
          <p className="mt-1 text-sm font-bold text-foreground">${price.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <div className="inline-flex h-9 items-center rounded-lg border border-border bg-muted/40">
          <button
            className="inline-flex h-full w-9 items-center justify-center text-foreground disabled:opacity-40"
            onClick={() => item.quantity > 1 && updateCart.mutate({ productId, quantity: item.quantity - 1 })}
            disabled={item.quantity <= 1 || updateCart.isPending}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
          <button
            className="inline-flex h-full w-9 items-center justify-center text-foreground disabled:opacity-40"
            onClick={() => updateCart.mutate({ productId, quantity: item.quantity + 1 })}
            disabled={updateCart.isPending || item.quantity >= stock}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50"
          onClick={() => removeFromCart.mutate(productId)}
          disabled={removeFromCart.isPending}
          aria-label="Remove item"
        >
          <Trash2 size={14} />
        </button>

        <span className="w-20 text-right text-sm font-bold text-foreground">${subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
}

export function Cart() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
  });

  const response = data as { data?: Cart } | undefined;
  const cart = response?.data ?? null;
  const items: CartItem[] = Array.isArray(cart?.items) ? cart.items : [];
  const total = items.reduce((sum: number, item: CartItem) => {
    const p = item.product;
    const price = p && typeof p === "object" && "price" in p ? (p as { price: number }).price : 0;
    return sum + price * item.quantity;
  }, 0);

  if (isLoading) {
    return (
      <div className="container-page py-10">
        <div className="shimmer mb-6 h-10 w-48 rounded-xl" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="shimmer h-24 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-semibold text-red-600">Failed to load cart</p>
        <button onClick={() => refetch()} className="mt-4 inline-flex h-10 items-center rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700">Retry</button>
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
        <p className="mt-2 text-sm text-muted-foreground">Discover products you'll love.</p>
        <Link to="/" className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white hover:bg-indigo-700">
          <ShoppingCart size={16} /> Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-mesh min-h-full">
      <div className="container-page py-10">
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-foreground">
          Your cart <span className="text-lg font-medium text-muted-foreground">({items.length} item{items.length !== 1 ? "s" : ""})</span>
        </h1>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="rounded-2xl border border-border bg-white px-5 shadow-sm sm:px-6">
            {items.map((item: CartItem) => (
              <CartItemRow key={(item.product as { _id?: string })?._id ?? Math.random()} item={item} />
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-lg font-bold text-foreground">Order summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span><span className="font-medium text-emerald-600">Free</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-2xl font-extrabold tracking-tight text-foreground">${total.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Proceed to checkout <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

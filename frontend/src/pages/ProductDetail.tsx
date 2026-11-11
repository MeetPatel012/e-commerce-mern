import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ShoppingCart, Minus, Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { getProductById } from "@/api/products";
import { useAddToCart } from "@/hooks/useCart";
import type { Product } from "@/types";
import { useAuth } from "@/hooks/useAuth";

export function ProductDetail() {
  const { id } = useParams();
  const productId = id ?? "";
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();
  const { isAuthenticated } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId,
  });

  const product = data?.data as Product | undefined;

  if (isLoading) {
    return (
      <div className="container-page py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="shimmer aspect-square rounded-2xl" />
          <div className="space-y-4">
            <div className="shimmer h-6 w-24 rounded" />
            <div className="shimmer h-10 w-3/4 rounded" />
            <div className="shimmer h-8 w-32 rounded" />
            <div className="shimmer h-24 w-full rounded-xl" />
            <div className="shimmer h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-200">
          <AlertCircle size={26} />
        </div>
        <h2 className="text-xl font-bold text-foreground">Product not found</h2>
        <Link to="/" className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700">
          <ArrowLeft size={16} /> Back to shop
        </Link>
      </div>
    );
  }

  const isInStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add to cart");
      return;
    }
    addToCart.mutate({ productId: product._id, quantity });
  };

  return (
    <div className="bg-mesh min-h-full">
      <div className="container-page py-10">
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground"><ArrowLeft size={14} /> Shop</Link>
          <span>/</span>
          <span className="truncate font-medium text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="aspect-square bg-muted">
              <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
            </div>
            {lowStock && (
              <span className="absolute left-4 top-4 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                Only {product.stock} left
              </span>
            )}
            {!isInStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/75">
                <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-muted-foreground ring-1 ring-border">Out of stock</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
                {product.category}
              </span>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">{product.name}</h1>
              <p className="mt-3 text-2xl font-bold text-foreground">${product.price.toFixed(2)}</p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Availability</div>
              <div className={`text-sm font-semibold ${isInStock ? "text-emerald-600" : "text-red-600"}`}>
                {isInStock ? `${product.stock} in stock` : "Out of stock"}
              </div>
              <div className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</div>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                {product.description || "No description available."}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
              <div className="mb-3 text-sm font-semibold text-foreground">Quantity</div>
              <div className="mb-4 inline-flex h-11 items-center rounded-lg border border-border bg-muted/40">
                <button
                  className="inline-flex h-full w-11 items-center justify-center text-foreground disabled:opacity-40"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="min-w-10 text-center text-sm font-semibold">{quantity}</span>
                <button
                  className="inline-flex h-full w-11 items-center justify-center text-foreground disabled:opacity-40"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              {!isAuthenticated ? (
                <button
                  onClick={() => toast.error("Please login to add to cart")}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                >
                  <ShoppingCart size={16} /> Login to add to cart
                </button>
              ) : !isInStock ? (
                <button disabled className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-muted text-sm font-semibold text-muted-foreground">
                  Out of stock
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  disabled={addToCart.isPending}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  <ShoppingCart size={16} />
                  {addToCart.isPending ? "Adding..." : "Add to cart"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

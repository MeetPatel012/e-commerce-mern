import { Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { useAddToCart, useUpdateCartItem, useRemoveFromCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/api/cart";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart();
  const updateCart = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const { isAuthenticated } = useAuth();

  const { data } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
    enabled: isAuthenticated,
  });

  const cart =
    data && typeof data === "object" && "data" in data
      ? (data as { data?: { items?: { product: { _id: string }; quantity: number }[] } }).data
      : null;
  const cartItem = cart?.items?.find(
    (item) => (item.product as { _id?: string })?._id === product._id
  );
  const quantityInCart = cartItem?.quantity ?? 0;

  const handleIncrement = () => {
    updateCart.mutate({ productId: product._id, quantity: quantityInCart + 1 });
  };

  const handleDecrement = () => {
    if (quantityInCart <= 1) {
      removeFromCart.mutate(product._id);
    } else {
      updateCart.mutate({ productId: product._id, quantity: quantityInCart - 1 });
    }
  };

  return (
    <div className="card-hover flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <Link to={`/product/${product._id}`} className="flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-700 shadow-sm">
            {product.category}
          </span>
          {product.stock > 0 && product.stock <= 5 && (
            <span className="absolute right-3 top-3 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/75">
              <span className="rounded-full bg-white px-3 py-1.5 text-sm font-semibold text-muted-foreground shadow-sm ring-1 ring-border">
                Out of stock
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-foreground">{product.name}</h3>
          <div className="flex items-center gap-1 text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} className={i < 4 ? "fill-current" : "text-gray-300"} />
            ))}
            <span className="ml-1 text-xs text-muted-foreground">4.2</span>
          </div>
          <p className="mt-auto text-lg font-bold tracking-tight text-foreground">${product.price.toFixed(2)}</p>
        </div>
      </Link>

      <div className="border-t border-border p-4 pt-3">
        {!isAuthenticated ? (
          <button
            onClick={() => toast.error("Please login to add to cart")}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
          >
            <ShoppingCart size={15} />
            Add to cart
          </button>
        ) : quantityInCart > 0 ? (
          <div className="flex h-10 items-center rounded-lg border border-indigo-200 bg-indigo-50">
            <button
              className="inline-flex h-full w-10 items-center justify-center text-indigo-700 disabled:opacity-40"
              onClick={handleDecrement}
              disabled={updateCart.isPending || removeFromCart.isPending}
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="flex-1 text-center text-sm font-bold text-foreground">{quantityInCart}</span>
            <button
              className="inline-flex h-full w-10 items-center justify-center text-indigo-700 disabled:opacity-40"
              onClick={handleIncrement}
              disabled={updateCart.isPending || quantityInCart >= product.stock}
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart.mutate({ productId: product._id, quantity: 1 })}
            disabled={addToCart.isPending || product.stock < 1}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            <ShoppingCart size={15} />
            {addToCart.isPending ? "Adding..." : "Add to cart"}
          </button>
        )}
      </div>
    </div>
  );
}

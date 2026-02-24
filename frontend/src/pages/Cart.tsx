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
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1rem",
        alignItems: "center",
        padding: "1.25rem 0",
        borderBottom: "1px solid #f1effb",
      }}
    >
      {/* Image + info */}
      <div style={{ display: "flex", gap: "1rem", flex: "1 1 260px", minWidth: 0 }}>
        <div
          style={{
            flexShrink: 0,
            width: 80,
            height: 80,
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #e4e1f5",
            background: "#f8f7ff",
            boxShadow: "0 2px 8px rgba(108,71,255,0.06)",
          }}
        >
          <img
            src={(product as { imageUrl?: string }).imageUrl || ""}
            alt={(product as { name?: string }).name || "Product"}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 }}>
          <h3 style={{ fontWeight: 700, fontSize: "0.95rem", margin: 0, color: "#1a1535", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {(product as { name?: string }).name}
          </h3>
          <p style={{ fontSize: "0.78rem", color: "#7b72a8", margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {(product as { category?: string }).category}
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              fontWeight: 800,
              margin: 0,
              background: "linear-gradient(135deg, #6c47ff, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            ${price.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
        {/* Qty */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            border: "1.5px solid #c4b8ff",
            borderRadius: "10px",
            overflow: "hidden",
            background: "#ede9ff",
          }}
        >
          <button
            style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: item.quantity <= 1 || updateCart.isPending ? "not-allowed" : "pointer", color: item.quantity <= 1 ? "#c4b8ff" : "#6c47ff", transition: "background 0.15s" }}
            onClick={() => item.quantity > 1 && updateCart.mutate({ productId, quantity: item.quantity - 1 })}
            disabled={item.quantity <= 1 || updateCart.isPending}
            onMouseEnter={(e) => { if (item.quantity > 1) (e.currentTarget as HTMLButtonElement).style.background = "#ddd6fe"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
          >
            <Minus size={13} />
          </button>
          <span style={{ minWidth: 32, textAlign: "center", fontSize: "0.92rem", fontWeight: 700, color: "#1a1535", padding: "0 4px" }}>
            {item.quantity}
          </span>
          <button
            style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: updateCart.isPending || item.quantity >= stock ? "not-allowed" : "pointer", color: item.quantity >= stock ? "#c4b8ff" : "#6c47ff", transition: "background 0.15s" }}
            onClick={() => updateCart.mutate({ productId, quantity: item.quantity + 1 })}
            disabled={updateCart.isPending || item.quantity >= stock}
            onMouseEnter={(e) => { if (item.quantity < stock) (e.currentTarget as HTMLButtonElement).style.background = "#ddd6fe"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
          >
            <Plus size={13} />
          </button>
        </div>

        {/* Delete */}
        <button
          style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: "8px", color: "#dc2626", cursor: "pointer", transition: "all 0.2s" }}
          onClick={() => removeFromCart.mutate(productId)}
          disabled={removeFromCart.isPending}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fef2f2"; }}
        >
          <Trash2 size={14} />
        </button>

        {/* Subtotal */}
        <span style={{ minWidth: 70, textAlign: "right", fontWeight: 800, fontSize: "0.95rem", color: "#1a1535" }}>
          ${subtotal.toFixed(2)}
        </span>
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
      <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div className="shimmer" style={{ height: 40, borderRadius: 10, width: "40%", marginBottom: "1.5rem" }} />
        {[1, 2, 3].map((i) => (
          <div key={i} className="shimmer" style={{ height: 96, borderRadius: 12, marginBottom: "0.75rem" }} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
        <p style={{ color: "#dc2626", fontWeight: 600 }}>Failed to load cart</p>
        <button onClick={() => refetch()} style={{ marginTop: "1rem", padding: "8px 20px", borderRadius: "8px", border: "1px solid #fca5a5", background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontWeight: 600 }}>
          Retry
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div
        className="bg-mesh"
        style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "2rem", gap: "1.5rem" }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "#ede9ff",
            border: "1.5px solid #c4b8ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(108,71,255,0.15)",
          }}
        >
          <ShoppingBag size={36} color="#6c47ff" />
        </div>
        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: 0, letterSpacing: "-0.02em", color: "#1a1535" }}>Your cart is empty</h2>
          <p style={{ color: "#7b72a8", marginTop: "0.5rem", marginBottom: 0 }}>Discover products you'll love</p>
        </div>
        <Link
          to="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: "10px", background: "linear-gradient(135deg, #6c47ff, #7c3aed)", color: "#fff", fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 18px rgba(108,71,255,0.35)" }}
        >
          <ShoppingCart size={16} />
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-mesh" style={{ minHeight: "100vh", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1.75rem", color: "#1a1535" }}>
          Your Cart{" "}
          <span style={{ fontSize: "0.55em", fontWeight: 500, color: "#7b72a8" }}>
            ({items.length} item{items.length !== 1 ? "s" : ""})
          </span>
        </h1>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e4e1f5",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow: "0 4px 24px rgba(108,71,255,0.08)",
          }}
        >
          <div style={{ padding: "0 1.5rem" }}>
            {items.map((item: CartItem) => (
              <CartItemRow key={(item.product as { _id?: string })?._id ?? Math.random()} item={item} />
            ))}
          </div>

          {/* Total */}
          <div
            style={{
              padding: "1.25rem 1.5rem",
              borderTop: "1px solid #e4e1f5",
              background: "linear-gradient(135deg, #f8f7ff, #ede9ff22)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#7b72a8" }}>Order total</p>
              <p
                style={{
                  margin: 0,
                  fontSize: "1.9rem",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg, #6c47ff, #7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                ${total.toFixed(2)}
              </p>
            </div>
            <Link
              to="/checkout"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 28px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #6c47ff, #7c3aed)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
                boxShadow: "0 4px 18px rgba(108,71,255,0.4)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 24px rgba(108,71,255,0.55)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 18px rgba(108,71,255,0.4)";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              }}
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

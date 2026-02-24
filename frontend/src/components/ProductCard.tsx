import { Minus, Plus, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/types";
import { useAddToCart, useUpdateCartItem, useRemoveFromCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/api/cart";

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

  const handleLoginToAdd = () => {
    toast.error("Please login to add to cart");
  };

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
    <div
      className="card-hover"
      style={{
        background: "#ffffff",
        border: "1px solid #e4e1f5",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxShadow: "0 2px 12px rgba(108,71,255,0.06), 0 1px 3px rgba(26,21,53,0.05)",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "1 / 1" }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.07)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")
          }
        />

        {/* Category badge */}
        <span
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            border: "1px solid #e4e1f5",
            color: "#6c47ff",
            fontSize: "0.65rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "3px 10px",
            borderRadius: "99px",
            boxShadow: "0 2px 8px rgba(108,71,255,0.1)",
          }}
        >
          {product.category}
        </span>

        {/* Low stock */}
        {product.stock > 0 && product.stock <= 5 && (
          <span
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "#dc2626",
              fontSize: "0.65rem",
              fontWeight: 700,
              padding: "3px 9px",
              borderRadius: "99px",
            }}
          >
            Only {product.stock} left!
          </span>
        )}

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(248,247,255,0.8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                background: "#ffffff",
                border: "1px solid #e4e1f5",
                color: "#7b72a8",
                fontSize: "0.82rem",
                fontWeight: 600,
                padding: "6px 16px",
                borderRadius: "99px",
                boxShadow: "0 2px 8px rgba(108,71,255,0.1)",
              }}
            >
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem", flex: 1 }}>
        <h3
          style={{
            fontWeight: 700,
            fontSize: "0.95rem",
            lineHeight: 1.35,
            margin: 0,
            color: "#1a1535",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </h3>

        {/* Stars */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={11}
              style={{ color: i < 4 ? "#f59e0b" : "#d1d5db", fill: i < 4 ? "#f59e0b" : "none" }}
            />
          ))}
          <span style={{ fontSize: "0.7rem", color: "#7b72a8", marginLeft: 4 }}>4.2</span>
        </div>

        <p
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            margin: 0,
            background: "linear-gradient(135deg, #6c47ff, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.02em",
          }}
        >
          ${product.price.toFixed(2)}
        </p>
      </div>

      {/* Cart action */}
      <div style={{ padding: "0 1rem 1rem" }}>
        {!isAuthenticated ? (
          <button
            onClick={handleLoginToAdd}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "10px 0",
              borderRadius: "10px",
              border: "1px solid #c4b8ff",
              background: "#ede9ff",
              color: "#6c47ff",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#ddd6fe";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#a78bfa";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#ede9ff";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#c4b8ff";
            }}
          >
            <ShoppingCart size={15} />
            Add to Cart
          </button>
        ) : quantityInCart > 0 ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: "1px solid #c4b8ff",
              borderRadius: "10px",
              overflow: "hidden",
              background: "#ede9ff",
            }}
          >
            <button
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                cursor: updateCart.isPending || removeFromCart.isPending ? "not-allowed" : "pointer",
                color: quantityInCart <= 1 ? "#c4b8ff" : "#6c47ff",
                transition: "background 0.15s",
              }}
              onClick={handleDecrement}
              disabled={updateCart.isPending || removeFromCart.isPending}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#ddd6fe"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
            >
              <Minus size={14} />
            </button>
            <span style={{ flex: 1, textAlign: "center", fontSize: "0.95rem", fontWeight: 700, color: "#1a1535" }}>
              {quantityInCart}
            </span>
            <button
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                cursor: updateCart.isPending || quantityInCart >= product.stock ? "not-allowed" : "pointer",
                color: quantityInCart >= product.stock ? "#c4b8ff" : "#6c47ff",
                transition: "background 0.15s",
              }}
              onClick={handleIncrement}
              disabled={updateCart.isPending || quantityInCart >= product.stock}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#ddd6fe"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart.mutate({ productId: product._id, quantity: 1 })}
            disabled={addToCart.isPending || product.stock < 1}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "10px 0",
              borderRadius: "10px",
              border: "none",
              background:
                product.stock < 1
                  ? "#f1effb"
                  : "linear-gradient(135deg, #6c47ff, #7c3aed)",
              color: product.stock < 1 ? "#7b72a8" : "#fff",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: product.stock < 1 || addToCart.isPending ? "not-allowed" : "pointer",
              boxShadow: product.stock < 1 ? "none" : "0 4px 14px rgba(108,71,255,0.35)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (product.stock >= 1 && !addToCart.isPending) {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 6px 20px rgba(108,71,255,0.5)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                product.stock < 1 ? "none" : "0 4px 14px rgba(108,71,255,0.35)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            <ShoppingCart size={15} />
            {addToCart.isPending ? "Adding..." : "Add to Cart"}
          </button>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/api/cart";
import { MapPin, CreditCard, CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";

export function Checkout() {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
  });

  const response = data as {
    data?: { items?: { product: { _id?: string; name?: string; price?: number; imageUrl?: string }; quantity: number }[] };
  } | undefined;
  const cart = response?.data ?? null;
  const items = Array.isArray(cart?.items) ? cart.items : [];
  const total = items.reduce(
    (sum: number, item: { product: { price?: number }; quantity: number }) =>
      sum + (item.product?.price ?? 0) * item.quantity,
    0
  );

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOrdered(true);
      toast.success("Order placed successfully! 🎉");
    }, 1000);
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: "56rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div className="shimmer" style={{ height: 360, borderRadius: 16 }} />
      </div>
    );
  }

  if (ordered) {
    return (
      <div
        className="bg-mesh"
        style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "1.5rem", padding: "2rem" }}
      >
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: "#f0fdf4",
            border: "1.5px solid #86efac",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 20px rgba(34,197,94,0.2)",
          }}
        >
          <CheckCircle2 size={40} color="#16a34a" />
        </div>
        <div>
          <h2 style={{ fontSize: "1.9rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: "#1a1535" }}>
            Order Placed! 🎉
          </h2>
          <p style={{ color: "#7b72a8", marginTop: "0.5rem", marginBottom: 0 }}>
            Thank you! We're getting your order ready.
          </p>
        </div>
        <Link
          to="/"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: "10px", background: "linear-gradient(135deg, #6c47ff, #7c3aed)", color: "#fff", fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 18px rgba(108,71,255,0.35)" }}
        >
          <ShoppingBag size={16} />
          Continue Shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "6rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        <p style={{ color: "#7b72a8" }}>Your cart is empty</p>
        <Link to="/" style={{ padding: "10px 24px", background: "linear-gradient(135deg, #6c47ff, #7c3aed)", color: "#fff", borderRadius: "10px", textDecoration: "none", fontWeight: 700 }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    padding: "11px 14px 11px 42px",
    background: "#f8f7ff",
    border: "1px solid #e4e1f5",
    borderRadius: "10px",
    color: "#1a1535",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box" as const,
  };

  return (
    <div className="bg-mesh" style={{ minHeight: "100vh", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "1.75rem", color: "#1a1535" }}>
          Checkout
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 270px), 1fr))", gap: "1.5rem", alignItems: "start" }}>
          {/* Shipping form */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e4e1f5",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(108,71,255,0.07)",
            }}
          >
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1effb", background: "linear-gradient(135deg, #f8f7ff, #ede9ff22)" }}>
              <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#1a1535" }}>Shipping Details</h2>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", color: "#7b72a8" }}>Enter your delivery information</p>
            </div>
            <form onSubmit={handlePlaceOrder}>
              <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {/* Address */}
                <div>
                  <label htmlFor="address" style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.5rem", color: "#1a1535" }}>
                    Delivery address
                  </label>
                  <div style={{ position: "relative" }}>
                    <MapPin size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#7b72a8", pointerEvents: "none" }} />
                    <input
                      id="address"
                      type="text"
                      placeholder="123 Main St, City, Country"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      style={inputStyle}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#a78bfa";
                        e.target.style.boxShadow = "0 0 0 3px rgba(108,71,255,0.12)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e4e1f5";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Mock payment */}
                <div>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, marginBottom: "0.5rem", color: "#1a1535" }}>
                    Payment
                  </label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "11px 14px",
                      background: "#ede9ff",
                      border: "1px solid #c4b8ff",
                      borderRadius: "10px",
                    }}
                  >
                    <CreditCard size={16} color="#6c47ff" />
                    <span style={{ fontSize: "0.87rem", color: "#7b72a8" }}>
                      Mock card ending in{" "}
                      <strong style={{ color: "#1a1535" }}>****4242</strong>
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "13px",
                    borderRadius: "10px",
                    border: "none",
                    background: loading ? "#c4b8ff" : "linear-gradient(135deg, #6c47ff, #7c3aed)",
                    color: "#fff",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                    boxShadow: loading ? "none" : "0 4px 18px rgba(108,71,255,0.4)",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {loading ? "Processing..." : "Place Order"}
                  {!loading && <ArrowRight size={16} />}
                </button>
              </div>
            </form>
          </div>

          {/* Order summary */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e4e1f5",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 4px 24px rgba(108,71,255,0.07)",
            }}
          >
            <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #f1effb", background: "linear-gradient(135deg, #f8f7ff, #ede9ff22)" }}>
              <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#1a1535" }}>Order Summary</h2>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", color: "#7b72a8" }}>
                {items.length} item{items.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {items.map((item: { product: { _id?: string; name?: string; price?: number; imageUrl?: string }; quantity: number }) => {
                const p = item.product;
                const price = p?.price ?? 0;
                const name = p?.name ?? "";
                return (
                  <div key={p?._id ?? Math.random()} style={{ display: "flex", alignItems: "center", gap: "0.75rem", paddingBottom: "0.6rem", borderBottom: "1px solid #f1effb" }}>
                    {p?.imageUrl && (
                      <img src={p.imageUrl} alt={name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", border: "1px solid #e4e1f5", flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "#1a1535", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#7b72a8" }}>Qty: {item.quantity}</p>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#1a1535", flexShrink: 0 }}>
                      ${(price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}

              {/* Shipping */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#7b72a8", paddingTop: "0.25rem" }}>
                <span>Shipping</span>
                <span style={{ color: "#16a34a", fontWeight: 700 }}>Free 🎁</span>
              </div>

              {/* Total */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #e4e1f5", paddingTop: "1rem", marginTop: "0.25rem" }}>
                <span style={{ fontWeight: 700, color: "#1a1535" }}>Total</span>
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    background: "linear-gradient(135deg, #6c47ff, #7c3aed)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

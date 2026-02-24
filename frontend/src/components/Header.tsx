import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/api/cart";
import { useState } from "react";

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: () => getCart(),
    enabled: isAuthenticated,
  });

  const cart =
    cartData && typeof cartData === "object" && "data" in cartData
      ? (cartData as { data?: { items?: { quantity: number }[] } }).data
      : null;
  const cartCount =
    cart?.items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0;

  const handleCartClick = () => {
    if (isAuthenticated) {
      navigate("/cart");
    } else {
      navigate("/login", { state: { from: { pathname: "/cart" } } });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid #e4e1f5",
        boxShadow: "0 2px 16px rgba(108,71,255,0.06)",
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "10px",
              background: "linear-gradient(135deg, #6c47ff, #a78bfa)",
              boxShadow: "0 4px 12px rgba(108,71,255,0.35)",
            }}
          >
            <Sparkles size={18} color="#fff" />
          </span>
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.2rem",
              letterSpacing: "-0.03em",
              color: "#6c47ff",
            }}
          >
            NexShop
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-flex items-center gap-8" style={{ gap: "2rem" }}>
          {[
            { label: "Products", onClick: () => navigate("/") },
          ].map(({ label, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              style={{
                fontSize: "0.9rem",
                fontWeight: 500,
                color: "#7b72a8",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "color 0.2s",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#6c47ff")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.color = "#7b72a8")
              }
            >
              {label}
            </button>
          ))}

          <button
            onClick={handleCartClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.9rem",
              fontWeight: 500,
              color: "#7b72a8",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              position: "relative",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#6c47ff")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.color = "#7b72a8")
            }
          >
            <ShoppingCart size={17} />
            Cart
            {isAuthenticated && cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  right: -12,
                  background: "linear-gradient(135deg, #6c47ff, #a78bfa)",
                  color: "#fff",
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(108,71,255,0.45)",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>
        </nav>

        {/* Desktop Auth */}
        <div className="desktop-flex items-center gap-3" style={{ gap: "0.75rem" }}>
          {isAuthenticated ? (
            <>
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "#7b72a8",
                  maxWidth: 130,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Hi, {user?.name} 👋
              </span>
              <button
                onClick={() => { logout(); navigate("/"); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid #e4e1f5",
                  background: "#f8f7ff",
                  color: "#7b72a8",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#fee2e2";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#fca5a5";
                  (e.currentTarget as HTMLButtonElement).style.color = "#dc2626";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "#f8f7ff";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#e4e1f5";
                  (e.currentTarget as HTMLButtonElement).style.color = "#7b72a8";
                }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  border: "1px solid #e4e1f5",
                  background: "#f8f7ff",
                  color: "#1a1535",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#c4b8ff";
                  (e.currentTarget as HTMLAnchorElement).style.background = "#ede9ff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#e4e1f5";
                  (e.currentTarget as HTMLAnchorElement).style.background = "#f8f7ff";
                }}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #6c47ff, #7c3aed)",
                  color: "#fff",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  textDecoration: "none",
                  boxShadow: "0 4px 14px rgba(108,71,255,0.35)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 6px 20px rgba(108,71,255,0.5)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 4px 14px rgba(108,71,255,0.35)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                }}
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: "8px",
            border: "1px solid #e4e1f5",
            background: "#f8f7ff",
            color: "#1a1535",
            cursor: "pointer",
          }}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: "#ffffff",
            borderTop: "1px solid #e4e1f5",
            padding: "12px 16px 20px",
            boxShadow: "0 8px 24px rgba(108,71,255,0.08)",
          }}
        >
          <div style={{ maxWidth: "80rem", margin: "0 auto", display: "flex", flexDirection: "column", gap: 4 }}>
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: "12px 0",
                fontSize: "0.95rem",
                fontWeight: 500,
                color: "#1a1535",
                textDecoration: "none",
                borderBottom: "1px solid #f1effb",
              }}
            >
              Products
            </Link>
            <button
              onClick={handleCartClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 0",
                fontSize: "0.95rem",
                fontWeight: 500,
                color: "#1a1535",
                background: "none",
                border: "none",
                borderBottom: "1px solid #f1effb",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <ShoppingCart size={16} color="#6c47ff" />
              Cart{" "}
              {isAuthenticated && cartCount > 0 && (
                <span style={{
                  background: "linear-gradient(135deg, #6c47ff, #a78bfa)",
                  color: "#fff",
                  fontSize: "0.7rem",
                  padding: "2px 8px",
                  borderRadius: "99px",
                  fontWeight: 700,
                }}>
                  {cartCount}
                </span>
              )}
            </button>
            {isAuthenticated ? (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12 }}>
                <span style={{ fontSize: "0.9rem", color: "#7b72a8" }}>{user?.name}</span>
                <Button variant="outline" size="sm" onClick={() => { logout(); setMobileMenuOpen(false); navigate("/"); }}>
                  Logout
                </Button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8, paddingTop: 12 }}>
                <Button variant="outline" size="sm" asChild style={{ flex: 1 }}>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                </Button>
                <Button size="sm" asChild style={{ flex: 1, background: "linear-gradient(135deg, #6c47ff, #7c3aed)" }}>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

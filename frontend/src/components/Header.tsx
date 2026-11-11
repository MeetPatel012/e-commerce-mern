import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, Menu, X, Sparkles, UserRound } from "lucide-react";
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

  const closeMobile = () => setMobileMenuOpen(false);

  const handleCartClick = () => {
    navigate(isAuthenticated ? "/cart" : "/login", isAuthenticated ? undefined : { state: { from: { pathname: "/cart" } } });
    closeMobile();
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-white/90 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5" onClick={closeMobile}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
            <Sparkles size={17} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-foreground">NexShop</span>
        </Link>

        <nav className="desktop-flex items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>Products</NavLink>
          {isAuthenticated && <NavLink to="/orders" className={navLinkClass}>Orders</NavLink>}
          {isAuthenticated && <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>}
        </nav>

        <div className="desktop-flex items-center gap-2">
          <button
            onClick={handleCartClick}
            className="relative inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-3.5 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            <ShoppingCart size={16} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 py-0.5 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="inline-flex h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                <UserRound size={16} />
                <span className="max-w-28 truncate">{user?.name}</span>
              </Link>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-3.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <LogOut size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="inline-flex h-10 items-center rounded-lg border border-border bg-white px-4 text-sm font-semibold text-foreground transition hover:bg-muted">Login</Link>
              <Link to="/register" className="inline-flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700">Register</Link>
            </>
          )}
        </div>

        <button
          className="mobile-only h-10 w-10 items-center justify-center rounded-lg border border-border bg-white text-foreground"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-only border-t border-border bg-white">
          <div className="container-page flex flex-col gap-1 py-3">
            <NavLink to="/" end onClick={closeMobile} className={({ isActive }) => `rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-muted text-foreground" : "text-muted-foreground"}`}>Products</NavLink>
            {isAuthenticated && <NavLink to="/orders" onClick={closeMobile} className={({ isActive }) => `rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-muted text-foreground" : "text-muted-foreground"}`}>Orders</NavLink>}
            {isAuthenticated && <NavLink to="/profile" onClick={closeMobile} className={({ isActive }) => `rounded-lg px-3 py-2.5 text-sm font-medium ${isActive ? "bg-muted text-foreground" : "text-muted-foreground"}`}>Profile</NavLink>}
            <button onClick={handleCartClick} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
              <span className="inline-flex items-center gap-2"><ShoppingCart size={16} /> Cart</span>
              {cartCount > 0 && <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white">{cartCount}</span>}
            </button>
            <div className="mt-2 border-t border-border pt-3">
              {isAuthenticated ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm text-muted-foreground">{user?.name}</span>
                  <button onClick={() => { logout(); closeMobile(); navigate("/"); }} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium">Logout</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link to="/login" onClick={closeMobile} className="inline-flex h-10 items-center justify-center rounded-lg border border-border text-sm font-semibold">Login</Link>
                  <Link to="/register" onClick={closeMobile} className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

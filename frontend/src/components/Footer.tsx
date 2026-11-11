import { Link } from "react-router-dom";
import { Sparkles, Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-white">
      <div className="container-page py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
              <Sparkles size={16} />
            </span>
            <div>
              <div className="text-base font-extrabold tracking-tight text-foreground">NexShop</div>
              <div className="text-sm text-muted-foreground">Curated products for everyday life</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
            <Link to="/" className="transition hover:text-foreground">Products</Link>
            <Link to="/orders" className="transition hover:text-foreground">Orders</Link>
            <Link to="/profile" className="transition hover:text-foreground">Profile</Link>
          </div>

          <div className="flex items-center gap-2">
            {[Github, Twitter, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-muted-foreground transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-5 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} NexShop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

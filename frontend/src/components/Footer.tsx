import { Link } from "react-router-dom";
import { Sparkles, Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer style={{ width: "100%", marginTop: "auto", background: "#ffffff", borderTop: "1px solid #e4e1f5" }}>
      {/* Top gradient accent line */}
      <div
        style={{
          height: 3,
          background: "linear-gradient(90deg, transparent 0%, #6c47ff 30%, #a78bfa 60%, transparent 100%)",
          opacity: 0.5,
        }}
      />

      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: "9px",
                background: "linear-gradient(135deg, #6c47ff, #a78bfa)",
                boxShadow: "0 4px 12px rgba(108,71,255,0.25)",
              }}
            >
              <Sparkles size={16} color="#fff" />
            </span>
            <div>
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  background: "linear-gradient(135deg, #6c47ff, #7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                NexShop
              </div>
              <div style={{ fontSize: "0.72rem", color: "#7b72a8" }}>
                Curated. Beautiful. Yours.
              </div>
            </div>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[
              { label: "Products", to: "/" },
              { label: "About", to: "/" },
              { label: "Contact", to: "/" },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#7b72a8",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = "#6c47ff")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLAnchorElement).style.color = "#7b72a8")
                }
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Social icons */}
          <div style={{ display: "flex", gap: "0.6rem" }}>
            {[Github, Twitter, Instagram].map((Icon, i) => (
              <a
                key={i}
                href="#"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 34,
                  height: 34,
                  borderRadius: "8px",
                  border: "1px solid #e4e1f5",
                  color: "#7b72a8",
                  background: "#f8f7ff",
                  transition: "all 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = "#c4b8ff";
                  el.style.color = "#6c47ff";
                  el.style.background = "#ede9ff";
                  el.style.boxShadow = "0 4px 12px rgba(108,71,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = "#e4e1f5";
                  el.style.color = "#7b72a8";
                  el.style.background = "#f8f7ff";
                  el.style.boxShadow = "none";
                }}
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: "1.5rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid #f1effb",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "0.78rem", color: "#7b72a8", margin: 0 }}>
            © {new Date().getFullYear()} NexShop. All rights reserved. Made with ♥
          </p>
        </div>
      </div>
    </footer>
  );
}

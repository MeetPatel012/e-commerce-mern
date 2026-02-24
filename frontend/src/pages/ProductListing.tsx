import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Package } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/api/products";
import type { Product } from "@/types";

export function ProductListing() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
  });

  const products = data?.data ?? [];
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p: Product) => {
      const matchesSearch =
        !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  if (isLoading) {
    return (
      <div className="bg-mesh" style={{ minHeight: "100vh", padding: "3rem 1.5rem" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto" }}>
          <div className="shimmer" style={{ height: 70, borderRadius: 16, marginBottom: "2rem", maxWidth: 400 }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 255px), 1fr))", gap: "1.5rem" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ borderRadius: 16, border: "1px solid #e4e1f5", overflow: "hidden", background: "#fff", boxShadow: "0 2px 12px rgba(108,71,255,0.05)" }}>
                <div className="shimmer" style={{ aspectRatio: "1/1" }} />
                <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  <div className="shimmer" style={{ height: 12, borderRadius: 6, width: "30%" }} />
                  <div className="shimmer" style={{ height: 16, borderRadius: 6, width: "80%" }} />
                  <div className="shimmer" style={{ height: 22, borderRadius: 6, width: "28%" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", textAlign: "center", padding: "2rem" }}>
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fef2f2", border: "1px solid #fca5a5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>
          ⚠️
        </div>
        <p style={{ color: "#dc2626", fontWeight: 600, fontSize: "1rem", margin: 0 }}>Failed to load products</p>
        <button
          onClick={() => refetch()}
          style={{
            padding: "10px 24px",
            borderRadius: "10px",
            border: "1px solid #fca5a5",
            background: "#fef2f2",
            color: "#dc2626",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-mesh" style={{ minHeight: "100vh" }}>
      <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* Hero */}
        <div className="animate-fade-in-up" style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "#ede9ff",
              border: "1px solid #c4b8ff",
              borderRadius: "99px",
              padding: "4px 14px",
              marginBottom: "1rem",
            }}
          >
            <Package size={13} color="#6c47ff" />
            <span style={{ fontSize: "0.75rem", color: "#6c47ff", fontWeight: 700 }}>
              {filteredProducts.length} products available
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(1.9rem, 5vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.15,
              margin: 0,
              color: "#1a1535",
            }}
          >
            Discover our{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #6c47ff, #7c3aed, #a78bfa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Collection
            </span>
          </h1>
          <p style={{ marginTop: "0.75rem", color: "#7b72a8", fontSize: "1rem", marginBottom: 0 }}>
            Curated products for every lifestyle and budget
          </p>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "2rem",
            alignItems: "center",
            background: "#ffffff",
            border: "1px solid #e4e1f5",
            borderRadius: "14px",
            padding: "1rem 1.25rem",
            boxShadow: "0 2px 12px rgba(108,71,255,0.05)",
          }}
        >
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 260px", maxWidth: 380 }}>
            <Search
              size={16}
              style={{
                position: "absolute",
                left: 13,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#7b72a8",
                pointerEvents: "none",
              }}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 40px",
                background: "#f8f7ff",
                border: "1px solid #e4e1f5",
                borderRadius: "10px",
                color: "#1a1535",
                fontSize: "0.88rem",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#a78bfa";
                (e.target as HTMLInputElement).style.boxShadow = "0 0 0 3px rgba(108,71,255,0.1)";
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#e4e1f5";
                (e.target as HTMLInputElement).style.boxShadow = "none";
              }}
            />
          </div>

          {/* Category pills */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginRight: 4 }}>
              <SlidersHorizontal size={14} color="#7b72a8" />
              <span style={{ fontSize: "0.8rem", color: "#7b72a8", fontWeight: 500 }}>Filter:</span>
            </div>
            {[null, ...categories].map((cat) => (
              <button
                key={cat ?? "all"}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "99px",
                  border: categoryFilter === cat ? "1.5px solid #6c47ff" : "1px solid #e4e1f5",
                  background: categoryFilter === cat ? "#ede9ff" : "#f8f7ff",
                  color: categoryFilter === cat ? "#6c47ff" : "#7b72a8",
                  fontSize: "0.8rem",
                  fontWeight: categoryFilter === cat ? 700 : 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (categoryFilter !== cat) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#c4b8ff";
                    (e.currentTarget as HTMLButtonElement).style.color = "#6c47ff";
                    (e.currentTarget as HTMLButtonElement).style.background = "#f4f1ff";
                  }
                }}
                onMouseLeave={(e) => {
                  if (categoryFilter !== cat) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#e4e1f5";
                    (e.currentTarget as HTMLButtonElement).style.color = "#7b72a8";
                    (e.currentTarget as HTMLButtonElement).style.background = "#f8f7ff";
                  }
                }}
              >
                {cat ?? "All"}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 0", color: "#7b72a8" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
            <p style={{ fontSize: "1.1rem", fontWeight: 600, margin: 0, color: "#1a1535" }}>
              No products found
            </p>
            <p style={{ fontSize: "0.9rem", marginTop: "0.5rem", margin: "0.5rem 0 0" }}>
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 255px), 1fr))",
              gap: "1.5rem",
            }}
          >
            {filteredProducts.map((product, i) => (
              <div
                key={product._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

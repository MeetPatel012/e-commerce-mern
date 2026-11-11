import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Package, AlertCircle } from "lucide-react";
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
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  if (isLoading) {
    return (
      <div className="bg-mesh min-h-[60vh]">
        <div className="container-page py-10">
          <div className="shimmer mb-8 h-24 max-w-md rounded-2xl" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-border bg-white">
                <div className="shimmer aspect-square" />
                <div className="space-y-3 p-4">
                  <div className="shimmer h-4 w-3/4 rounded" />
                  <div className="shimmer h-4 w-1/2 rounded" />
                  <div className="shimmer h-5 w-1/3 rounded" />
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
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600 ring-1 ring-red-200">
          <AlertCircle size={26} />
        </div>
        <h2 className="text-xl font-bold text-foreground">Failed to load products</h2>
        <p className="mt-2 text-sm text-muted-foreground">Please check your connection and try again.</p>
        <button
          onClick={() => refetch()}
          className="mt-5 inline-flex h-10 items-center rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-mesh min-h-full">
      <div className="container-page py-10">
        <div className="animate-fade-in-up mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <Package size={14} />
            {filteredProducts.length} products available
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Discover our collection
          </h1>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Curated products for every lifestyle and budget.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-border bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 w-full rounded-xl border border-border bg-muted/40 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
              <SlidersHorizontal size={14} /> Filter:
            </span>
            {[null, ...categories].map((cat) => (
              <button
                key={cat ?? "all"}
                onClick={() => setCategoryFilter(cat)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  categoryFilter === cat
                    ? "bg-indigo-600 text-white"
                    : "border border-border bg-white text-muted-foreground hover:border-indigo-200 hover:text-foreground"
                }`}
              >
                {cat ?? "All"}
              </button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white py-16 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Search size={20} />
            </div>
            <p className="text-lg font-semibold text-foreground">No products found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, i) => (
              <div key={product._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.03}s` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

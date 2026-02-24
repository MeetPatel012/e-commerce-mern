import { api } from "@/lib/axios";
import type { ApiResponse, Product } from "@/types";

export async function getProducts() {
  const { data } = await api.get<ApiResponse<Product[]>>("/products");
  return data;
}

export async function getProductById(id: string) {
  const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`);
  return data;
}

import { api } from "@/lib/axios";
import type { ApiResponse, Cart } from "@/types";

export async function getCart() {
  const { data } = await api.get<ApiResponse<Cart | null>>("/cart");
  return data;
}

export async function addToCart(productId: string, quantity: number) {
  const { data } = await api.post<ApiResponse<Cart>>("/cart/add", {
    productId,
    quantity,
  });
  return data;
}

export async function updateCartItem(productId: string, quantity: number) {
  const { data } = await api.put<ApiResponse<Cart>>(
    `/cart/update/${productId}`,
    { quantity }
  );
  return data;
}

export async function removeCartItem(productId: string) {
  const { data } = await api.delete<ApiResponse<Cart>>(
    `/cart/remove/${productId}`
  );
  return data;
}

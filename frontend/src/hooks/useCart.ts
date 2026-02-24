import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addToCart as addToCartApi,
  updateCartItem as updateCartItemApi,
  removeCartItem as removeCartItemApi,
} from "@/api/cart";

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      addToCartApi(productId, quantity),
    onSuccess: (response) => {
      queryClient.setQueryData(["cart"], { data: response.data });
      toast.success("Added to cart");
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to add to cart"
          : "Failed to add to cart";
      toast.error(message);
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      updateCartItemApi(productId, quantity),
    onSuccess: (response) => {
      queryClient.setQueryData(["cart"], { data: response.data });
      toast.success("Cart updated");
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to update"
          : "Failed to update cart";
      toast.error(message);
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => removeCartItemApi(productId),
    onSuccess: (response) => {
      queryClient.setQueryData(["cart"], { data: response.data });
      toast.success("Removed from cart");
    },
    onError: (err: unknown) => {
      const message =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to remove"
          : "Failed to remove from cart";
      toast.error(message);
    },
  });
}

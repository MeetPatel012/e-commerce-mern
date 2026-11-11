import { api } from "@/lib/axios";
import type { ApiResponse, Order, ShippingAddress } from "@/types";

export interface CreateOrderBody {
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: any;
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
}

export async function createOrder(body: CreateOrderBody) {
  const { data } = await api.post<ApiResponse<Order>>("/orders", body);
  return data;
}

export async function getMyOrders() {
  const { data } = await api.get<ApiResponse<Order[]>>("/orders");
  return data;
}

export async function getOrderById(id: string) {
  const { data } = await api.get<ApiResponse<Order>>(`/orders/${id}`);
  return data;
}

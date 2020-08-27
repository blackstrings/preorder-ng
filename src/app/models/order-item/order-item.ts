/**
 * products under an order are orderItems in the backend
 * So we sending products to the backend, we have to transform products into orderItem
 */
export interface OrderItem {
  product_id: number;
  quantity_id: number;
}

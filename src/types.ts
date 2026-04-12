export interface Category {
  id: string;
  name: string;
  color?: string;
}

export interface OptionItem {
  id: string;
  name: string;
  color: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  icon: string;
  barcode: string;
  prepTime: number;
  available: boolean;
  recipe: string;
  subtitle?: string;
  hasMilk?: boolean;
  hasSugar?: boolean;
  hasSyrup?: boolean;
  hasSauce?: boolean;
}

export interface OrderItemOptions {
  sugar: number;
  sweetener?: number;
  milk?: string;
  syrup?: string;
  sauce?: string;
  notes: string;
}

export interface OrderItem {
  id: string;
  itemId: string;
  quantity: number;
  options: OrderItemOptions;
}

export type OrderStatus = 'pending' | 'preparing' | 'completed' | 'delivered';

export interface Order {
  id: string;
  customerName: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: number;
  preScanned?: boolean;
}


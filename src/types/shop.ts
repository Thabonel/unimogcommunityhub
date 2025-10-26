export interface ShopProduct {
  index: number;
  name: string;
  image: string;
  price: string | number;
  category: string;
  currency: string;
  features: string[];
  specs?: Record<string, string>;
  description?: string;
}

export interface CartItem {
  id: string;
  vendor_id: string;
  product_index: number;
  product: ShopProduct;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface ShippingAddress {
  id?: string;
  full_name: string;
  phone?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  is_default?: boolean;
}

export interface ShopOrder {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  items: Array<{
    product_index: number;
    product_name: string;
    quantity: number;
    price_aud: number;
  }>;
  subtotal_aud: number;
  shipping_cost_aud: number;
  total_aud: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method?: string;
  stripe_payment_intent_id?: string;
  shipping_address_id?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface QuoteRequest {
  id?: string;
  vendor_id: string;
  product_index: number;
  product_name: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  message?: string;
  status?: 'pending' | 'quoted' | 'accepted' | 'declined';
  admin_notes?: string;
  quoted_price_aud?: number;
  created_at?: string;
  updated_at?: string;
}

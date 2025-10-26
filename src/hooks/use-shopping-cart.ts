import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase-client';
import { CartItem, ShopProduct } from '@/types/shop';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

const CART_SESSION_KEY = 'shop_session_id';
const CART_STORAGE_KEY = 'shop_cart_items';

function getSessionId(): string {
  let sessionId = localStorage.getItem(CART_SESSION_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(CART_SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function useShoppingCart(vendorId: string) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sessionId = getSessionId();

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('shop_carts')
        .select('*')
        .eq('vendor_id', vendorId)
        .eq('session_id', sessionId);

      if (fetchError) throw fetchError;

      const cartWithProducts: CartItem[] = [];

      const { data: vendor } = await supabase
        .from('vendors')
        .select('products')
        .eq('id', vendorId)
        .single();

      if (vendor && vendor.products) {
        const products = vendor.products as ShopProduct[];

        data?.forEach((item) => {
          const product = products[item.product_index];
          if (product) {
            cartWithProducts.push({
              id: item.id,
              vendor_id: item.vendor_id,
              product_index: item.product_index,
              product: { ...product, index: item.product_index },
              quantity: item.quantity,
              created_at: item.created_at,
              updated_at: item.updated_at,
            });
          }
        });
      }

      setCart(cartWithProducts);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartWithProducts));
    } catch (err) {
      console.error('Error loading cart:', err);
      setError(err instanceof Error ? err.message : 'Failed to load cart');

      const cached = localStorage.getItem(CART_STORAGE_KEY);
      if (cached) {
        try {
          setCart(JSON.parse(cached));
        } catch {}
      }
    } finally {
      setLoading(false);
    }
  }, [vendorId, sessionId]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (productIndex: number, quantity: number = 1) => {
    try {
      setError(null);

      const { data, error: insertError } = await supabase
        .from('shop_carts')
        .insert({
          session_id: sessionId,
          user_id: user?.id || null,
          vendor_id: vendorId,
          product_index: productIndex,
          quantity,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      await loadCart();
      return { success: true };
    } catch (err) {
      console.error('Error adding to cart:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add to cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateQuantity = async (cartItemId: string, quantity: number) => {
    try {
      setError(null);

      if (quantity <= 0) {
        return removeFromCart(cartItemId);
      }

      const { error: updateError } = await supabase
        .from('shop_carts')
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq('id', cartItemId)
        .eq('session_id', sessionId);

      if (updateError) throw updateError;

      await loadCart();
      return { success: true };
    } catch (err) {
      console.error('Error updating quantity:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update quantity';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const removeFromCart = async (cartItemId: string) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('shop_carts')
        .delete()
        .eq('id', cartItemId)
        .eq('session_id', sessionId);

      if (deleteError) throw deleteError;

      await loadCart();
      return { success: true };
    } catch (err) {
      console.error('Error removing from cart:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove from cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearCart = async () => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('shop_carts')
        .delete()
        .eq('session_id', sessionId)
        .eq('vendor_id', vendorId);

      if (deleteError) throw deleteError;

      setCart([]);
      localStorage.removeItem(CART_STORAGE_KEY);
      return { success: true };
    } catch (err) {
      console.error('Error clearing cart:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear cart';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = typeof item.product.price === 'number'
      ? item.product.price
      : parseFloat(item.product.price.replace(/[^0-9.]/g, '')) || 0;
    return total + (price * item.quantity);
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return {
    cart,
    cartCount,
    cartTotal,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: loadCart,
  };
}

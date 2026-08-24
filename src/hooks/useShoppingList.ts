import { useStore } from '../store/useStore';
import { CartItem, Product } from '../types';
import products from '../data/products.json';
import { v4 as uuid } from 'uuid';

export function useShoppingList() {
  const cart = useStore((s) => s.cart);
  const addItem = useStore((s) => s.addItem);
  const removeItem = useStore((s) => s.removeItem);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const toggleComplete = useStore((s) => s.toggleComplete);
  const clearCart = useStore((s) => s.clearCart);
  const showToast = useStore((s) => s.showToast);

  const addItemByName = (name: string, quantity: number = 1, unit: string = 'pcs') => {
    const qName = name.toLowerCase().trim();
    
    // Find product in catalogue (case-insensitive exact match)
    let product = (products as Product[]).find((p) => p.name.toLowerCase() === qName);
    
    // If not found, check if it's a generic request that has multiple branded variants
    if (!product) {
      const variants = (products as Product[]).filter(
        (p) => p.name.toLowerCase().includes(qName) || p.category.toLowerCase() === qName
      );
      
      if (variants.length > 1) {
        // Trigger disambiguation modal
        useStore.getState().setVariantModal(name, variants, quantity, unit);
        return;
      } else if (variants.length === 1) {
        // Just one variant, use it
        product = variants[0];
      }
    }
    
    if (product) {
      if (!product.inStock) {
        // Trigger substitute modal
        useStore.getState().setSubstituteModal(product.name, []);
        return;
      }
      // Check if already in cart
      const existing = cart.find((i) => i.name.toLowerCase() === product!.name.toLowerCase());
      if (existing) {
        updateQuantity(existing.id, existing.quantity + quantity);
        showToast(`${product.name} updated to ${existing.quantity + quantity} ${unit} ✓`);
      } else {
        const cartItem: CartItem = {
          ...product,
          id: uuid(),
          quantity,
          unit: unit || product.unit,
          completed: false,
        };
        addItem(cartItem);
        showToast(`${product.name} (${quantity} ${unit}) added ✓`);
      }
    } else {
      // It's not in the catalog at all.
      // If it looks like a specific brand name (e.g., > 2 words and not a known generic), we might treat it as out-of-stock.
      // But for simplicity, we'll assume if it's not matched and has >= 2 words (like "pepsodent toothpaste"), 
      // trigger the substitute modal. Otherwise, add as custom item.
      if (qName.split(' ').length >= 2) {
        useStore.getState().setSubstituteModal(name, []);
        return;
      }

      // Add as custom item
      const cartItem: CartItem = {
        id: uuid(),
        name: name.charAt(0).toUpperCase() + name.slice(1),
        category: 'other',
        unit,
        price: 0,
        inStock: true,
        quantity,
        completed: false,
      };
      addItem(cartItem);
      showToast(`${cartItem.name} added ✓`);
    }
  };

  const removeItemByName = (name: string) => {
    const item = cart.find((i) => i.name.toLowerCase() === name.toLowerCase());
    if (item) {
      removeItem(item.id);
      showToast(`${item.name} removed ✓`);
    } else {
      showToast(`"${name}" not found in cart`);
    }
  };

  const updateItemQuantity = (name: string, quantity: number, unit?: string) => {
    const item = cart.find((i) => i.name.toLowerCase() === name.toLowerCase());
    if (item) {
      updateQuantity(item.id, quantity);
      showToast(`${item.name} updated to ${quantity} ${unit || item.unit} ✓`);
    }
  };

  // Group cart items by category
  const groupedCart = cart.reduce<Record<string, CartItem[]>>((acc, item) => {
    const cat = item.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return {
    cart,
    groupedCart,
    addItem: addItemByName,
    removeItem: removeItemByName,
    updateQuantity: updateItemQuantity,
    toggleComplete,
    clearCart,
    cartCount: cart.length,
    totalPrice: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
  };
}

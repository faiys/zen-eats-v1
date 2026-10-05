import { useState, useEffect, useCallback } from 'react';
import { FoodItem } from '../data/foodItems';

export interface OrderState {
  selectedItem: FoodItem | null;
  selectedAddOns: string[];
  specialInstructions: string;
  isConfirmed: boolean;
  confirmedAt: string | null;
  orderId: string | null;
}

export interface EmployeeInfo {
  name: string;
  email: string;
  department: string;
  location: string;
}

const DEFAULT_EMPLOYEE: EmployeeInfo = {
  name: 'Faiyas',
  email: 'faiyaszen@gmail.com',
  department: 'Product & Engineering',
  location: 'Floor 3, Tower A'
};

const WISHLIST_KEY = 'friday_snacks_wishlist_v1';

export function useOrder() {
  // Order comes from Zoho (today's order), not localStorage
  const [order, setOrder] = useState<OrderState>({
    selectedItem: null,
    selectedAddOns: [],
    specialInstructions: '',
    isConfirmed: false,
    confirmedAt: null,
    orderId: null,
  });

  const [employee] = useState<EmployeeInfo>(DEFAULT_EMPLOYEE);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeModalItem, setActiveModalItem] = useState<FoodItem | null>(null);
  const [toastMessage, setToastMessage] = useState<{ id: number; text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['samosa-plate'];
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToastMessage({ id: Date.now(), text, type });
  }, []);

  const selectItem = useCallback((item: FoodItem, addOns: string[] = [], instructions: string = '') => {
    const isReplacing = order.selectedItem && order.selectedItem.id !== item.id;
    setOrder({
      selectedItem: item,
      selectedAddOns: addOns,
      specialInstructions: instructions,
      isConfirmed: false,
      confirmedAt: null,
      orderId: null,
    });
    setIsCartOpen(true);
    if (isReplacing) {
      showToast(`Replaced order with ${item.name}`, 'info');
    } else {
      showToast(`Selected 1 item: ${item.name}`, 'success');
    }
  }, [order.selectedItem, showToast]);

  // Mark an item as the confirmed order (after saving to Zoho, or when loading today's order)
  const markOrderConfirmed = useCallback((item: FoodItem, orderId: string | null, notify: boolean = true) => {
    const formattedTime = notify
      ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : null;
    setOrder({
      selectedItem: item,
      selectedAddOns: [],
      specialInstructions: '',
      isConfirmed: true,
      confirmedAt: formattedTime,
      orderId: orderId,
    });
    if (notify) {
      showToast('Order confirmed! It will be delivered to you soon.', 'success');
    }
  }, [showToast]);

  const changeOrder = useCallback(() => {
    const previousName = order.selectedItem?.name;
    setOrder({
      selectedItem: null,
      selectedAddOns: [],
      specialInstructions: '',
      isConfirmed: false,
      confirmedAt: null,
      orderId: null,
    });
    showToast(
      previousName
        ? `Unlocked all snacks! You can now select a different Friday treat.`
        : 'All snacks unlocked. Pick your treat!',
      'info'
    );
  }, [order.selectedItem, showToast]);

  const toggleWishlist = useCallback((id: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from your favorites', 'info');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Added to your favorites ❤️', 'success');
        return [...prev, id];
      }
    });
  }, [showToast]);

  return {
    order,
    employee,
    isCartOpen,
    setIsCartOpen,
    activeModalItem,
    setActiveModalItem,
    toastMessage,
    setToastMessage,
    wishlist,
    selectItem,
    markOrderConfirmed,
    changeOrder,
    toggleWishlist,
    showToast,
  };
}

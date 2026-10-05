import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoryTabs } from './components/CategoryTabs';
import { SearchBar } from './components/SearchBar';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { CartSidebar } from './components/CartSidebar';
import { BottomNotificationBar } from './components/BottomNotificationBar';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { FoodItem } from './data/foodItems';
import { useOrder } from './hooks/useOrder';
import { useManage, getCurrentDateDDMMMYYYY } from './service/Manage';
import { OrderSummaryModal } from './components/OrderSummaryModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { OrderChecklistModal } from './components/OrderChecklistModal';

export default function App() {
  const {
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
  } = useOrder();

  const {
    loginUser,
    menuItems,
    categories,
    isMenuLoading,
    canExportPDF,
    canViewChecklist,
    checklist,
    isChecklistLoading,
    loadChecklist,
    submitChecklistRow,
    updateChecklistNote,
    orderHistory,
    isHistoryLoading,
    loadOrderHistory,
    orderSummary,
    isSummaryLoading,
    loadOrderSummary,
    todayOrder,
    submitOrder,
  } = useManage();

  // Order History: open list and load login user's orders
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const handleOpenHistory = () => {
    setIsHistoryOpen(true);
    loadOrderHistory();
  };

  // Order Checklist: open list of today's ordered items and load saved checks
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const handleOpenChecklist = () => {
    setIsChecklistOpen(true);
    loadChecklist();
  };

  // Export PDF: open preview with today's orders, export from there
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const handleOpenOrderSummary = () => {
    setIsSummaryOpen(true);
    loadOrderSummary();
  };
  const handleExportPDF = async () => {
    if (!orderSummary) return;
    try {
      // PDF library loads only when exporting (keeps main bundle small)
      const { exportOrderSummaryPDF } = await import('./service/OrderSummaryPDF');
      exportOrderSummaryPDF(orderSummary);
    }
    catch (error) {
      console.error('Error exporting PDF:', error);
      showToast('Could not export PDF. Please try again.', 'warning');
    }
  };

  // Show today's order from Zoho as confirmed once menu items are loaded
  useEffect(() => {
    if (!todayOrder) return;
    const orderedItem = menuItems.find((item) => item.id === todayOrder.itemId);
    if (orderedItem) {
      markOrderConfirmed(orderedItem, todayOrder.orderId, false);
    }
  }, [todayOrder, menuItems]);

  // Cancel a switched (unconfirmed) item: go back to today's ordered item if any, else unlock all items
  const handleCancelSelection = () => {
    const orderedItem = todayOrder
      ? menuItems.find((item) => item.id === todayOrder.itemId)
      : undefined;
    if (todayOrder && orderedItem) {
      markOrderConfirmed(orderedItem, todayOrder.orderId, false);
      showToast(`Kept your order: ${orderedItem.name}`, 'info');
    }
    else {
      changeOrder();
    }
  };

  // Confirm order: save to Zoho first, then show it as confirmed
  const handleConfirmOrder = async (item?: FoodItem) => {
    const orderItem = item ?? order.selectedItem;
    if (!orderItem) return;
    const result = await submitOrder(orderItem);
    if (result.success) {
      markOrderConfirmed(orderItem, result.orderId || null);
    }
    else {
      showToast(result.message || 'Could not place your order.', 'warning');
    }
  };

  // Header profile uses the Zoho login user
  const headerEmployee = {
    ...employee,
    name: loginUser.name,
    email: loginUser.email,
  };

  const [activeCategory, setActiveCategory] = useState<FoodItem['category']>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFavoritesOnly, setIsFavoritesOnly] = useState(false);

  // Compute counts per category
  const categoryCounts = useMemo(() => {
    const baseItems = isFavoritesOnly
      ? menuItems.filter((item) => wishlist.includes(item.id))
      : menuItems;
    const counts: Record<string, number> = { All: baseItems.length };
    baseItems.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });
    return counts;
  }, [menuItems, isFavoritesOnly, wishlist]);

  // Filter items
  const filteredAndSortedItems = useMemo(() => {
    let result = [...menuItems];

    // Filter by Favorites Only
    if (isFavoritesOnly) {
      result = result.filter((item) => wishlist.includes(item.id));
    }

    // Filter by Category
    if (activeCategory !== 'All') {
      result = result.filter((item) => item.category === activeCategory);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.popularTags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    return result;
  }, [menuItems, activeCategory, searchQuery, isFavoritesOnly, wishlist]);

  const handleToggleFavoritesOnly = () => {
    setIsFavoritesOnly((prev) => {
      const next = !prev;
      if (next) {
        setActiveCategory('All');
        showToast('Showing your favorite snacks only ❤️', 'info');
        const el = document.getElementById('food-menu');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        showToast('Showing all Friday snacks', 'info');
      }
      return next;
    });
  };

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    setIsFavoritesOnly(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans flex flex-col selection:bg-red-500 selection:text-white">
      {/* 1. Header matching DreamsFood design */}
      <Header
        order={order}
        employee={headerEmployee}
        wishlistCount={wishlist.length}
        isFavoritesOnly={isFavoritesOnly}
        onToggleFavoritesOnly={handleToggleFavoritesOnly}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenHistory={handleOpenHistory}
        showChecklist={canViewChecklist}
        onOpenChecklist={handleOpenChecklist}
        showExportPDF={canExportPDF}
        onExportPDF={handleOpenOrderSummary}
        onChangeOrder={handleCancelSelection}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          const el = document.getElementById('food-menu');
          if (el) {
            const y = el.getBoundingClientRect().top + window.scrollY - 85;
            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
          }
        }}
      />

      {/* 2. Hero Banner with "Friday Snacks" title & breadcrumbs */}
      <HeroBanner
        order={order}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 3. Category navigation tabs */}
      <div id="food-menu">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* 4. Search bar and filter toggles */}
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isFavoritesOnly={isFavoritesOnly}
        onToggleFavoritesOnly={handleToggleFavoritesOnly}
        totalResults={filteredAndSortedItems.length}
      />

      {/* 5. Food Grid with interactive cards & 1-item rule */}
      <main className="flex-1">
        {isMenuLoading ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-sm text-slate-500">
            Loading menu...
          </div>
        ) : (
        <ProductGrid
          items={filteredAndSortedItems}
          order={order}
          wishlist={wishlist}
          isFavoritesOnly={isFavoritesOnly}
          onToggleFavoritesOnly={handleToggleFavoritesOnly}
          onSelect={(item) => selectItem(item)}
          onOpenDetails={(item) => setActiveModalItem(item)}
          onToggleWishlist={toggleWishlist}
          onResetFilters={handleResetFilters}
        />
        )}
      </main>

      {/* 6. Product Details Modal / Popup (Image 2 style) */}
      <ProductDetailsModal
        item={activeModalItem}
        order={order}
        onClose={() => setActiveModalItem(null)}
        onSelect={(item, addOns, instructions) => selectItem(item, addOns, instructions)}
        onConfirmOrder={(item) => handleConfirmOrder(item)}
        isWishlisted={activeModalItem ? wishlist.includes(activeModalItem.id) : false}
        onToggleWishlist={toggleWishlist}
        onShowToast={showToast}
      />

      {/* Order History */}
      <OrderHistoryModal
        isOpen={isHistoryOpen}
        isLoading={isHistoryLoading}
        history={orderHistory}
        today={getCurrentDateDDMMMYYYY()}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* Order Checklist */}
      <OrderChecklistModal
        isOpen={isChecklistOpen}
        isLoading={isChecklistLoading || (isSummaryLoading && !orderSummary)}
        summary={orderSummary}
        checklist={checklist}
        onClose={() => setIsChecklistOpen(false)}
        onCheckRow={submitChecklistRow}
        onUpdateNote={updateChecklistNote}
      />

      {/* Order summary preview + Export PDF */}
      <OrderSummaryModal
        isOpen={isSummaryOpen}
        isLoading={isSummaryLoading}
        summary={orderSummary}
        onClose={() => setIsSummaryOpen(false)}
        onExport={handleExportPDF}
      />

      {/* 7. Right Shopping Cart / Checkout Drawer (Image 1 style) */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        order={order}
        employee={headerEmployee}
        onConfirmOrder={() => handleConfirmOrder()}
        onChangeOrder={handleCancelSelection}
        onOpenDetails={(item) => {
          setActiveModalItem(item);
          setIsCartOpen(false);
        }}
      />

      {/* 8. Sticky Bottom Notification Bar (DreamsFood red banner) */}
      <BottomNotificationBar
        order={order}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 9. Floating Toast notifications */}
      <Toast
        toast={toastMessage}
        onDismiss={() => setToastMessage(null)}
      />

      {/* 10. Back to top button */}
      <BackToTop />

      {/* 11. Footer */}
      <Footer />
    </div>
  );
}

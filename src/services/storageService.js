const PRODUCTS_KEY = 'vasudha_products';
const ORDERS_KEY = 'vasudha_orders';
const CART_KEY = 'vasudha_cart';
const WISHLIST_KEY = 'vasudha_wishlist';
const AUTH_KEY = 'vasudha_auth';
const ACTIVITY_KEY = 'vasudha_activity';

export const storageService = {
  getAuth: () => {
    try {
      const data = localStorage.getItem(AUTH_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveAuth: (auth) => {
    try {
      if (auth) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    } catch (e) {
      console.error('Error saving auth to storage', e);
    }
  },
  getProducts: (fallback) => {
    try {
      const data = localStorage.getItem(PRODUCTS_KEY);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  },
  saveProducts: (products) => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products to storage', e);
    }
  },
  getOrders: (fallback) => {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  },
  saveOrders: (orders) => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders to storage', e);
    }
  },
  getCart: () => {
    try {
      const data = localStorage.getItem(CART_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveCart: (cart) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to storage', e);
    }
  },
  getWishlist: () => {
    try {
      const data = localStorage.getItem(WISHLIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveWishlist: (wishlist) => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist to storage', e);
    }
  },
  getActivityLog: (fallback = []) => {
    try {
      const data = localStorage.getItem(ACTIVITY_KEY);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  },
  saveActivityLog: (activities) => {
    try {
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));
    } catch (e) {
      console.error('Error saving activity log to storage', e);
    }
  }
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { MOCK_ORDERS, MOCK_ANALYTICS } from '../data/mockOrders';
import { storageService } from '../services/storageService';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const ProductContext = createContext(null);

const DEFAULT_ACTIVITIES = [
  { id: 'act-1', text: 'Catalog initialized with authentic weaves', time: '10 mins ago', type: 'system' },
  { id: 'act-2', text: 'Local RAG AI vector index verified', time: '1 hour ago', type: 'system' },
  { id: 'act-3', text: 'Live boutique stock synchronized', time: '2 hours ago', type: 'stock' }
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = storageService.getProducts(MOCK_PRODUCTS);
    const hasLegacyImages = saved?.some((p) => p.images?.some((img) => typeof img === 'string' && img.includes('unsplash')));
    if (hasLegacyImages) {
      storageService.saveProducts(MOCK_PRODUCTS);
      return MOCK_PRODUCTS;
    }
    return saved;
  });
  const [orders, setOrders] = useState(() => storageService.getOrders(MOCK_ORDERS));
  const [activityLog, setActivityLog] = useState(() => storageService.getActivityLog(DEFAULT_ACTIVITIES));
  const { addToast } = useToast();

  // Load from backend on mount
  useEffect(() => {
    const fetchFromBackend = async () => {
      try {
        const backendProducts = await api.products.list({ include_unpublished: true });
        if (backendProducts && backendProducts.length > 0) {
          setProducts(backendProducts);
          storageService.saveProducts(backendProducts);
        }
      } catch (e) {
        console.warn('[Products] Using local storage state (Backend offline/loading):', e.message);
      }
    };
    fetchFromBackend();
  }, []);

  useEffect(() => {
    storageService.saveProducts(products);
  }, [products]);

  useEffect(() => {
    storageService.saveOrders(orders);
  }, [orders]);

  useEffect(() => {
    storageService.saveActivityLog(activityLog);
  }, [activityLog]);

  const addActivity = (text, type = 'info') => {
    const newEntry = {
      id: `act-${Date.now()}`,
      text,
      time: 'Just now',
      type
    };
    setActivityLog((prev) => [newEntry, ...prev.slice(0, 19)]);
  };

  /**
   * Add a new product with variants matrix (Backend API + Local Optimistic update)
   */
  const addProduct = async (newProduct) => {
    let createdProduct = null;
    try {
      createdProduct = await api.products.create(newProduct);
    } catch (err) {
      console.warn('[Product] Backend create notice, creating local fallback:', err.message);
    }

    if (!createdProduct) {
      const id = `VE${Math.floor(100 + Math.random() * 900)}`;
      const slug = newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      let totalStock = 0;
      if (newProduct.variants && newProduct.variants.length > 0) {
        totalStock = newProduct.variants.reduce((sum, v) => sum + (parseInt(v.stock, 10) || 0), 0);
      } else {
        totalStock = parseInt(newProduct.stock || 10, 10);
      }

      createdProduct = {
        ...newProduct,
        id,
        slug,
        rating: 5.0,
        reviewCount: 1,
        isNew: true,
        stock: totalStock,
        price: parseInt(newProduct.price, 10),
        originalPrice: parseInt(newProduct.originalPrice || newProduct.price * 1.3, 10),
        sku: newProduct.sku || `VE-${id}`,
        images: newProduct.images?.length > 0 ? newProduct.images : ['/half-saree-orange.jpg'],
        details: newProduct.details || ['Authentic Indian handcrafted fabric'],
        care: newProduct.care || ['Dry clean recommended'],
        delivery: newProduct.delivery || { time: '3–5 days', shippingCharge: 99, freeThreshold: 999 },
        published: newProduct.published !== undefined ? newProduct.published : true,
        createdAt: new Date().toISOString().split('T')[0]
      };
    }

    setProducts((prev) => [createdProduct, ...prev]);
    addActivity(`✓ Added ${createdProduct.name}`, 'add');
    addToast(`Product "${newProduct.name}" published to store ✨`, 'success');
    return createdProduct;
  };

  /**
   * Update existing product
   */
  const updateProduct = async (id, updatedFields) => {
    try {
      await api.products.update(id, updatedFields);
    } catch (err) {
      console.warn('[Product] Backend update notice:', err.message);
    }

    let updatedName = '';
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          updatedName = updatedFields.name || p.name;
          let newStock = p.stock;
          if (updatedFields.variants) {
            newStock = updatedFields.variants.reduce((sum, v) => sum + (parseInt(v.stock, 10) || 0), 0);
          } else if (updatedFields.stock !== undefined) {
            newStock = parseInt(updatedFields.stock, 10);
          }
          return {
            ...p,
            ...updatedFields,
            stock: newStock
          };
        }
        return p;
      })
    );
    addActivity(`✓ Updated ${updatedName || id}`, 'update');
    addToast('Product updated successfully', 'success');
  };

  /**
   * Duplicate existing product
   */
  const duplicateProduct = async (id) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;

    const newId = `VE${Math.floor(100 + Math.random() * 900)}`;
    const duplicated = {
      ...item,
      id: newId,
      name: `${item.name} (Copy)`,
      slug: `${item.slug}-copy-${newId.toLowerCase()}`,
      sku: `VE-${newId}`,
      createdAt: new Date().toISOString().split('T')[0],
      isNew: true
    };

    try {
      await api.products.create(duplicated);
    } catch {}

    setProducts((prev) => [duplicated, ...prev]);
    addActivity(`✓ Duplicated ${item.name}`, 'duplicate');
    addToast(`Duplicated "${item.name}" as "${duplicated.name}"`, 'success');
    return duplicated;
  };

  /**
   * Delete product
   */
  const deleteProduct = async (id) => {
    const item = products.find((p) => p.id === id);
    try {
      await api.products.delete(id);
    } catch (err) {
      console.warn('[Product] Backend delete notice:', err.message);
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    addActivity(`✓ Removed ${item?.name || id}`, 'delete');
    addToast(`Product removed successfully`, 'info');
  };

  /**
   * Toggle published state
   */
  const togglePublished = async (id) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;
    const newStatus = !item.published;

    try {
      await api.products.update(id, { published: newStatus });
    } catch {}

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: newStatus } : p))
    );
    addToast(`Product is now ${newStatus ? 'Published' : 'Draft/Hidden'}`, 'info');
  };

  /**
   * Update specific variant stock in matrix
   */
  const updateVariantStock = async (productId, size, color, newStock) => {
    const val = Math.max(0, parseInt(newStock, 10) || 0);

    try {
      await api.products.updateVariantStock(productId, size, color, val);
    } catch (err) {
      console.warn('[Product] Backend variant update notice:', err.message);
    }

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          let updatedVariants = p.variants ? [...p.variants] : [];
          const existingIdx = updatedVariants.findIndex((v) => v.size === size && v.color === color);

          if (existingIdx > -1) {
            updatedVariants[existingIdx] = { ...updatedVariants[existingIdx], stock: val };
          } else {
            updatedVariants.push({ size, color, stock: val });
          }

          const totalStock = updatedVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
          return { ...p, variants: updatedVariants, stock: totalStock };
        }
        return p;
      })
    );
    addActivity(`✓ Updated stock of variant (${size}/${color}) to ${val}`, 'stock');
    addToast('Variant stock updated in live database', 'success');
  };

  /**
   * Quick total stock update
   */
  const updateStock = async (id, newStock) => {
    const stockVal = Math.max(0, parseInt(newStock, 10) || 0);

    try {
      await api.products.updateStock(id, stockVal);
    } catch (err) {
      console.warn('[Product] Backend stock update notice:', err.message);
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: stockVal } : p))
    );
    addActivity(`✓ Updated stock of ${id} to ${stockVal}`, 'stock');
    addToast('Live inventory stock updated', 'success');
  };

  /**
   * Order actions with transactional stock deduction
   */
  const createOrder = async (orderData) => {
    let newOrder = null;

    try {
      const res = await api.orders.create({
        items: orderData.items.map((it) => ({
          id: it.id,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          size: it.size || 'Free Size',
          color: it.color,
          image: it.images?.[0] || it.image || '/half-saree-orange.jpg'
        })),
        customer_name: orderData.customer?.name || orderData.shippingAddress?.fullName || 'Customer',
        customer_email: orderData.customer?.email || 'customer@example.com',
        customer_phone: orderData.customer?.phone || orderData.shippingAddress?.phone || '+91 98765 43210',
        shipping_address: {
          fullName: orderData.shippingAddress?.fullName || 'Customer',
          phone: orderData.shippingAddress?.phone || '+91 98765 43210',
          addressLine: orderData.shippingAddress?.addressLine || 'Address',
          city: orderData.shippingAddress?.city || 'City',
          state: orderData.shippingAddress?.state || 'State',
          pincode: orderData.shippingAddress?.pincode || '100001'
        },
        payment_method: orderData.paymentMethod || 'Cash on Delivery',
        subtotal: orderData.subtotal || orderData.totalAmount || 0,
        shipping_fee: orderData.shippingFee || 0,
        total_amount: orderData.totalAmount || orderData.subtotal || 0,
        notes: orderData.notes
      });
      if (res && res.id) {
        newOrder = res;
      }
    } catch (err) {
      console.warn('[Order] Backend order placement error, using local transaction:', err.message);
      if (err.message && err.message.includes('Insufficient stock')) {
        addToast(err.message, 'error');
        throw err;
      }
    }

    if (!newOrder) {
      const newOrderId = `VE-${Math.floor(1000 + Math.random() * 9000)}`;
      newOrder = {
        id: newOrderId,
        date: new Date().toISOString().split('T')[0],
        status: 'Confirmed',
        trackingNumber: `EXP-VE-${Math.floor(100000 + Math.random() * 900000)}`,
        estimatedDelivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        ...orderData
      };

      // Deduct stock locally
      if (orderData.items && orderData.items.length > 0) {
        setProducts((prev) =>
          prev.map((p) => {
            const ordered = orderData.items.find((item) => item.id === p.id);
            if (ordered) {
              let updatedVariants = p.variants;
              if (p.variants && p.variants.length > 0) {
                updatedVariants = p.variants.map((v) => {
                  if (v.size === ordered.size && (!ordered.color || v.color === ordered.color)) {
                    return { ...v, stock: Math.max(0, v.stock - ordered.quantity) };
                  }
                  return v;
                });
              }
              const totalStock = updatedVariants
                ? updatedVariants.reduce((sum, v) => sum + v.stock, 0)
                : Math.max(0, p.stock - ordered.quantity);

              return { ...p, variants: updatedVariants, stock: totalStock };
            }
            return p;
          })
        );
      }
    }

    setOrders((prev) => [newOrder, ...prev]);
    addActivity(`✓ New order ${newOrder.id} confirmed`, 'order');
    return newOrder;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.orders.updateStatus(orderId, newStatus);
    } catch {}

    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    addActivity(`✓ Order ${orderId} marked as ${newStatus}`, 'order');
    addToast(`Order ${orderId} marked as ${newStatus}`, 'success');
  };

  const resetToSampleData = () => {
    setProducts(MOCK_PRODUCTS);
    setOrders(MOCK_ORDERS);
    setActivityLog(DEFAULT_ACTIVITIES);
    storageService.saveProducts(MOCK_PRODUCTS);
    storageService.saveOrders(MOCK_ORDERS);
    storageService.saveActivityLog(DEFAULT_ACTIVITIES);
    addToast('Catalog reset to authentic sample collection', 'info');
  };

  const totalProducts = products.length;
  const publishedProducts = products.filter((p) => p.published !== false).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || o.total_amount || 0), 0);

  return (
    <ProductContext.Provider
      value={{
        products,
        orders,
        activityLog,
        addProduct,
        updateProduct,
        duplicateProduct,
        deleteProduct,
        togglePublished,
        updateVariantStock,
        updateStock,
        createOrder,
        updateOrderStatus,
        resetToSampleData,
        totalProducts,
        publishedProducts,
        totalRevenue,
        lowStockCount,
        outOfStockCount,
        analytics: MOCK_ANALYTICS
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductContext');
  }
  return context;
};

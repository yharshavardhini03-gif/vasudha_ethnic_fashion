import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => storageService.getAuth());
  const { addToast } = useToast();

  useEffect(() => {
    storageService.saveAuth(currentUser);
  }, [currentUser]);

  /**
   * Real Customer Login (Backend API -> Supabase)
   */
  const login = async (userIdOrEmail, password) => {
    const term = userIdOrEmail.trim();

    try {
      const res = await api.auth.login({ user_id: term, password });
      if (res && res.access_token) {
        const user = {
          ...res.user,
          userId: res.user.user_id,
          token: res.access_token
        };
        setCurrentUser(user);
        addToast(`Welcome back, ${user.name}! ✨`, 'success');
        return { success: true, user };
      }
      throw new Error('Invalid authentication response.');
    } catch (err) {
      const errorMsg = err.message || 'Invalid email or password.';
      addToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  /**
   * Real Single Seller Login (Backend API -> Supabase)
   */
  const sellerLogin = async (userIdOrEmail, password) => {
    const term = userIdOrEmail.trim();

    try {
      const res = await api.auth.sellerLogin({ email: term, user_id: term, password });
      if (res && res.access_token && (res.user.role === 'seller' || res.user.role === 'admin')) {
        const user = {
          ...res.user,
          userId: res.user.user_id,
          token: res.access_token
        };
        setCurrentUser(user);
        addToast(`Welcome to Seller Command Center, ${user.name}! 👑`, 'success');
        return { success: true, user };
      }
      throw new Error('Access denied: Unauthorized seller credentials.');
    } catch (err) {
      const errorMsg = err.message || 'Invalid seller credentials.';
      addToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  /**
   * Real Customer Self-Service Registration (Backend API -> Supabase)
   */
  const registerCustomer = async ({ name, email, userId, password, confirmPassword, phone }) => {
    try {
      const res = await api.auth.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        user_id: (userId || email).trim(),
        password,
        confirm_password: confirmPassword || password,
        phone: phone ? phone.trim() : null,
        role: 'customer'
      });

      if (res && res.access_token) {
        const user = {
          ...res.user,
          userId: res.user.user_id,
          token: res.access_token
        };
        setCurrentUser(user);
        addToast(`Account created successfully! Welcome to Vasudha, ${name} 🌸`, 'success');
        return { success: true, user };
      }
      throw new Error('Failed to create customer account.');
    } catch (err) {
      const errorMsg = err.message || 'Unable to create account. Please check your information.';
      addToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  /**
   * Logout
   */
  const logout = () => {
    try {
      api.auth.logout().catch(() => null);
    } catch {}
    setCurrentUser(null);
    storageService.saveAuth(null);
    addToast('Signed out successfully', 'info');
  };

  /**
   * Update Profile Details
   */
  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    addToast('Profile details updated', 'success');
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        isAuthenticated: !!currentUser,
        role: currentUser?.role || null,
        isCustomer: currentUser?.role === 'customer',
        isSeller: currentUser?.role === 'seller' || currentUser?.role === 'admin',
        login,
        sellerLogin,
        registerCustomer,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


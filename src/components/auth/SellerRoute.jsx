import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const SellerRoute = ({ children }) => {
  const { isAuthenticated, isSeller } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !isSeller) {
    return <Navigate to="/seller/login" state={{ from: location }} replace />;
  }

  return children;
};

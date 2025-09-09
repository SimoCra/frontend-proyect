import React, { useEffect, createContext, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getMe,
  forgotPassword as forgotPasswordService,
  verifyResetToken as verifyResetTokenService,
  resetPassword as resetPasswordService 
} from '../services/authService';

import {
  deleteUserById as deleteUserService,
  editUser as editUserService
} from '../services/userService';

import {
  createProduct as createProductService,
  getProducts as getProductsService,
  getProductByName as getProductByNameService
} from '../services/productService';

import { getDataDashboard as getDataDashboardService } from '../services/dashboardService';

import {
  registerAddress as registerAddressService,
  getUserAddresses as getUserAddressesService,
  checkoutOrder as checkoutOrderService,
  getMyOrders as getMyOrdersService,
  getAllOrders as getAllOrdersService,
  updateOrderStatus as updateOrderStatusService
} from '../services/orderService';

// --- Reviews ---
import {
  createReview as createReviewService,
  getReviewsByProduct as getReviewsByProductService,
  getProductAverageRating as getProductAverageRatingService,
  deleteReview as deleteReviewService
} from '../services/productService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Obtener el usuario al cargar la app
  useEffect(() => {
    getMe()
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  // --- Métodos Auth ---
  const login = async (email, password) => {
    try {
      setActionLoading(true);
      await loginService(email, password);
      const user = await getMe();
      setUser(user);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      setActionLoading(true);
      await registerService(formData);
      navigate('/login');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const logout = async () => {
    try {
      setActionLoading(true);
      await logoutService();
      setUser(null);
      navigate('/');
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    return await forgotPasswordService(email);
  };

  const verifyTokenPassword = async (token) => {
    return await verifyResetTokenService(token);
  };

  const resetPassword = async (token, newPassword, newPasswordValidate) => {
    try {
      setActionLoading(true);
      const res = await resetPasswordService(token, newPassword, newPasswordValidate);
      return res.message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // --- Métodos User ---
  const deleteUser = async (userId) => {
    return await deleteUserService(userId);
  };

  const editUser = async (id, email, name, phone) => {
    return await editUserService(id, email, name, phone);
  };

  // --- Métodos Product ---
  const createProduct = async (formData) => {
    return await createProductService(formData);
  };

  const getProducts = useCallback(async (page = 1, limit = 30) => {
    const data = await getProductsService(page, limit);
    setProducts(data.products || []); 
    return data;
  }, []);

  const getProductByName = async (name) => {
    return await getProductByNameService(name);
  };

  // --- Reviews ---
  const createReview = async (reviewData) => {
    return await createReviewService(reviewData);
  };

  const getReviewsByProduct = async (productId, page, limit) => {
    return await getReviewsByProductService(productId, page, limit);
  };

  const getProductAverageRating = async (productId) => {
    return await getProductAverageRatingService(productId);
  };

  const deleteReview = async (reviewId) => {
    return await deleteReviewService(reviewId);
  };

  // --- Dashboard ---
  const getDataDashboard = async () => {
    return await getDataDashboardService();
  };

  // --- Address ---
  const registerAddress = async (addressData) => {
    return await registerAddressService(addressData);
  };

  const getUserAddresses = async () => {
    return await getUserAddressesService();
  };

  const selectAddress = (address) => {
    setSelectedAddress(address);
  };

  // --- Checkout ---
  const checkout = async () => {
    if (!selectedAddress) throw new Error("Debes seleccionar una dirección antes de confirmar la orden");
    return await checkoutOrderService(selectedAddress.id);
  };

  // --- Orders ---
  const getMyOrders = async () => await getMyOrdersService();
  const getAllOrders = async () => await getAllOrdersService();
  const updateOrderStatus = async (orderId, newStatus, userId) => await updateOrderStatusService(orderId, newStatus, userId);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        actionLoading,
        error,
        login,
        register,
        logout,
        forgotPassword,
        verifyTokenPassword,
        resetPassword,
        editUser,
        deleteUser,
        createProduct,
        getProducts,
        getProductByName,
        products,
        getDataDashboard,
        registerAddress,
        getUserAddresses,
        selectedAddress,
        selectAddress,
        checkout,
        getMyOrders,
        getAllOrders,
        updateOrderStatus,
        // --- Reviews ---
        createReview,
        getReviewsByProduct,
        getProductAverageRating,
        deleteReview,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// src/context/CartContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import {
  addToCart as addToCartService,
  deleteProductCart as deleteProductCartService,
  updateCartItem as updateCartItemService,
  getCartSummary as getSummaryService
} from "../services/cartService";

import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Cargar carrito desde backend cuando haya un usuario
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (user) {
          const res = await getSummaryService();
          setCartItems(res.items || []); // aseguramos que sea array
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Error cargando el carrito:", err);
        setCartItems([]);
      }
    };

    fetchCart();
  }, [user]);

  // Obtener resumen del carrito
  const getSummaryCart = async () => {
    try {
      const res = await getSummaryService();
      setCartItems(res.items || []);
      return res;
    } catch (err) {
      console.error("Error obteniendo resumen del carrito:", err);
      return { items: [], total: 0, totalUniqueItems: 0, totalQuantity: 0 };
    }
  };

  // Agregar producto al carrito (ahora con variantId)
  const addToCart = async (cartId, productId, variantId, quantity) => {
    try {
      await addToCartService(cartId, productId, variantId, quantity);
      // Refrescar carrito luego de agregar
      await getSummaryCart();
    } catch (err) {
      console.error("Error agregando producto al carrito:", err);
      throw err;
    }
  };

  // Eliminar producto del carrito (requiere variantId)
  const deleteProductCart = async (productId, variantId) => {
    try {
      await deleteProductCartService(productId, variantId);
      // Refrescar carrito luego de eliminar
      await getSummaryCart();
    } catch (err) {
      console.error("Error eliminando producto del carrito:", err);
      throw err;
    }
  };

  // Actualizar cantidad de un producto
  const updateCartItem = async (cartItemId, newQuantity) => {
    try {
      await updateCartItemService(cartItemId, newQuantity);
      // Refrescar carrito luego de actualizar cantidad
      await getSummaryCart();
    } catch (err) {
      console.error("Error actualizando cantidad del carrito:", err);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setCartItems([]); // limpiar estado local
      // 🔹 Si quieres limpiar también en backend:
      // const data = await clearCartService();
      // setCartItems(data);
    } catch (err) {
      console.error("Error al limpiar carrito:", err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        deleteProductCart,
        updateCartItem,
        getSummaryCart,
        setCartItems,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useCart = () => useContext(CartContext);

export default CartContext;

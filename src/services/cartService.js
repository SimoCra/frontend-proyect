// services/cartService.js
import { api } from "./api";
import { getFingerprint } from "./fingerPrint";

const CART_URL = "/cart";

// ➕ Agregar producto al carrito
export const addToCart = async (cartId, productId, variantId, quantity) => {
  const fp = await getFingerprint();

  try {
    const res = await api.post(
      `${CART_URL}/add`,
      { cartId, productId, variantId, quantity },
      {
        headers: { "x-client-fingerprint": fp },
      }
    );
    return res.data.message;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al agregar al carrito";
    throw new Error(msg);
  }
};

// 📦 Obtener resumen del carrito
export const getCartSummary = async () => {
  const fp = await getFingerprint();

  try {
    const res = await api.get(`${CART_URL}/summary`, {
      headers: { "x-client-fingerprint": fp },
    });
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al obtener el carrito";
    throw new Error(msg);
  }
};

// ❌ Eliminar producto del carrito
export const deleteProductCart = async (productId, variantId) => {
  const fp = await getFingerprint();

  if (!variantId) {
    throw new Error("variantId es requerido para eliminar el producto del carrito");
  }

  try {
    const res = await api.delete(`${CART_URL}/remove`, {
      headers: { "x-client-fingerprint": fp },
      data: { productId, variantId }, // body permitido en DELETE
    });
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.message || "Error al eliminar producto del carrito";
    throw new Error(msg);
  }
};

// ✏️ Actualizar cantidad de un producto en el carrito
export const updateCartItem = async (cartItemId, newQuantity) => {
  const fp = await getFingerprint();

  if (!cartItemId || typeof cartItemId !== "number") {
    throw new Error(`ID del item inválido: ${cartItemId}`);
  }

  try {
    const res = await api.put(
      `${CART_URL}/update/${cartItemId}`,
      { quantity: newQuantity },
      {
        headers: { "x-client-fingerprint": fp },
      }
    );
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.message ||
      "Error al actualizar cantidad del producto";
    throw new Error(msg);
  }
};

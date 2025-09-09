import axios from "axios";
import { getFingerprint } from './fingerPrint';
const API_URL = 'http://localhost:5000/api/cart';

export const addToCart = async (cartId, productId, variantId, quantity) => {
  const fp = await getFingerprint();
  
  try {
    const res = await axios.post(
      `${API_URL}/add`,
      { cartId, productId, variantId, quantity },
      {
        headers: { 'x-client-fingerprint': fp },
        withCredentials: true
      }
    );
    return res.data.message;
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al agregar al carrito';
    throw new Error(msg);
  }
};


export const getCartSummary = async () => {
  const fp = await getFingerprint();
  try {
    const res = await axios.get(`${API_URL}/summary`, {
      headers: { 'x-client-fingerprint': fp },
      withCredentials: true,
    });
    return res.data; 
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al obtener el carrito';
    throw new Error(msg);
  }
};


// services/cartService.js
export const deleteProductCart = async (productId, variantId) => {
  const fp = await getFingerprint();

  if (!variantId) {
    throw new Error('variantId es requerido para eliminar el producto del carrito');
  }

  try {
    const res = await axios.delete(`${API_URL}/remove`, {
      headers: { 'x-client-fingerprint': fp },
      withCredentials: true,
      data: { productId, variantId },  // <-- Aquí va el body en axios para DELETE
    });
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || 'Error al eliminar producto del carrito';
    throw new Error(msg);
  }
};





export const updateCartItem = async (cartItemId, newQuantity) => {
  const fp = await getFingerprint();

  if (!cartItemId || typeof cartItemId !== 'number') {
    throw new Error(`ID del item inválido: ${cartItemId}`);
  }

  try {
    const res = await axios.put(
      `${API_URL}/update/${cartItemId}`,
      { quantity: newQuantity },
      {
        headers: { 'x-client-fingerprint': fp },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.message ||
      'Error al actualizar cantidad del producto';
    throw new Error(msg);
  }
};

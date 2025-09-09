import axios from "axios";
import { getFingerprint } from "./fingerPrint";

const API_URL = "http://localhost:5000/api/orders";

// ========================= DIRECCIONES ========================= //

// Obtener direcciones de un usuario
export const getUserAddresses = async () => {
  const fp = await getFingerprint();
  try {
    const res = await axios.get(`${API_URL}/addresses`, {
      headers: { "x-client-fingerprint": fp },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al obtener direcciones";
    throw new Error(msg);
  }
};

// Registrar una nueva dirección
export const registerAddress = async (addressData) => {
  const fp = await getFingerprint();
  try {
    const res = await axios.post(`${API_URL}/addresses`, addressData, {
      headers: { "x-client-fingerprint": fp },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.log(error.response?.data?.message);
    const msg =
      error.response?.data?.message || "Error al registrar la dirección";
    throw new Error(msg);
  }
};

// ========================= CHECKOUT ========================= //

// Procesar el checkout con la dirección seleccionada
export const checkoutOrder = async (addressId) => {
  if (!addressId) {
    throw new Error("Debes seleccionar una dirección de envío.");
  }

  const fp = await getFingerprint();
  try {
    const res = await axios.post(
      `${API_URL}/checkout`,
      { addressId },
      {
        headers: { "x-client-fingerprint": fp },
        withCredentials: true,
      }
    );

    // Se espera que el backend retorne: { message, order: { id, userId, total, items, addressId } }
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al procesar la compra";
    throw new Error(msg);
  }
};

// ========================= PEDIDOS ========================= //

// Obtener pedidos del usuario autenticado
export const getMyOrders = async () => {
  const fp = await getFingerprint();
  try {
    const res = await axios.get(`${API_URL}/my-orders`, {
      headers: { "x-client-fingerprint": fp },
      withCredentials: true,
    });
    // Devuelve: { orders: [...] }
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al obtener tus pedidos";
    throw new Error(msg);
  }
};

// Obtener todos los pedidos (solo admin)
export const getAllOrders = async () => {
  const fp = await getFingerprint();
  try {
    const res = await axios.get(`${API_URL}/all-orders`, {
      headers: { "x-client-fingerprint": fp },
      withCredentials: true,
    });
    return res.data; 
  } catch (error) {
    const msg =
      error.response?.data?.message || "Error al obtener todos los pedidos";
    throw new Error(msg);
  }
};

// ========================= ACTUALIZAR ESTADO DEL PEDIDO (ADMIN) ========================= //


export const updateOrderStatus = async (orderId, newStatus, userId) => {

  console.log(`Order: ${orderId}`)
  console.log(`Status: ${newStatus}`)
  console.log(`UserId: ${userId}`)
  if (!orderId || !newStatus) {
    throw new Error("Debe proporcionar el ID del pedido y el nuevo estado.");
  }

  const fp = await getFingerprint();
  try {
    const res = await axios.put(
      `${API_URL}/orders/status`,
      { orderId, newStatus, userId },
      {
        headers: { "x-client-fingerprint": fp },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.message || "Error al actualizar el estado del pedido";
    throw new Error(msg);
  }
};

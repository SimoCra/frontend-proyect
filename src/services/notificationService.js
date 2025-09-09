import axios from "axios";
import { getFingerprint } from "./fingerPrint";

const API_URL = "http://localhost:5000/api/notifications";

// ✅ Obtener últimas 10 notificaciones (globales y propias)
export const getNotifications = async (userId) => {
  const fp = await getFingerprint();
  try {
    const res = await axios.get(`${API_URL}/${userId}`, {
      headers: { "x-client-fingerprint": fp },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.message || "Error al obtener las notificaciones";
    throw new Error(msg);
  }
};

// ✅ Eliminar notificación por ID
export const deleteNotification = async (notificationId) => {
  const fp = await getFingerprint();
  try {
    const res = await axios.delete(`${API_URL}/${notificationId}`, {
      headers: { "x-client-fingerprint": fp },
      withCredentials: true,
    });
    return res.data; // { success: true }
  } catch (error) {
    const msg =
      error.response?.data?.message || "Error al eliminar la notificación";
    throw new Error(msg);
  }
};

// ✅ Marcar todas las notificaciones del usuario como leídas
export const markNotificationsAsReadByUser = async (userId) => {
  const fp = await getFingerprint();
  try {
    const res = await axios.put(
      `${API_URL}/mark-read/${userId}`,
      {},
      {
        headers: { "x-client-fingerprint": fp },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.message ||
      "Error al marcar las notificaciones como leídas";
    throw new Error(msg);
  }
};

// ✅ Crear notificación global (solo admin)
export const createGlobalNotification = async (title, message, type) => {
  const fp = await getFingerprint();
  try {
    const res = await axios.post(
      `${API_URL}/add-global-notification`,
      { title, message, type },
      {
        headers: { "x-client-fingerprint": fp },
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.message ||
      "Error al crear la notificación global";
    throw new Error(msg);
  }
};

// ✅ Marcar notificación global como leída (por usuario autenticado)
export const markGlobalNotificationAsRead = async (notificationId) => {
  const fp = await getFingerprint();
  try {
    const res = await axios.put(
      `${API_URL}/global/${notificationId}/read`,
      {},
      {
        headers: { "x-client-fingerprint": fp },
        withCredentials: true,
      }
    );
    return res.data; // { success: true }
  } catch (error) {
    const msg =
      error.response?.data?.message ||
      "Error al marcar la notificación global como leída";
    throw new Error(msg);
  }
};

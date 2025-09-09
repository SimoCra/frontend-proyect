import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getNotifications as getNotificationsService,
  deleteNotification as deleteNotificationService,
  markNotificationsAsReadByUser,
  createGlobalNotification as createGlobalNotificationService,
} from "../services/notificationService";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Cargar notificaciones cuando el usuario cambia
  useEffect(() => {
    if (user?.id) {
      loadNotifications(user.id);
    } else {
      setNotifications([]);
    }
  }, [user]);

  // 🔹 Cargar notificaciones de un usuario
  const loadNotifications = async (userIdParam) => {
    const userIdToUse = userIdParam || user?.id;
    if (!userIdToUse) return;
    if (loading) return; // evita llamadas dobles
    setLoading(true);
    setError(null);

    try {
      const data = await getNotificationsService(userIdToUse);
      setNotifications(data);
    } catch (err) {
      setError(err.message || "Error al cargar notificaciones");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Eliminar notificación por ID
  const removeNotification = async (id) => {
    try {
      await deleteNotificationService(id);
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (err) {
      console.error("Error eliminando notificación:", err);
      setError(err.message || "Error al eliminar notificación");
    }
  };

  // 🔹 Marcar todas las notificaciones de un usuario como leídas
  const markAllAsRead = async () => {
    if (!user?.id) return;
    try {
      await markNotificationsAsReadByUser(user.id);
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
    } catch (err) {
      console.error("Error marcando notificaciones como leídas:", err);
      setError(err.message || "Error al marcar notificaciones como leídas");
    }
  };

  // 🔹 Crear notificación global (solo admin)
  const addGlobalNotification = async (title, message, type) => {
    try {
      const newNotif = await createGlobalNotificationService(
        title,
        message,
        type
      );

      // ⚡️ Si el usuario actual es admin, se refresca lista automáticamente
      if (user?.role === "admin") {
        await loadNotifications();
      }

      return newNotif;
    } catch (err) {
      console.error("Error creando notificación global:", err);
      setError(err.message || "Error al crear notificación global");
      throw err;
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        error,
        loadNotifications,
        removeNotification,
        markAllAsRead,
        addGlobalNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createContactRequest as createContactRequestService,
  fetchAllContactRequests as fetchAllContactRequestsService,
  updateContactRequestStatus as updateContactRequestStatusService,
  deleteContactRequest as deleteContactRequestService,
} from "../services/contactRequestService";
import { useAuth } from "./AuthContext";

const ContactContext = createContext();

export const ContactProvider = ({ children }) => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Paginación
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // 📌 Cargar solicitudes con paginación
  const loadContactRequests = async (newPage = 1) => {
    if (!user || user.role !== "admin") return;
    setLoading(true);
    setError(null);

    try {
      const { data, total } = await fetchAllContactRequestsService(newPage, limit);
      setRequests(Array.isArray(data) ? data : []);
      setTotalPages(Math.max(Math.ceil(total / limit), 1));
      setPage(newPage);
    } catch (err) {
      console.error("❌ Error cargando solicitudes:", err);
      setError(err.message || "Error al cargar solicitudes");
      setRequests([]);
      setTotalPages(1);
      setPage(1);
    } finally {
      setLoading(false);
    }
  };

  // 📌 Crear solicitud de contacto (público)
  const addContactRequest = async (name, email, subject, message) => {
    setError(null);
    try {
      const newRequest = await createContactRequestService(name, email, subject, message);
      return newRequest;
    } catch (err) {
      console.error("❌ Error creando solicitud:", err);
      setError(err.message || "Error al crear solicitud de contacto");
      throw err;
    }
  };

  // 📌 Actualizar estado de solicitud
  const changeContactRequestStatus = async (id, status) => {
    const validStatuses = ["pendiente", "en_proceso", "resuelto"];
    if (!validStatuses.includes(status)) {
      throw new Error("Estado inválido");
    }

    try {
      const updated = await updateContactRequestStatusService(id, status);
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status } : req))
      );
      return updated;
    } catch (err) {
      console.error("❌ Error actualizando estado:", err);
      setError(err.message || "Error al actualizar estado de la solicitud");
      throw err;
    }
  };

  // 📌 Eliminar solicitud
  const removeContactRequest = async (id) => {
    try {
      await deleteContactRequestService(id);
      setRequests((prev) => prev.filter((req) => req.id !== id));

      // Retroceder página si queda vacía
      if (requests.length === 1 && page > 1) {
        await loadContactRequests(page - 1);
      }
    } catch (err) {
      console.error("❌ Error eliminando solicitud:", err);
      setError(err.message || "Error al eliminar la solicitud");
      throw err;
    }
  };

  // Auto-carga al montar o cambiar usuario
  useEffect(() => {
    if (user?.role === "admin") {
      loadContactRequests(1);
    } else {
      setRequests([]);
      setPage(1);
      setTotalPages(1);
    }
  }, [user]);

  return (
    <ContactContext.Provider
      value={{
        requests,
        loading,
        error,
        page,
        totalPages,
        limit,
        loadContactRequests,
        addContactRequest,
        changeContactRequestStatus,
        removeContactRequest,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => useContext(ContactContext);

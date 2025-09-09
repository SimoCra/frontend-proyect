import axios from "axios";
import { getFingerprint } from "./fingerPrint";

const API_URL = "http://localhost:5000/contact-us";

/**
 * Configuración común de headers con fingerprint
 */
const getConfig = async () => {
  const fp = await getFingerprint();
  return {
    headers: { "x-client-fingerprint": fp },
    withCredentials: true,
  };
};

/**
 * ✅ Crear una solicitud de contacto (público)
 */
export const createContactRequest = async (name, email, subject, message) => {
  try {
    const res = await axios.post(`${API_URL}`, { name, email, subject, message });
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.message || "Error al enviar la solicitud de contacto";
    throw new Error(msg);
  }
};

/**
 * ✅ Obtener todas las solicitudes (solo admin) con paginación
 */
export const fetchAllContactRequests = async (page = 1, limit = 20) => {
  try {
    const config = await getConfig();
    const res = await axios.get(`${API_URL}`, {
      ...config,
      params: { page, limit },
    });

    const raw = res.data;



    return {
      data: Array.isArray(raw.data) ? raw.data : [],
      total: typeof raw.total === "number" ? raw.total : 0,
      page: typeof raw.page === "number" ? raw.page : page,
      totalPages:
        typeof raw.totalPages === "number"
          ? raw.totalPages
          : Math.max(Math.ceil((raw.total || 0) / limit), 1),
    };
  } catch (error) {
    const msg =
      error.response?.data?.message || "Error al obtener solicitudes de contacto";
    throw new Error(msg);
  }
};


/**
 * ✅ Actualizar estado de una solicitud (solo admin)
 */
export const updateContactRequestStatus = async (id, status) => {
  try {
    const config = await getConfig();
    const res = await axios.put(`${API_URL}/${id}/status`, { status }, config);
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.message || "Error al actualizar estado de la solicitud";
    throw new Error(msg);
  }
};

/**
 * ✅ Eliminar una solicitud (solo admin)
 */
export const deleteContactRequest = async (id) => {
  try {
    const config = await getConfig();
    const res = await axios.delete(`${API_URL}/${id}`, config);
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.message || "Error al eliminar la solicitud";
    throw new Error(msg);
  }
};

import { api } from "./api";
import { getFingerprint } from "./fingerPrint";

const BASE_URL = "/user";

// ========================= ADMIN ========================= //

// 📌 Eliminar usuario por ID (solo admin)
export const deleteUserById = async (userId) => {
  const fp = await getFingerprint();
  try {
    const res = await api.delete(`${BASE_URL}/admin/users/${userId}`, {
      headers: { "x-client-fingerprint": fp },
    });
    return res.data.message;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al eliminar usuario";
    throw new Error(msg);
  }
};

// 📌 Obtener todos los usuarios (solo admin, con paginación)
export const fetchAllUsers = async (page = 1, limit = 25) => {
  const fp = await getFingerprint();
  try {
    const res = await api.get(`${BASE_URL}/admin`, {
      headers: { "x-client-fingerprint": fp },
      params: { page, limit },
    });
    return res.data; // { users, page, limit, total }
  } catch (error) {
    const msg = error.response?.data?.message || "Error al obtener usuarios";
    throw new Error(msg);
  }
};

// ========================= USUARIOS ========================= //

// 📌 Editar usuario (propio o admin)
export const editUser = async (id, email, name, phone) => {
  const fp = await getFingerprint();
  try {
    const res = await api.put(
      `${BASE_URL}/${id}`,
      { email, name, phone },
      { headers: { "x-client-fingerprint": fp } }
    );
    return res.data.message;
  } catch (error) {
    const msg =
      error.response?.data?.message || "Error al actualizar usuario";
    throw new Error(msg);
  }
};

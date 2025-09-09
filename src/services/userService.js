import axios from "axios";
import { getFingerprint } from './fingerPrint';
 const fp = await getFingerprint();
export const deleteUserById = async (userId) => {
  try {
    const res = await axios.delete(
      `http://localhost:5000/api/user/admin/users/${userId}`,
      {  headers: {'x-client-fingerprint': fp  }, withCredentials: true}
    );
    return res.data.message;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al eliminar usuario";
    throw new Error(msg);
  }
};

export const editUser = async (id, email, name, phone) => {
  try {
    const res = await axios.put(
      `http://localhost:5000/api/user/${id}`,
      { email, name, phone },
      {  headers: {'x-client-fingerprint': fp  }, withCredentials: true}
    );
    return res.data.message;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al actualizar usuario";
    throw new Error(msg);
  }
};

export const fetchAllUsers = async (page = 1, limit = 25) => {
  try {
    const res = await axios.get(
      `http://localhost:5000/api/user/admin?page=${page}&limit=${limit}`,
      {
        headers: { 'x-client-fingerprint': fp },
        withCredentials: true,
      }
    );

    // 👇 devuelve toda la respuesta (incluye page, limit, users)
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al obtener usuarios";
    throw new Error(msg);
  }
};

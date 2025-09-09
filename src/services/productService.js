import axios from "axios";
import { getFingerprint } from "./fingerPrint";

const API_URL = "http://localhost:5000/api/products";

// ========================= PRODUCTOS ========================= //

// 📌 Crear producto (solo admin)
export const createProduct = async (formData) => {
  const fp = await getFingerprint();
  try {
    const res = await axios.post(`${API_URL}/admin/create-product`, formData, {
      headers: {
        "x-client-fingerprint": fp,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al crear producto";
    throw new Error(msg);
  }
};

// 📌 Obtener productos (público)
export const getProducts = async (page = 1, limit = 30) => {
  try {
    const res = await axios.get(
      `${API_URL}/home/get-products-public?page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al obtener productos";
    throw new Error(msg);
  }
};

// 📌 Obtener producto por nombre
export const getProductByName = async (name) => {
  try {
    const res = await axios.get(
      `${API_URL}/home/get-product/${encodeURIComponent(name)}`
    );
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.message || "Error al obtener el producto";
    throw new Error(msg);
  }
};

// ========================= VARIANTES ========================= //

// 📌 Crear variantes de un producto (solo admin)
export const createVariants = async (productId, variantsArray) => {
  if (!productId) throw new Error("El ID del producto es obligatorio");
  if (!variantsArray || !Array.isArray(variantsArray) || variantsArray.length === 0) {
    throw new Error("Se requiere al menos una variante");
  }

  const fp = await getFingerprint();
  const formData = new FormData();
  formData.append("productId", productId);

  // Solo 1 variante por request
  const variant = variantsArray[0];
  formData.append("variantId", variant.variantId);
  formData.append("color", variant.color);
  formData.append("style", variant.style);
  formData.append("price", variant.price);

  if (variant.imageFile) {
    formData.append("imageFile", variant.imageFile);
  } else if (variant.image_url) {
    formData.append("image_url", variant.image_url);
  }

  try {
    const res = await axios.post(`${API_URL}/admin/variants`, formData, {
      headers: {
        "x-client-fingerprint": fp,
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al crear variantes";
    throw new Error(msg);
  }
};

// 📌 Eliminar variante por ID (solo admin)
export const deleteVariant = async (variantId) => {
  const fp = await getFingerprint();
  try {
    const res = await axios.delete(`${API_URL}/admin/variants/${variantId}`, {
      headers: { "x-client-fingerprint": fp },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al eliminar variante";
    throw new Error(msg);
  }
};

// 📌 Obtener variantes de un producto (público)
export const getVariantsByProduct = async (productId) => {
  const fp = await getFingerprint();
  try {
    const res = await axios.get(`${API_URL}/admin/variants/${productId}`, {
      headers: { "x-client-fingerprint": fp },
      withCredentials: true,
    });
    return res.data.variants; // solo el array
  } catch (error) {
    const msg = error.response?.data?.message || "Error al obtener variantes";
    throw new Error(msg);
  }
};

// ========================= RESEÑAS ========================= //

// 📌 Crear reseña (usuario autenticado)
export const createReview = async ({ productId, rating, comment }) => {
  const fp = await getFingerprint();
  try {
    const res = await axios.post(
      `${API_URL}/reviews`,
      { product_id: productId, rating, comment },
      { headers: { "x-client-fingerprint": fp }, withCredentials: true }
    );
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al crear la reseña";
    throw new Error(msg);
  }
};

// 📌 Obtener reseñas de un producto (con paginación)
export const getReviewsByProduct = async (productId, page = 1, limit = 10) => {
  try {
    const res = await axios.get(
      `${API_URL}/reviews/${productId}?page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al obtener reseñas";
    throw new Error(msg);
  }
};

// 📌 Obtener promedio de reseñas de un producto
export const getProductAverageRating = async (productId) => {
  try {
    const res = await axios.get(`${API_URL}/reviews/${productId}/average`);
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.message ||
      "Error al obtener promedio de reseñas";
    throw new Error(msg);
  }
};

// 📌 Eliminar reseña (usuario dueño o admin)
export const deleteReview = async (reviewId) => {
  const fp = await getFingerprint();
  try {
    const res = await axios.delete(`${API_URL}/reviews/${reviewId}`, {
      headers: { "x-client-fingerprint": fp },
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.message || "Error al eliminar la reseña";
    throw new Error(msg);
  }
};

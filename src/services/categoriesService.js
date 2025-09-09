// src/services/categoriesService.js
import { api } from "./api";
import { getFingerprint } from "./fingerPrint";

const CATEGORIES_URL = "/admin/categories";
const PRODUCTS_URL = "/admin/categories/product";

/**
 * Configuración común de headers con fingerprint
 */
const getConfig = async () => {
  const fp = await getFingerprint();
  return {
    headers: { "x-client-fingerprint": fp },
  };
};

/**
 * Categorías
 */

// Obtener todas las categorías con paginación
export const fetchAllCategories = async (limit = 20, offset = 0) => {
  try {
    const config = await getConfig();
    const res = await api.get(
      `${CATEGORIES_URL}?limit=${limit}&offset=${offset}`,
      config
    );
    return res.data.data; // backend devuelve { success, data }
  } catch (error) {
    const msg = error.response?.data?.message || "Error al obtener categorías";
    throw new Error(msg);
  }
};

// Crear una categoría (code + name + imagen opcional)
export const addCategory = async (code, name, imageFile) => {
  try {
    const config = await getConfig();
    const formData = new FormData();
    formData.append("code", code); // 👈 se envía code en vez de id
    formData.append("name", name);
    if (imageFile) formData.append("image", imageFile);

    const res = await api.post(CATEGORIES_URL, formData, {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al crear categoría";
    throw new Error(msg);
  }
};

// Actualizar categoría (code + name + imagen opcional)
export const updateCategory = async (id, code, name, imageFile) => {
  try {
    const config = await getConfig();
    const formData = new FormData();
    formData.append("code", code);
    formData.append("name", name);
    if (imageFile) formData.append("image", imageFile);

    const res = await api.put(`${CATEGORIES_URL}/${id}`, formData, {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al actualizar categoría";
    throw new Error(msg);
  }
};

// Eliminar categoría
export const deleteCategory = async (id) => {
  try {
    const config = await getConfig();
    const res = await api.delete(`${CATEGORIES_URL}/${id}`, config);
    return res.data.message;
  } catch (error) {
    const msg = error.response?.data?.message || "Error al eliminar categoría";
    throw new Error(msg);
  }
};

// Obtener productos de una categoría
export const fetchProductsByCategory = async (id) => {
  try {
    const config = await getConfig();
    const res = await api.get(`${CATEGORIES_URL}/${id}/products`, config);
    return res.data.data; // backend devuelve { success, data }
  } catch (error) {
    const msg =
      error.response?.data?.message || "Error al obtener productos de la categoría";
    throw new Error(msg);
  }
};

/**
 * Productos
 */

// Obtener un producto por ID (con variantes)
export const getProductByIdService = async (id) => {
  if (!id) throw new Error("El ID del producto es requerido");

  try {
    const config = await getConfig();
    const res = await api.get(`${PRODUCTS_URL}/${id}`, config);
    return res.data.data;
  } catch (error) {
    const msg = error.response?.data?.message || "No se pudo obtener el producto";
    throw new Error(msg);
  }
};

// Actualizar producto
export const updateProduct = async (id, productData) => {
  try {
    const config = await getConfig();

    const res = await api.put(`${PRODUCTS_URL}/${id}`, productData, config);
    return res.data; // tu backend ya devuelve el producto actualizado
  } catch (error) {
    const msg = error.response?.data?.message || "Error al actualizar producto";
    throw new Error(msg);
  }
};

// Actualizar variante de producto
export const updateProductVariantService = async (productId, variantData) => {
  if (!productId) throw new Error("El ID del producto es requerido");
  if (!variantData?.variantId) throw new Error("El ID de la variante es requerido");

  try {
    const formData = new FormData();
    formData.append("variantId", variantData.variantId);
    formData.append("color", variantData.color);
    formData.append("style", variantData.style);
    formData.append("price", variantData.price);

    if (variantData.imageFile) {
      formData.append("imageFile", variantData.imageFile);
    }

    const config = await getConfig();

    const response = await api.put(
      `${PRODUCTS_URL}/variants/${productId}`,
      formData,
      {
        ...config,
        headers: {
          ...config.headers,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data; // { message, variant }
  } catch (error) {
    const msg = error.response?.data?.message || "Error al actualizar variante";
    throw new Error(msg);
  }
};

// Eliminar producto por ID
export const deleteProductService = async (id) => {
  if (!id) throw new Error("El ID del producto es requerido");

  try {
    const config = await getConfig();
    const res = await api.delete(`${PRODUCTS_URL}/${id}`, config);
    return res.data.message;
  } catch (error) {
    const msg = error.response?.data?.message || "No se pudo eliminar el producto";
    throw new Error(msg);
  }
};

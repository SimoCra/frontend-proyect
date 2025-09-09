import React, { createContext, useContext, useState, useEffect } from "react";
import {
  fetchAllCategories as fetchAllCategoriesService,
  addCategory as addCategoryService,
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService,
  fetchProductsByCategory as fetchProductsByCategoryService,
  getProductByIdService,
  deleteProductService,
  updateProduct as updateProductService,
  updateProductVariantService,
} from "../services/categoriesService";

import {
  createVariants as createProductVariantsService,
  deleteVariant as deleteProductVariantService,
  getVariantsByProduct as getVariantsByProductService
} from "../services/productService";

const CategoriesContext = createContext();

export const CategoriesProvider = ({ children }) => {
  // --- Categorías ---
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [limit] = useState(20);

  // --- Productos ---
  const [productsByCategory, setProductsByCategory] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);

  const [currentProduct, setCurrentProduct] = useState(null);
  const [loadingCurrentProduct, setLoadingCurrentProduct] = useState(false);
  const [currentProductError, setCurrentProductError] = useState(null);

  useEffect(() => {
    loadCategories();
    setProductsByCategory([]);
    setProductsError(null);
  }, []);

  // --- Categorías ---
  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchAllCategoriesService(limit, page * limit);
      setCategories(data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (code, name, imageFile = null) => {
    try {
      setActionLoading(true);
      const newCategory = await addCategoryService(code, name, imageFile);
      setCategories(prev => [...prev, newCategory]);
      setError(null);
       loadCategories();
      return newCategory;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const updateCategory = async (id, code, name, imageFile = null) => {
    try {
      setActionLoading(true);
      const updated = await updateCategoryService(id, code, name, imageFile);
      setCategories(prev => prev.map(cat => (cat.id === id ? { ...cat, ...updated } : cat)));
      setError(null);
      loadCategories();
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    try {
      setActionLoading(true);
      const message = await deleteCategoryService(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
      setError(null);
      return message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // --- Productos por categoría ---
  const loadProductsByCategory = async (id) => {
    try {
      setLoadingProducts(true);
      setProductsError(null);
      const products = await fetchProductsByCategoryService(id);
      setProductsByCategory(products || []);
      return products;
    } catch (err) {
      setProductsError(err.message);
      setProductsByCategory([]);
      throw err;
    } finally {
      setLoadingProducts(false);
    }
  };

  // --- Producto individual ---
  const loadProductById = async (id) => {
    if (!id) {
      setCurrentProductError("El ID del producto es requerido");
      return;
    }
    try {
      setLoadingCurrentProduct(true);
      setCurrentProductError(null);

      const product = await getProductByIdService(id);
      const variants = await getVariantsByProductService(id);
      product.variants = Array.isArray(variants) ? variants.map(v => ({ ...v, preview: null, imageFile: null })) : [];

      setCurrentProduct(product);
      return product;
    } catch (err) {
      setCurrentProductError(err.message);
      setCurrentProduct(null);
      throw err;
    } finally {
      setLoadingCurrentProduct(false);
    }
  };

  // --- Producto ---
  const updateProduct = async (id, productData) => {
    if (!id) throw new Error("El ID del producto es requerido");
    if (!productData) throw new Error("Datos del producto son requeridos");

    try {
      setActionLoading(true);
      const updatedProduct = await updateProductService(id, productData);

      setProductsByCategory(prev =>
        prev.map(prod => (prod.id === id ? { ...prod, ...updatedProduct } : prod))
      );

      if (currentProduct?.id === id) setCurrentProduct(prev => ({ ...prev, ...updatedProduct }));

      setError(null);
      return updatedProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!id) throw new Error("El ID del producto es requerido");

    try {
      setActionLoading(true);
      const message = await deleteProductService(id);
      setProductsByCategory(prev => prev.filter(prod => prod.id !== id));
      if (currentProduct?.id === id) setCurrentProduct(null);
      setError(null);
      return message;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  // --- Variantes ---
  const updateProductVariant = async (productId, variantData) => {
  if (!variantData) throw new Error("Los datos de la variante son requeridos"); // ✅ validación extra

  const { variantId, color, style, price, imageFile } = variantData;

  if (!productId) throw new Error("El ID del producto es requerido");
  if (!variantId) throw new Error("El ID de la variante es requerido");

  try {
    setActionLoading(true);

    const updatedVariant = await updateProductVariantService(productId, {
      variantId,
      color,
      style,
      price,
      imageFile
    });

    if (currentProduct) {
      setCurrentProduct(prev => ({
        ...prev,
        variants: prev.variants.map(v =>
          v.id === variantId ? { ...v, ...updatedVariant.variant } : v
        )
      }));
    }

    setError(null);
    return updatedVariant.variant;
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setActionLoading(false);
  }
};



  const createProductVariants = async (productId, variantsArray) => {
    if (!productId || !variantsArray || !Array.isArray(variantsArray) || variantsArray.length === 0)
      throw new Error("Debe enviar productId y al menos una variante");

    try {
      setActionLoading(true);
      const result = await createProductVariantsService(productId, variantsArray);

      if (currentProduct) {
        const preparedVariants = variantsArray.map(v => ({ ...v, preview: null, imageFile: null }));
        setCurrentProduct(prev => ({
          ...prev,
          variants: [...prev.variants, ...preparedVariants]
        }));
      }

      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const deleteProductVariant = async (variantId) => {
    if (!variantId) throw new Error("El ID de la variante es requerido");

    try {
      setActionLoading(true);
      const result = await deleteProductVariantService(variantId);

      if (currentProduct) {
        setCurrentProduct(prev => ({
          ...prev,
          variants: prev.variants.filter(v => v.id !== variantId)
        }));
      }

      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <CategoriesContext.Provider
      value={{
        // Categorías
        categories,
        loading,
        actionLoading,
        error,
        page,
        setPage,
        limit,
        loadCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        // Productos
        productsByCategory,
        loadingProducts,
        productsError,
        loadProductsByCategory,
        // Producto individual
        currentProduct,
        setCurrentProduct, // ✅ ahora expuesto
        loadingCurrentProduct,
        currentProductError,
        loadProductById,
        updateProduct,
        deleteProduct,
        // Variantes
        updateProductVariant,
        createProductVariants,
        deleteProductVariant,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

// Hook para consumir el contexto
export const useCategories = () => useContext(CategoriesContext);

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategories } from "../../context/CategoriesContext";
import { FiLayers } from "react-icons/fi"; // 👈 importamos el icono
import "../../styles/admin_css/EditProducts.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentProduct,
    loadingCurrentProduct,
    currentProductError,
    loadProductById,
    updateProduct,
    deleteProduct,
    actionLoading,
  } = useCategories();

  const [localProduct, setLocalProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) loadProductById(id);
  }, [id]);

  useEffect(() => {
    if (currentProduct) {
      setLocalProduct({ ...currentProduct });
    }
  }, [currentProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalProduct((prev) => ({ ...prev, [name]: value }));
  };

  const toggleStock = () => {
    setLocalProduct((prev) => ({
      ...prev,
      stock: prev.stock === 1 ? 0 : 1,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (!localProduct) {
      setError("Producto no cargado");
      return;
    }

    const { name, description, price, category_id } = localProduct;

    if (!name || !description || !price || !category_id) {
      setError("Completa todos los campos requeridos");
      return;
    }

    const payload = {
      id,
      category_id: localProduct.category_id,
      name: localProduct.name,
      description: localProduct.description,
      price: localProduct.price,
      stock: localProduct.stock,
    };

    try {
      await updateProduct(id, payload);
      alert("Producto actualizado con éxito");
      navigate("/admin/categories");
    } catch (err) {
      setError("Error al actualizar: " + (err.message || err));
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      await deleteProduct(id);
      alert("Producto eliminado");
      navigate("/admin/categories");
    } catch (err) {
      alert("Error al eliminar: " + (err.message || err));
    }
  };

  if (loadingCurrentProduct) return <p>Cargando producto...</p>;
  if (currentProductError) return <p>Error: {currentProductError}</p>;
  if (!localProduct) return <p>Producto no encontrado</p>;

  return (
    <div className="create-product-wrapper">
      <form onSubmit={handleUpdate} className="create-product-container">
        {/* Datos del producto */}
        <div className="form-section">
          <div className="form-header">
            <h2>Detalles del producto</h2>
            {/* Botón de variantes 👇 */}
            <button
              type="button"
              className="variant-button"
              onClick={() => navigate(`/admin/products/edit/variants/${id}`)}
              disabled={actionLoading}
            >
              <FiLayers style={{ marginRight: "6px" }} />
              Variantes
            </button>
          </div>

          <input
            type="text"
            name="id"
            placeholder="ID"
            value={localProduct.id || ""}
            disabled
          />
          <input
            type="text"
            name="name"
            placeholder="Nombre del producto"
            value={localProduct.name || ""}
            onChange={handleChange}
            disabled={actionLoading}
          />
          <textarea
            name="description"
            placeholder="Descripción"
            value={localProduct.description || ""}
            onChange={handleChange}
            disabled={actionLoading}
          />
          <input
            type="number"
            min="0"
            name="price"
            placeholder="Precio base"
            value={localProduct.price || ""}
            onChange={handleChange}
            disabled={actionLoading}
          />
          <input
            type="text"
            name="category_id"
            placeholder="ID Categoría"
            value={localProduct.category_id || ""}
            onChange={handleChange}
            disabled={actionLoading}
          />

          <div className="stock-toggle">
            <label>Disponibilidad:</label>
            <button
              type="button"
              className={`stock-button ${
                localProduct.stock === 1 ? "available" : "not-available"
              }`}
              onClick={toggleStock}
              disabled={actionLoading}
            >
              {localProduct.stock === 1 ? "Disponible" : "No disponible"}
            </button>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={actionLoading}
          >
            {actionLoading ? "Actualizando..." : "Actualizar producto"}
          </button>
          <button
            type="button"
            className="remove-variant-btn"
            style={{ marginTop: "10px", width: "100%", color: "red" }}
            onClick={handleDelete}
            disabled={actionLoading}
          >
            {actionLoading ? "Eliminando..." : "Eliminar producto"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default EditProduct;

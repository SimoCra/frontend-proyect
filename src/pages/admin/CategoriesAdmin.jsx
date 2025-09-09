import React, { useState } from "react";
import { useCategories } from "../../context/CategoriesContext";
import { FiUploadCloud } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "../../styles/admin_css/CategoriesAdmin.css";

const CategoriesAdmin = () => {
  const {
    categories,
    loading,
    error,
    actionLoading,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Estados para formulario
  const [categoryId, setCategoryId] = useState("");
  const [categoryCode, setCategoryCode] = useState(""); // <-- Nuevo estado para code
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [categoryPreview, setCategoryPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const navigate = useNavigate();

  
  // Filtrado simple
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  // Manejo de imagen (file input y drag&drop)
  const handleImageChange = (files) => {
    const file = files[0];
    setCategoryImage(file);
    setCategoryPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleFileInput = (e) => handleImageChange(e.target.files);
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleImageChange(e.dataTransfer.files);
  };

  // Abrir modal para agregar categoría
  const openAddModal = () => {
    setCategoryId("");
    setCategoryCode("");
    setCategoryName("");
    setCategoryImage(null);
    setCategoryPreview(null);
    setShowAddModal(true);
  };

  // Abrir modal para editar categoría
  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setCategoryId(cat.id);
    setCategoryCode(cat.code || cat.id); // Usar código real o id si no hay code
    setCategoryName(cat.name);
    setCategoryImage(null);
    setCategoryPreview(cat.image ? `http://localhost:5000/${cat.image}` : null);
    setShowEditModal(true);
  };

  // Agregar categoría
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!categoryId.trim() || !categoryName.trim()) return;

    try {
      await addCategory(categoryId, categoryName, categoryImage);
      setShowAddModal(false);
      setCategoryId("");
      setCategoryCode("");
      setCategoryName("");
      setCategoryImage(null);
      setCategoryPreview(null);
    } catch (error) {
      console.error("Error agregando categoría:", error);
    }
  };

  // Actualizar categoría
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!categoryCode.trim() || !categoryName.trim()) return;

    try {
      await updateCategory(editingCategory.id, categoryCode, categoryName, categoryImage);
      setShowEditModal(false);
      setEditingCategory(null);
      setCategoryImage(null);
      setCategoryPreview(null);
    } catch (error) {
      console.error("Error actualizando categoría:", error);
    }
  };

  // Eliminar categoría
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta categoría?")) {
      try {
        await deleteCategory(id);
        setShowEditModal(false);
        setEditingCategory(null);
      } catch (error) {
        console.error("Error eliminando categoría:", error);
      }
    }
  };

  if (loading) return <p className="loading">Cargando categorías...</p>;

  return (
    <div className="categories-container">
      <h2 className="categories-title">Gestión de Categorías</h2>

      {error && <p className="error">{error}</p>}

      {/* Barra búsqueda + agregar */}
      <div className="categories-header">
        <input
          type="text"
          placeholder="Buscar categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="categories-input"
        />
        <button className="btn" onClick={openAddModal}>
          Agregar Categoría
        </button>
      </div>

      {/* Grid categorías */}
      <div className="categories-grid">
        {filteredCategories.map((cat) => (
          <div key={cat.id} className="category-card">
            {cat.image && (
              <img
                src={`http://localhost:5000/${cat.image}`}
                alt={cat.name}
                className="category-image"
                crossOrigin="anonymous"
              />
            )}
            <h3 className="category-name">
              {cat.id} - {cat.name}
            </h3>
            <div className="actions">
              <button className="btn" onClick={() => openEditModal(cat)}>
                Editar
              </button>
              <button
                className="btn"
                onClick={() => navigate(`/admin/categories/${cat.id}/products`)}
              >
                Ver
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Agregar */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Agregar Nueva Categoría</h3>
            <form onSubmit={handleAdd} className="modal-form">
              <input
                type="text"
                placeholder="Código (ej: CAT)"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value.toUpperCase())}
                className="categories-input"
                maxLength={3}
              />
              <input
                type="text"
                placeholder="Nombre de la categoría"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="categories-input"
              />

              {/* Subida de imagen */}
              <div
                className={`image-upload-box ${dragActive ? "dragover" : ""}`}
                onClick={() => document.getElementById("fileInputAdd").click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="upload-icon">
                  <FiUploadCloud size={50} />
                </div>
                <p>Haz clic o arrastra imagen</p>
                <input
                  id="fileInputAdd"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  style={{ display: "none" }}
                />
              </div>

              {categoryPreview && (
                <img
                  src={categoryPreview}
                  alt="Preview"
                  className="category-image-preview"
                />
              )}

              <div className="modal-actions">
                <button type="submit" className="btn" disabled={actionLoading}>
                  Agregar
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {showEditModal && editingCategory && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Categoría</h3>
            <form onSubmit={handleUpdate} className="modal-form">
              <input
                type="text"
                value={categoryCode}
                disabled
                className="categories-input"
              />
              <input
                type="text"
                placeholder="Nombre de la categoría"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="categories-input"
              />

              {/* Subida de imagen */}
              <div
                className={`image-upload-box ${dragActive ? "dragover" : ""}`}
                onClick={() => document.getElementById("fileInputEdit").click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="upload-icon">
                  <FiUploadCloud size={50} />
                </div>
                <p>Haz clic o arrastra imagen</p>
                <input
                  id="fileInputEdit"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  style={{ display: "none" }}
                />
              </div>

              {categoryPreview && (
                <img
                  src={categoryPreview}
                  alt="Preview"
                  className="category-image-preview"
                  crossOrigin="anonymous"
                />
              )}

              <div className="modal-actions">
                <button
                  type="submit"
                  className="btn"
                  disabled={actionLoading}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(editingCategory.id)}
                  disabled={actionLoading}
                >
                  Eliminar
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesAdmin;

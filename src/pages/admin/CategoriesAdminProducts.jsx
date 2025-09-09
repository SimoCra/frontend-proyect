// src/pages/admin/CategoriesAdminProducts.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCategories } from "../../context/CategoriesContext";
import "../../styles/admin_css/CategoriesAdminProducts.css";

const CategoriesAdminProducts = () => {
  const { id } = useParams(); // ID de la categoría desde la URL
  const navigate = useNavigate();

  const {
    productsByCategory,
    loadingProducts,
    loadProductsByCategory,
    error,
    categories,
    deleteProduct,
  } = useCategories();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(null);

  // Cargar productos de la categoría cuando cambia el id
  useEffect(() => {
    loadProductsByCategory(id);
  }, [id]);

  // Buscar datos de la categoría cuando cambian las categorías globales
  useEffect(() => {
    const foundCategory = categories.find((c) => String(c.id) === String(id));
    setCategory(foundCategory);
  }, [categories, id]);

  const filteredProducts = productsByCategory.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Manejar eliminación de producto
  const handleDelete = async (productId) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      await deleteProduct(productId);
      alert("Producto eliminado exitosamente.");
    } catch (err) {
      alert("Error al eliminar producto: " + err.message);
    }
  };

  // Navegar a la página de edición del producto
  const handleEdit = (productId) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  if (loadingProducts) return <p>Cargando productos...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="category-products-wrapper">
      <header className="category-products-header">
        <h2>
          Productos en la categoría:{" "}
          <span className="highlight">{category?.name || "Desconocida"}</span>
        </h2>
        <Link to="/admin/categories" className="back-link">
          ← Volver a Categorías
        </Link>
      </header>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={`http://localhost:5000/${product.image_url}`}
                alt={product.name}
                className="product-image"
                crossOrigin="anonymous"
              />
              <h4>{product.name}</h4>
              <p className="price">${product.price}</p>
              <div className="actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(product.id)}
                >
                  Editar
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(product.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay productos en esta categoría.</p>
        )}
      </div>
    </div>
  );
};

export default CategoriesAdminProducts;

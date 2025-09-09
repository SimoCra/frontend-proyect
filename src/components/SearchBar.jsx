// SearchBar.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext"; // 👈 usamos el contexto
import "../styles/components/SearchBar.css";

const SearchBar = () => {
  const navigate = useNavigate();
  const { getProducts } = useContext(AuthContext); // 👈 del contexto

  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // 🔹 Cargar productos al montar el componente
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Traemos una buena cantidad para búsqueda
        const res = await getProducts(1, 200);
        setProducts(res.products || []);
      } catch (err) {
        console.error("Error al cargar productos:", err.message);
      }
    };
    fetchProducts();
  }, [getProducts]);

  // 🔹 Filtrar productos en memoria
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      return;
    }
    const results = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setShowResults(true);
  };

  const handleSelect = (name) => {
    setSearchTerm("");
    setShowResults(false);
    navigate(`/products/${encodeURIComponent(name)}`);
  };

  return (
    <div className="searchbar-container">
      <input
        type="text"
        placeholder="Buscar productos..."
        value={searchTerm}
        onChange={handleChange}
        className="searchbar-input"
        onFocus={() => setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
      />

      {showResults && (
        <div className="searchbar-results">
          {filteredProducts.length > 0 ? (
            filteredProducts.slice(0, 5).map((product) => {
              const firstVariant = product.variants?.[0];
              const imageUrl = firstVariant
                ? `http://localhost:5000/${firstVariant.image_url}`
                : "/img/no-image.png";

              return (
                <div
                  key={product.id}
                  className="searchbar-item"
                  onClick={() => handleSelect(product.name)}
                >
                  <img src={imageUrl} alt={product.name} crossOrigin="anonymmus"/>
                  <span>{product.name}</span>
                </div>
              );
            })
          ) : (
            <p className="searchbar-noresults">No se encontraron resultados</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

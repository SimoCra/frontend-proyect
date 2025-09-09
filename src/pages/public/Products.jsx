import React, { useEffect, useState, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import '../../styles/public_css/Products.css';
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Productos = () => {
  const { pageNumber } = useParams();
  const navigate = useNavigate();
  const page = parseInt(pageNumber, 10) || 1;

  const { getProducts } = useContext(AuthContext); // <-- Aquí usamos el método del contexto

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const limit = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await getProducts(page, limit);
        setProducts(res.products);
        setTotalPages(res.pagination.totalPages);
      } catch (err) {
        setError(err.message || 'Error al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage !== page && newPage >= 1 && newPage <= totalPages) {
      navigate(`/products/page/${newPage}`);
    }
  };

  return (
    <>
      <Header />

      <div className="productos-container">
        <h2>Catálogo de Productos</h2>

        {loading && <p>Cargando productos...</p>}
        {error && <p className="error">{error}</p>}

        <div className="productos-grid">
          {!loading && !error && products.length === 0 && (
            <p>No se encontraron productos.</p>
          )}
          {products.map((product) => (
            <div key={product.id} className="producto-card">
              <img
                src={`http://localhost:5000/${product.variants[0].image_url}`}
                alt={product.name}
                className="producto-img"
                crossOrigin="anonymous"
              />
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="precio">${product.price}</p>
              <Link
                to={`/products/${encodeURIComponent(product.name)}`}
                className="btn-ver-mas"
              >
                Ver más
              </Link>
            </div>
          ))}
        </div>

        <div className="paginacion">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span>
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Siguiente
          </button>
        </div>
      </div>
      <Footer />  
    </>
  );
};

export default Productos;

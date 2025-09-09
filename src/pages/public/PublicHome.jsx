import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Slider from "../../components/Slider";
import { useAuth } from "../../context/AuthContext";
import "../../styles/public_css/PublicHome.css";

const PublicHome = () => {
  const { getProducts } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home__dashboard">
      <Header />

      <Slider />

      {/* Productos destacados */}
      <section className="productos-container">
        <div>
          <h2>Productos destacados</h2>
        </div>

        <div className="productos-grid">
          {products && products.length > 0 ? (
              products.slice(0, 6).map((product) => {
                const firstVariant = product.variants?.[0];

                return (
                  <div key={product.id} className="producto-card">
                    <img
                      crossOrigin="anonymous"
                      src={
                        firstVariant?.image_url
                          ? `http://localhost:5000/${firstVariant.image_url}`
                          : "/placeholder.jpg"
                      }
                      alt={product.name}
                      className="producto-img"
                    />
                    <h3>{product.name}</h3>
                    <p className="precio">
                      ${firstVariant?.price || product.price}
                    </p>
                    <Link
                      to={`/products/${encodeURIComponent(product.name)}`} // <== aquí el cambio
                      className="btn-ver-mas"
                    >
                      Ver detalle
                    </Link>
                  </div>
                );
              })
            ) : (
              <p>No hay productos disponibles</p>
          )}
        </div>
      </section>

      {/* Banner intermedio */}
      <section className="home__mid-banner">
        <p className="home__mid-banner-text">¿Estás pensando en regalar algo?</p>
        <Link to="/products" className="home__mid-banner-link">
          Busca algo aquí
        </Link>
      </section>

      {/* Perfectos para regalar */}
      <section className="home__section">
        <div className="home__section-header">
          <h2 className="home__section-title">Perfectos para regalar</h2>
          <Link to="/products" className="home__section-link">
            Ver más
          </Link>
        </div>
      </section>

      {/* Categorías (SECCIÓN ACTUALIZADA) */}
      <section className="home__categories">
        {/* Tarjeta 1: Collares */}
        <div className="home__category-card">
          <div className="home__category-text">
            <h3 className="home__category-title">Collares</h3>
            <p className="home__category-highlight">NACAR</p>
            <span className="home__category-subtext">Regalos para el alma</span>
          </div>
          <div className="home__category-images">
            <img 
              src="/img/collares1.png" 
              alt="Collar de Nacar" 
              className="home__category-img-main" 
            />
            <img 
              src="/img/collares2.png" 
              alt="Detalle de pulsera" 
              className="home__category-img-secondary" 
            />
          </div>
        </div>

        {/* Tarjeta 2: Rosarios */}
        <div className="home__category-card">
          <div className="home__category-text">
            <h3 className="home__category-title">Rosarios</h3>
            <p className="home__category-highlight">Regalos</p>
            <span className="home__category-subtext">Regalos con sentido</span>
          </div>
          <div className="home__category-images">
            <img 
              src="/img/rosario1.png" 
              alt="Rosario dorado" 
              className="home__category-img-main" 
            />
            <img 
              src="/img/rosario2.png" 
              alt="Rosario en exhibidor" 
              className="home__category-img-secondary" 
            />
          </div>
        </div>
      </section>

      {/* Envío gratis */}
      <section className="home__shipping">
        <h3 className="home__shipping-title">¡ENVIOS GRATIS A COLOMBIA!</h3>
        <p className="home__shipping-subtitle">
          A partir de $40.000 tu envío es gratis
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default PublicHome;
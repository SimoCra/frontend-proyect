import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import AuthContext from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import CartToast from "../../components/CartToast";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "../../styles/public_css/ProductDetail.css";

const ProductDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();

  const {
    getProductByName,
    user,
    createReview,
    getReviewsByProduct,
    getProductAverageRating,
    deleteReview,
  } = useContext(AuthContext);

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
  const fetchProductAndReviews = async () => {
    setLoadingReviews(true);
    setError("");
    try {
      const result = await getProductByName(name);
      setProduct(result);
      setSelectedVariantIndex(0);
      setQuantity(1);

      const revs = await getReviewsByProduct(result.id, 1, 10);
      setReviews(revs.reviews || []);

      const stats = await getProductAverageRating(result.id);
      setAverageRating(stats.averageRating ?? null);
    } catch (err) {
      setError(err.message || "Error al cargar producto o reseñas");
    } finally {
      setLoadingReviews(false);
    }
  };

  if (name) fetchProductAndReviews();
}, [name]); // 👈 solo depende del name


  if (!product) return <p className="loading-message">Cargando producto...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  const selectedVariant = product.variants?.[selectedVariantIndex] || null;

  // Corregido: stockDisponible se obtiene directamente de product, no de variant
  const stockDisponible =
    product &&
    (product.stock === true || Number(product.stock) === 1)

  const handleBuy = async () => {
    if (!user) return navigate("/login");

    if (!selectedVariant) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona una variante",
        text: "Por favor selecciona una variante antes de agregar al carrito",
      });
      return;
    }

    if (!stockDisponible) {
      Swal.fire({
        icon: "warning",
        title: "Producto fuera de stock",
        text: "No hay stock disponible para la variante seleccionada.",
      });
      return;
    }

    if (quantity > selectedVariant?.stock) {
  Swal.fire({
    icon: "warning",
    title: "Stock insuficiente",
    text: `Solo hay ${selectedVariant?.stock} unidad(es) disponibles.`,
  });
  return;
}

    try {
      await addToCart(user.cart_id, product.id, selectedVariant.id, quantity);
      setShowToast(true);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo agregar el producto al carrito",
      });
    }
  };

  const handleCreateReview = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Inicia sesión",
        text: "Debes iniciar sesión para crear una reseña",
      });
      return;
    }

    if (!newComment.trim() || newRating < 1 || newRating > 5) {
      Swal.fire({
        icon: "warning",
        title: "Datos inválidos",
        text: "Debes ingresar un comentario y un rating entre 1 y 5",
      });
      return;
    }

    try {
      await createReview({
        productId: product.id,
        rating: newRating,
        comment: newComment.trim(),
      });

      Swal.fire({
        icon: "success",
        title: "Reseña agregada",
        showConfirmButton: false,
        timer: 1500,
      });

      const revs = await getReviewsByProduct(product.id, 1, 10);
      setReviews(revs.reviews || []);

      const stats = await getProductAverageRating(product.id);
      setAverageRating(stats.averageRating ?? null);

      setNewComment("");
      setNewRating(5);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo crear la reseña",
      });
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      const revs = await getReviewsByProduct(product.id, 1, 10);
      setReviews(revs.reviews || []);

      const stats = await getProductAverageRating(product.id);
      setAverageRating(stats.averageRating ?? null);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo eliminar la reseña",
      });
    }
  };

  return (
    <>
    <Header />
      <div className="product-detail">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Volver
        </button>

        <div className="product-images-container">
          <div className="product-thumbnails-column">
            {product.variants?.map((variant, index) => (
              <img
                key={variant.id}
                src={`http://localhost:5000/${variant.image_url}`}
                alt={`Variante ${variant.color} - ${variant.style}`}
                className={`product-thumbnail ${
                  selectedVariantIndex === index ? "active" : ""
                }`}
                onClick={() => setSelectedVariantIndex(index)}
                crossOrigin="anonymous"
              />
            ))}
          </div>

          <img
            src={`http://localhost:5000/${selectedVariant?.image_url}`}
            alt={product.name}
            className="product-main-image"
            crossOrigin="anonymous"
          />
        </div>

        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-description">{product.description}</p>

          <div className="variant-buttons-container">
            {product.variants?.map((variant, index) => (
              <button
                key={variant.id}
                className={`variant-button ${
                  selectedVariantIndex === index ? "selected" : ""
                }`}
                onClick={() => setSelectedVariantIndex(index)}
              >
                {variant.color} {variant.style}
              </button>
            ))}
          </div>

          <div className="variant-info">
            <p>
              <strong>Color:</strong> {selectedVariant?.color || "-"}
            </p>
            <p>
              <strong>Estilo:</strong> {selectedVariant?.style || "-"}
            </p>
            <p className="product-price">
              <strong>Precio:</strong> $
              {selectedVariant ? selectedVariant.price : "-"}
            </p>
          </div>

          <p className="product-stock">
            Estado:{" "}
            {stockDisponible ? (
              <span className="stock-available">Disponible</span>
            ) : (
              <span className="stock-unavailable">No disponible</span>
            )}
          </p>

          {stockDisponible && (
             <div className="quantity-container">
               <label htmlFor="quantity">Cantidad:</label>
               <input
                 type="number"
                 id="quantity"
                 min="1"
                 max={12}
                 value={quantity}
                 onChange={(e) => {
                   const value = parseInt(e.target.value, 12);
                   if (!isNaN(value) && value > 0 && value <= 12) {
                     setQuantity(value);
                   }
                 }}
               />
             </div>
            )}


          <button
            onClick={handleBuy}
            className="buy-button"
            disabled={!stockDisponible}
          >
            {stockDisponible ? "Agregar al carrito" : "Producto no disponible"}
          </button>

          <div className="reviews-section">
            <h2>
              Reseñas{" "}
              {averageRating !== null && `(Promedio: ${averageRating.toFixed(1)})`}
            </h2>

            {loadingReviews ? (
              <p>Cargando reseñas...</p>
            ) : reviews.length === 0 ? (
              <p>No hay reseñas aún.</p>
            ) : (
              <ul className="reviews-list">
                {reviews.map((r) => (
                  <li key={r.id} className="review-item">
                    <strong>{r.user_name || r.user_email}</strong> - {r.rating} ⭐
                    <p>{r.comment}</p>
                    {(user?.id === r.user_id || user?.role === "admin") && (
                      <button
                        className="delete-review-button"
                        onClick={() => handleDeleteReview(r.id)}
                      >
                        Eliminar
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {user && (
              <div className="create-review">
                <h3>Escribe tu reseña</h3>
                <label htmlFor="rating">Rating:</label>
                <select
                  id="rating"
                  value={newRating}
                  onChange={(e) => setNewRating(parseInt(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>

                <label htmlFor="comment">Comentario:</label>
                <textarea
                  id="comment"
                  placeholder="Escribe tu comentario..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />

                <button onClick={handleCreateReview}>Enviar reseña</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showToast && (
        <CartToast
          product={product}
          quantity={quantity}
          onClose={() => setShowToast(false)}
        />
      )}
      <Footer />
    </>
  );
};

export default ProductDetail;

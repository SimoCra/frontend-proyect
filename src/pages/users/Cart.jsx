import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import HeaderMinimal from "../../components/HeaderMinimal";
import Footer2 from "../../components/Footer2";
import "../../styles/users_css/Cart.css";

const Cart = () => {
  const { user } = useContext(AuthContext);
  const {
    cartItems = [],
    getSummaryCart,
    updateCartItem,
    deleteProductCart,
  } = useCart();

  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Cargar carrito desde backend y total
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      setError("");
      try {
        const summary = await getSummaryCart();
        setTotal(Number(summary.total || 0));
      } catch (err) {
        setError(err.message || "Error al cargar el carrito");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchCart();
  }, [user]);

  // Cambiar cantidad producto
  const handleQuantityChange = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) return;
    setLoading(true);
    setError("");
    try {
      await updateCartItem(cartItemId, newQuantity);
      const summary = await getSummaryCart();
      setTotal(Number(summary.total || 0));
    } catch (err) {
      setError(err.message || "No se pudo actualizar el producto");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto (ahora recibe productId y variantId)
  const handleRemove = async (productId, variantId) => {
    console.log("Eliminar producto:", { productId, variantId });
    setLoading(true);
    setError("");
    try {
      await deleteProductCart(productId, variantId);
      const summary = await getSummaryCart();
      setTotal(Number(summary.total || 0));
    } catch (err) {
      setError(err.message || "No se pudo eliminar el producto");
    } finally {
      setLoading(false);
    }
  };

  // Navegar a selección de direcciones
  const goToAddressSelection = () => {
    navigate("/checkout/addressed");
  };

  if (!user) {
    return (
      <p className="cart-message">Debes iniciar sesión para ver tu carrito.</p>
    );
  }

  return (
    <>
    <HeaderMinimal />
    <div>
      <div className="cart-container">
        <h2>Mi Carrito</h2>

        {loading && <p className="cart-loading">Cargando...</p>}
        {error && <p className="cart-error">{error}</p>}

        {cartItems.length === 0 ? (
          <div className="cart-empty-banner">
            <img
              src="../../../img/empty-cart.png"
              alt="Carrito vacío"
              className="empty-cart-img"
            />
            <div className="empty-cart-text">
              <h3>Agrega productos y consigue envío gratis</h3>
              <p>
                Para obtener envío gratis suma productos de un mismo vendedor.
              </p>
              <button
                className="discover-products-btn"
                onClick={() => navigate("/")}
                aria-label="Descubrir productos"
              >
                Descubrir productos
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Lista de productos */}
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.cart_item_id} className="cart-item" role="listitem">
                  <img
                    src={`http://localhost:5000/${
                      item.image || "placeholder.jpg"
                    }`}
                    alt={item.name}
                    className="cart-item-image"
                    crossOrigin="anonymous"
                  />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    <p><strong>Color:</strong> {item.color}</p>
                    <p><strong>Estilo:</strong> {item.style}</p>
                    <p>Precio unitario: ${item.price.toFixed(2)}</p>
                    <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>

                    <div className="cart-quantity-controls" aria-label="Control de cantidad">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.cart_item_id,
                            item.quantity - 1
                          )
                        }
                        aria-label={`Disminuir cantidad de ${item.name}`}
                        disabled={loading || item.quantity <= 1}
                      >
                        -
                      </button>
                      <span aria-live="polite" aria-atomic="true">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.cart_item_id,
                            item.quantity + 1
                          )
                        }
                        aria-label={`Aumentar cantidad de ${item.name}`}
                        disabled={loading}
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="cart-remove-btn"
                      onClick={() => handleRemove(item.productId, item.variantId)} 
                      disabled={loading}
                      aria-label={`Eliminar ${item.name} del carrito`}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="cart-summary">
              <h3>Total: ${Number(total || 0).toFixed(2)}</h3>
              <button
                className="cart-checkout-btn"
                disabled={cartItems.length === 0 || loading}
                onClick={goToAddressSelection}
                aria-label="Proceder al pago"
              >
                Proceder al pago
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    <Footer2 />
    </>
  );
};

export default Cart;

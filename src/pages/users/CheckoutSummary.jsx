// src/components/checkout/CheckoutSummary.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import AuthContext from "../../context/AuthContext";
import Swal from "sweetalert2";
import "../../styles/users_css/CheckoutSummary.css";

const CheckoutSummary = () => {
  const { user, selectedAddress, checkout } = useContext(AuthContext);
  const { cartItems, getSummaryCart, clearCart } = useCart();
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const summary = await getSummaryCart();
        setTotal(Number(summary.total || 0));
      } catch (err) {
        console.error("Error al cargar resumen del carrito", err);
      }
    };
    if (user) fetchCart();
  }, [user, getSummaryCart]);

  if (!user) return <p>Debes iniciar sesión para ver tu compra.</p>;

  const handleConfirmOrder = async () => {
    if (!selectedAddress) {
      Swal.fire({
        icon: "warning",
        title: "Dirección requerida",
        text: "Debes seleccionar una dirección antes de confirmar la compra.",
        confirmButtonText: "Entendido",
      }).then(() => navigate("/checkout/address"));
      return;
    }

    try {
      setLoading(true);

      Swal.fire({
        title: "Procesando tu compra...",
        html: `
          <div style="display:flex;flex-direction:column;align-items:center;">
            <div class="spinner" style="
              border: 8px solid #f3f3f3; 
              border-top: 8px solid #007BFF; 
              border-radius: 50%; 
              width: 100px; 
              height: 100px; 
              animation: spin 1s linear infinite;
            "></div>
            <p style="margin-top:1rem;">Por favor espera...</p>
          </div>`,
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          const style = document.createElement("style");
          style.innerHTML = `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `;
          document.head.appendChild(style);
        },
      });

      const result = await checkout();
      clearCart();

      Swal.fire({
        icon: "success",
        title: "Pago realizado exitosamente 🎉",
        text: result.message || "Tu compra se realizó con éxito.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.error("Error confirmando orden:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Error al confirmar la orden",
        confirmButtonText: "Cerrar",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-summary-container">
      <h2>Revisa cuándo llega tu compra</h2>

      {selectedAddress ? (
        <p className="shipping-address" aria-live="polite">
          <span role="img" aria-label="location">📍</span> Envío a{" "}
          {selectedAddress.direccion}, {selectedAddress.ciudad},{" "}
          {selectedAddress.departamento}
        </p>
      ) : (
        <>
          <p style={{ color: "red" }} role="alert">
            ⚠️ No has seleccionado una dirección de envío
          </p>
          <button
            onClick={() => navigate("/checkout/address")}
            className="select-address-btn"
            aria-label="Seleccionar dirección de envío"
          >
            Seleccionar dirección de envío
          </button>
        </>
      )}

      <div className="checkout-products" role="list" aria-label="Productos en el carrito">
        {cartItems.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.cart_item_id} className="checkout-product" role="listitem">
              <img
                src={`http://localhost:5000/${item.image || "placeholder.jpg"}`}
                alt={item.name}
                crossOrigin="anonymous"
              />
              <div className="product-info">
                <h4>{item.name}</h4>
                {item.color && <p>Color: {item.color}</p>}
                {item.style && <p>Estilo: {item.style}</p>}
                <p>Cantidad: {item.quantity}</p>
                <p>
                  Subtotal: $
                  {(item.price * item.quantity).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="checkout-summary" aria-label="Resumen de compra">
        <h3>Resumen de compra</h3>
        <div className="summary-item">
          <span>Productos</span>
          <span>
            $
            {total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div className="summary-item">
          <span>Envío</span>
          <span style={{ color: "green" }}>Gratis</span>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <span>
            $
            {total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        <button
          className="checkout-btn"
          disabled={cartItems.length === 0 || !selectedAddress || loading}
          onClick={handleConfirmOrder}
          aria-busy={loading}
          aria-disabled={cartItems.length === 0 || !selectedAddress || loading}
        >
          {loading ? "Procesando..." : "Finalizar compra"}
        </button>
      </div>
    </div>
  );
};

export default CheckoutSummary;

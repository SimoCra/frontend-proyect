import React, { useEffect } from 'react';
import '../styles/components/CartToast.css';

const CartToast = ({ product, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); 
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="cart-toast">
      <img src={product.image} alt={product.name} />
      <div className="cart-toast-info">
        <p><strong>{product.name}</strong></p>
        <p>Agregado al carrito </p>
        <button onClick={() => window.location.href = '/cart-buy'}>
          Ver carrito
        </button>
      </div>
    </div>
  );
};

export default CartToast;

// src/components/HeaderMinimal.jsx
import React from 'react';
import { MdOutlineSecurity } from "react-icons/md";
import '../styles/components/HeaderMinimal.css';

const HeaderMinimal = () => {
  return (
    <header className="header-minimal">
      {/* Logo a la izquierda */}
      <div className="header-minimal__logo">
        <img src="/img/Logo.png" alt="Santoral Sagrado" />
      </div>

      {/* Texto en el centro */}
      <div className="header-minimal__text">
        TU COMPRA ES <strong>100% SEGURA</strong>
      </div>

      {/* Ícono de seguridad a la derecha */}
      <div className="header-minimal__icon">
        <MdOutlineSecurity size={28} color="#333" />
      </div>
    </header>
  );
};

export default HeaderMinimal;

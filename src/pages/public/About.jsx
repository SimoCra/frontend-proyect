import React from 'react';
import { Link } from 'react-router-dom';
import "../../styles/public_css/About.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FaHandHoldingHeart, FaPenNib, FaPrayingHands } from 'react-icons/fa'; // Iconos para los pilares

const About = () => {
  return (
    <>
    <Header />
    <div className="about-page">
      {/* SECCIÓN 1: Título Principal (Hero) */}
      <header className="about-hero">
        <div className="hero-content">
          <h1>Nuestra Historia</h1>
          <p>Hecho a Mano, con Fe y Segundas Oportunidades</p>
        </div>
      </header>

      <main>
        {/* SECCIÓN 2: Introducción a la Misión */}
        <section className="about-intro">
          <h2>Un Propósito Divino en Cada Creación</h2>
          <p>
            "Santoral Sagrado" es más que una marca; es un santuario de esperanza y un taller de sueños. Nacimos con la misión de elaborar piezas religiosas únicas, imbuidas de amor y devoción, mientras ofrecemos un camino de redención y trabajo digno a mujeres valientes que buscan reescribir su historia.
          </p>
        </section>

        {/* SECCIÓN 3: La Historia Detallada (Imagen + Texto) */}
        <section className="about-story">
          <div className="story-image">
            <img src="/img/bannerNosotros.png" alt="Mujeres artesanas trabajando en el taller" />
          </div>
          <div className="story-text">
            <h3>El Origen de Nuestra Misión</h3>
            <p>
              Fundada por Lucía, una artesana apasionada por la fe, nuestra empresa se especializa en productos religiosos finamente trabajados a mano. Cada pieza es el resultado de horas de dedicación.
            </p>
            <p>
              Nuestro corazón reside en nuestro equipo: un grupo especial de mujeres que han enfrentado tiempos difíciles, incluyendo experiencias de encarcelamiento. Aquí, encuentran una nueva oportunidad para empoderarse, sanar y transformar su vida a través del arte y la dignidad del trabajo.
            </p>
            <div className="story-quote">
              "El plan de Dios siempre es más grande que tus errores."
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: Nuestros Pilares (Valores) */}
        <section className="about-pillars">
          <h2>Nuestros Pilares</h2>
          <div className="pillars-container">
            <div className="pillar-card">
              <FaHandHoldingHeart size={40} className="pillar-icon" />
              <h4>Empoderamiento</h4>
              <p>Creemos en el poder de las segundas oportunidades para transformar vidas y comunidades.</p>
            </div>
            <div className="pillar-card">
              <FaPenNib size={40} className="pillar-icon" />
              <h4>Artesanía con Alma</h4>
              <p>Cada producto es único, hecho a mano con una dedicación que va más allá de la técnica.</p>
            </div>
            <div className="pillar-card">
              <FaPrayingHands size={40} className="pillar-icon" />
              <h4>Fe y Devoción</h4>
              <p>Nuestra fe es la inspiración detrás de cada diseño y el motor de nuestra misión social.</p>
            </div>
          </div>
        </section>

        {/* SECCIÓN 5: Llamada a la Acción */}
        <section className="about-cta">
          <h2>Sé Parte de Nuestra Historia</h2>
          <p>Cada compra apoya directamente a nuestras artesanas y su camino hacia un futuro brillante.</p>
          <Link to="/products" className="cta-button">Explora Nuestros Productos</Link>
        </section>
      </main>
    </div>
    <Footer /> 
    </>
  );
};

export default About;
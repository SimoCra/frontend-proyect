import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/Slider.css';

// --- Datos de las diapositivas ---
const slidesData = [
  {
    title: 'LO MEJOR EN CAMANDULAS',
    imageUrl: '/img/slider1.jpg',
  },
  {
    title: 'LO MEJOR EN PULSERAS',
    imageUrl: '/img/slider2.jpg',
  },
  {
    title: 'LO MEJOR EN DENARIOS',
    imageUrl: '/img/slider3.jpg',
  },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Función para ir a la diapositiva anterior
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slidesData.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  // Función para ir a la siguiente diapositiva (usada también por el temporizador)
  const goToNext = () => {
    // Usamos la forma funcional de setState para asegurar que siempre tengamos el valor más reciente
    setCurrentIndex((prevIndex) =>
      prevIndex === slidesData.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const slideInterval = setInterval(goToNext, 7000);

    return () => {
      clearInterval(slideInterval);
    };
  }, [currentIndex]);

  return (
    <div className="slider-container">
      {/* --- Flecha Izquierda --- */}
      <div className="arrow left-arrow" onClick={goToPrevious}>
        &#9664;
      </div>
      
      {/* --- Contenedor que se mueve --- */}
      <div className="slides-wrapper" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slidesData.map((slide, index) => (
          <div className="slide" key={index}>
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <Link to="/products" className="slider-button">
                Más información
              </Link>
            </div>
            <div className="slide-image-container">
              <img src={slide.imageUrl} alt={slide.title} />
            </div>
          </div>
        ))}
      </div>
      
      {/* --- Flecha Derecha --- */}
      <div className="arrow right-arrow" onClick={goToNext}>
        &#9654;
      </div>
    </div>
  );
};

export default Slider;
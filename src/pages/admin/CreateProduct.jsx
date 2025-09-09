import React, { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { FiUploadCloud, FiTrash2, FiPlusCircle } from "react-icons/fi";
import AuthContext from '../../context/AuthContext';
import '../../styles/admin_css/CreateProduct.css';

const CreateProduct = () => {
  const { createProduct } = useContext(AuthContext);

  const [form, setForm] = useState({
    id: '',
    name: '',
    description: '',
    price: '',
    stock: true,
    category: ''
  });

  const [variants, setVariants] = useState([
    { color: '', style: '', price: '', imageFile: null, preview: null }
  ]);

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleVariantImageChange = (index, file) => {
    const newVariants = [...variants];
    newVariants[index].imageFile = file;
    newVariants[index].preview = URL.createObjectURL(file);
    setVariants(newVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { color: '', style: '', price: '', imageFile: null, preview: null }]);
  };

  const removeVariant = (index) => {
    if (variants.length === 1) return; // mínimo una variante
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, name, description, price, stock, category } = form;

    if (!id || !name || !description || !price || !category) {
      setError("Completa todos los campos básicos");
      return;
    }

    for (const [i, variant] of variants.entries()) {
      if (!variant.color || !variant.style || variant.price === '' || !variant.imageFile) {
        setError(`Completa todos los campos y la imagen en la variante ${i + 1}`);
        return;
      }
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock ? 1 : 0);
    formData.append("category", category);

    // Variantes sin stock
    const variantsToSend = variants.map(v => ({
      color: v.color,
      style: v.style,
      price: parseInt(v.price),
    }));
    formData.append("variants", JSON.stringify(variantsToSend));

    variants.forEach(v => {
      formData.append("image", v.imageFile);
    });

    try {
      await createProduct(formData);
      Swal.fire({
        icon: "success",
        title: "Producto creado exitosamente",
        showConfirmButton: false,
        timer: 1500
      });
      setForm({ id: '', name: '', description: '', price: '', stock: true, category: '' });
      setVariants([{ color: '', style: '', price: '', imageFile: null, preview: null }]);
      setError('');
    } catch (err) {
      setError(err.message || "Error al crear producto");
    }
  };

  return (
    <div className="create-product-wrapper">
      <form onSubmit={handleSubmit} className="create-product-container">

        {/* Columna izquierda - variantes con imágenes */}
        <div className="variants-section">
          <h3>Variantes</h3>
          {variants.map((variant, index) => (
            <div key={index} className="variant-row">
              <input
                type="text"
                placeholder="Color"
                value={variant.color}
                onChange={e => handleVariantChange(index, 'color', e.target.value)}
              />
              <input
                type="text"
                placeholder="Estilo"
                value={variant.style}
                onChange={e => handleVariantChange(index, 'style', e.target.value)}
              />
              <input
                type="number"
                min="0"
                placeholder="Precio"
                value={variant.price}
                onChange={e => handleVariantChange(index, 'price', e.target.value)}
              />

              {/* Eliminado el checkbox de stock de variantes */}

              <div
                className="variant-image-upload"
                onClick={() => document.getElementById(`variant-file-${index}`).click()}
                title="Subir imagen variante"
              >
                {variant.preview
                  ? <img src={variant.preview} alt={`Preview variante ${index + 1}`} />
                  : <div className="upload-placeholder"><FiUploadCloud size={30} /></div>
                }
                <input
                  id={`variant-file-${index}`}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => handleVariantImageChange(index, e.target.files[0])}
                />
              </div>
              <button type="button" className="remove-variant-btn" onClick={() => removeVariant(index)} title="Eliminar variante">
                <FiTrash2 size={20} />
              </button>
            </div>
          ))}

          <button type="button" className="add-variant-btn" onClick={addVariant}>
            <FiPlusCircle size={20} /> Agregar variante
          </button>
        </div>

        {/* Columna derecha - Form básico */}
        <div className="form-section">
          <h2>Detalles del producto</h2>
          <input type="text" name="id" placeholder="ID (ej: 001)" value={form.id} onChange={handleChange} />
          <input type="text" name="name" placeholder="Nombre del producto" value={form.name} onChange={handleChange} />
          <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} />
          <input type="number" min="0" name="price" placeholder="Precio base" value={form.price} onChange={handleChange} />
          <input type="text" name="category" placeholder="ID Categoría (ej: 001)" value={form.category} onChange={handleChange} />

          <div className="stock-toggle">
            <label>Disponibilidad:</label>
            <button
              type="button"
              className={`stock-button ${form.stock ? 'available' : 'not-available'}`}
              onClick={() => setForm(prev => ({ ...prev, stock: !prev.stock }))}
            >
              {form.stock ? 'Disponible' : 'No disponible'}
            </button>
          </div>

          <button type="submit" className="submit-button">Crear producto</button>
          {error && <p className="error-message">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;

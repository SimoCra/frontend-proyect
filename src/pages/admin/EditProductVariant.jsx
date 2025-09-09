import React, { useEffect, useState } from "react"; 
import { useParams } from "react-router-dom";
import { useCategories } from "../../context/CategoriesContext";
import '../../styles/admin_css/EditProductVariant.css';
import { FiUploadCloud, FiTrash2, FiPlusCircle, FiSave } from "react-icons/fi";

const EditProductVariantsPage = () => {
  const { productId } = useParams(); // ✅ ID del producto desde params
  const {
    currentProduct,
    loadProductById,
    loadingCurrentProduct,
    currentProductError,
    createProductVariants,
    deleteProductVariant,
    updateProductVariant,
    setCurrentProduct,
  } = useCategories();

  const [newVariants, setNewVariants] = useState([{ color: "", style: "", price: "", imageFile: null, preview: null }]);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (productId) loadProductById(productId);
  }, [productId]);

  // ===== Manejo de variantes existentes =====
  const handleChangeExistingVariant = (index, field, value) => {
    const updated = [...currentProduct.variants];
    updated[index][field] = field === "price" ? parseFloat(value) : value;
    setCurrentProduct({ ...currentProduct, variants: updated });
  };

  const handleImageChangeExistingVariant = (index, file) => {
    const updated = [...currentProduct.variants];
    updated[index].imageFile = file;
    updated[index].preview = URL.createObjectURL(file);
    setCurrentProduct({ ...currentProduct, variants: updated });
  };

  const handleSaveExistingVariant = async (variant) => {
    try {
      await updateProductVariant(productId,{ // ✅ solo pasamos body, productId se usa en controller
        variantId: variant.id,
        color: variant.color,
        style: variant.style,
        price: variant.price,
        imageFile: variant.imageFile,
      });
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta variante?")) return;
    try {
      await deleteProductVariant(variantId); // opcional, solo si tu service lo necesita
    } catch (err) {
      setError(err.message);
    }
  };

  // ===== Manejo de nuevas variantes =====
  const handleChangeNewVariant = (index, field, value) => {
    const updated = [...newVariants];
    updated[index][field] = value;
    setNewVariants(updated);
  };

  const handleImageChangeNewVariant = (index, file) => {
    const updated = [...newVariants];
    updated[index].imageFile = file;
    updated[index].preview = URL.createObjectURL(file);
    setNewVariants(updated);
  };

  const handleAddNewVariant = () => {
    setNewVariants([...newVariants, { color: "", style: "", price: "", imageFile: null, preview: null }]);
  };

  const handleRemoveNewVariant = (index) => {
    if (newVariants.length === 1) return;
    setNewVariants(newVariants.filter((_, i) => i !== index));
  };

  const handleCreateVariants = async () => {
    try {
      if (!currentProduct) return;

      for (const [i, variant] of newVariants.entries()) {
        if (!variant.color || !variant.style || variant.price === '' || !variant.imageFile) {
          setError(`Completa todos los campos y la imagen en la variante ${i + 1}`);
          return;
        }
      }

      await createProductVariants(currentProduct.id, newVariants);
      setNewVariants([{ color: "", style: "", price: "", imageFile: null, preview: null }]);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loadingCurrentProduct) return <p className="epv-loading">Cargando producto...</p>;
  if (currentProductError) return <p className="epv-error">Error: {currentProductError}</p>;
  if (!currentProduct) return <p className="epv-error">Producto no encontrado</p>;

  const variants = Array.isArray(currentProduct.variants) ? currentProduct.variants : [];



  return (
    <div className="epv-wrapper">
      <h2 className="epv-title">Variantes del producto: {currentProduct.name}</h2>

      <div className="epv-variants-list">
        {/* Variantes existentes */}
        {variants.map((variant, index) => (
          <div key={variant.id} className="epv-card">
            <div className="epv-card-inputs">
              <input type="text" className="epv-input" placeholder="Color" value={variant.color} onChange={(e) => handleChangeExistingVariant(index, 'color', e.target.value)} />
              <input type="text" className="epv-input" placeholder="Estilo" value={variant.style} onChange={(e) => handleChangeExistingVariant(index, 'style', e.target.value)} />
              <input type="number" className="epv-input" placeholder="Precio" value={variant.price} onChange={(e) => handleChangeExistingVariant(index, 'price', e.target.value)} />
              <div className="epv-variant-image-upload" onClick={() => document.getElementById(`epv-existing-variant-${index}`).click()}>
                <img src={variant.preview || `http://localhost:5000/${variant.image_url}`} alt={`Variante ${index}`} className="epv-variant-image" crossOrigin="anonymous"/>
                <input type="file" id={`epv-existing-variant-${index}`} accept="image/*" style={{ display: "none" }} onChange={(e) => handleImageChangeExistingVariant(index, e.target.files[0])} />
              </div>
              <button className="epv-save-btn" onClick={() => handleSaveExistingVariant(variant)}><FiSave /></button>
              <button className="epv-delete-btn" onClick={() => handleDeleteVariant(variant.id)}><FiTrash2 /></button>
            </div>
          </div>
        ))}

        {/* Variantes nuevas */}
        {newVariants.map((variant, index) => (
          <div key={index} className="epv-card">
            <div className="epv-card-inputs">
              <input type="text" className="epv-input" placeholder="Color" value={variant.color} onChange={(e) => handleChangeNewVariant(index, 'color', e.target.value)} />
              <input type="text" className="epv-input" placeholder="Estilo" value={variant.style} onChange={(e) => handleChangeNewVariant(index, 'style', e.target.value)} />
              <input type="number" className="epv-input" placeholder="Precio" value={variant.price} onChange={(e) => handleChangeNewVariant(index, 'price', e.target.value)} />
              <div className="epv-variant-image-upload" onClick={() => document.getElementById(`epv-new-variant-${index}`).click()}>
                {variant.preview ? <img src={variant.preview} alt={`Preview ${index}`} className="epv-variant-image" /> : <div className="epv-upload-placeholder"><FiUploadCloud /></div>}
                <input type="file" id={`epv-new-variant-${index}`} accept="image/*" style={{ display: "none" }} onChange={(e) => handleImageChangeNewVariant(index, e.target.files[0])} />
              </div>
              <button className="epv-delete-btn" onClick={() => handleRemoveNewVariant(index)}><FiTrash2 /></button>
            </div>
          </div>
        ))}

        <button type="button" className="epv-add-variant-btn" onClick={handleAddNewVariant}><FiPlusCircle /> Agregar variante</button>
        <button type="button" className="epv-create-variants-btn" onClick={handleCreateVariants}>Guardar nuevas variantes</button>

        {error && <p className="epv-error-message">{error}</p>}
      </div>
    </div>
  );
};

export default EditProductVariantsPage;

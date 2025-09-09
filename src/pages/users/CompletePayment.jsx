import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import '../../styles/users_css/CompletePayment.css';

const AddressForm = ({ userId }) => {
  const { registerAddress, getUserAddresses, selectAddress } = useContext(AuthContext);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null); // no seleccionamos nada de entrada
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    user_id: userId,
    direccion: '',
    departamento: '',
    ciudad: '',
    barrio: '',
    apartamento: '',
    indicaciones: '',
    tipo_domicilio: 'residencia',
    nombre_contacto: '',
    celular_contacto: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [errores, setErrores] = useState(null);

  // 🔹 Cargar direcciones
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await getUserAddresses(userId);
        const lista = Array.isArray(data) ? data : [];
        setAddresses(lista);

        if (lista.length === 0) {
          setShowForm(true);
        }
      } catch (error) {
        console.error(error);
        setShowForm(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [userId, getUserAddresses]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMensaje('');
    setErrores(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerAddress(formData);
      setMensaje('Dirección guardada correctamente');

      const updated = await getUserAddresses(userId);
      const lista = Array.isArray(updated) ? updated : [];
      setAddresses(lista);

      const nueva = lista[lista.length - 1];
      setSelectedAddressId(nueva.id);
      selectAddress(nueva);

      setFormData({
        user_id: userId,
        direccion: '',
        departamento: '',
        ciudad: '',
        barrio: '',
        apartamento: '',
        indicaciones: '',
        tipo_domicilio: 'residencia',
        nombre_contacto: '',
        celular_contacto: ''
      });

      setShowForm(false);
    } catch (error) {
      setErrores([{ mensaje: error.message || 'Error al guardar la dirección' }]);
    }
  };

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    const address = addresses.find(a => a.id === id);
    if (address) selectAddress(address);
  };

  const handleContinue = () => {
    if (!selectedAddressId) return;
    navigate('/checkout/summary');
  };

  if (loading) return <p>Cargando direcciones...</p>;

  return (
    <div className="address-wrapper">
      {/* 🔹 Lista de direcciones */}
      {addresses.length > 0 && !showForm && (
        <div className="direcciones-container">
          <h2>Selecciona una dirección</h2>
          <form>
            {addresses.map((addr) => (
              <label key={addr.id} className="direccion-item">
                <input
                  type="radio"
                  name="selectedAddress"
                  value={addr.id}
                  checked={selectedAddressId === addr.id}
                  onChange={(e) => handleSelectAddress(parseInt(e.target.value, 10))}
                />
                {addr.direccion}, {addr.ciudad}, {addr.departamento}
              </label>
            ))}
          </form>
          <div className="acciones-direcciones">
            <button type="button" onClick={() => setShowForm(true)}>Agregar nueva dirección</button>
            <button type="button" disabled={!selectedAddressId} onClick={handleContinue}>Continuar</button>
          </div>
        </div>
      )}

      {/* 🔹 Formulario de nueva dirección */}
      {showForm && (
        <div className="container">
          <form onSubmit={handleSubmit}>
            <h2>Agregar Dirección</h2>
            <div>
              <label>Dirección*</label>
              <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
            </div>
            <div>
              <label>Departamento</label>
              <input type="text" name="departamento" value={formData.departamento} onChange={handleChange} />
            </div>
            <div>
              <label>Ciudad</label>
              <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} />
            </div>
            <div>
              <label>Barrio</label>
              <input type="text" name="barrio" value={formData.barrio} onChange={handleChange} />
            </div>
            <div>
              <label>Apartamento</label>
              <input type="text" name="apartamento" value={formData.apartamento} onChange={handleChange} />
            </div>
            <div>
              <label>Indicaciones</label>
              <textarea name="indicaciones" value={formData.indicaciones} onChange={handleChange} />
            </div>
            <div>
              <label>Tipo de domicilio*</label>
              <select name="tipo_domicilio" value={formData.tipo_domicilio} onChange={handleChange}>
                <option value="residencia">Residencia</option>
                <option value="laboral">Laboral</option>
              </select>
            </div>
            <div>
              <label>Nombre del contacto*</label>
              <input type="text" name="nombre_contacto" value={formData.nombre_contacto} onChange={handleChange} required />
            </div>
            <div>
              <label>Celular del contacto*</label>
              <input type="text" name="celular_contacto" value={formData.celular_contacto} onChange={handleChange} required />
            </div>
            <div className="acciones-direcciones">
              <button type="submit">Guardar Dirección</button>
              {addresses.length > 0 && (
                <button type="button" onClick={() => setShowForm(false)}>Cancelar</button>
              )}
            </div>
            {mensaje && <p className="success">{mensaje}</p>}
            {errores && (
              <ul className="errores">
                {errores.map((err, index) => <li key={index}>{err.mensaje}</li>)}
              </ul>
            )}
          </form>
        </div>
      )}
    </div>
  );
};

export default AddressForm;

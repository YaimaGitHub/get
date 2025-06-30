import React, { useState, useEffect } from 'react';
import { useAllProductsContext } from '../../../contexts/ProductsContextProvider';
import { toastHandler } from '../../../utils/utils';
import { ToastType } from '../../../constants/constants';
import { v4 as uuid } from 'uuid';
import styles from './ProductManager.module.css';

const ProductManager = () => {
  const { products: productsFromContext } = useAllProductsContext();
  
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    description: '',
    category: '',
    company: '',
    stock: '',
    reviewCount: '',
    stars: '',
    colors: [{ color: '#000000', colorQuantity: 0 }],
    image: '',
    isShippingAvailable: true,
    featured: false
  });

  // Cargar productos desde el contexto
  useEffect(() => {
    setProducts(productsFromContext || []);
  }, [productsFromContext]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setHasUnsavedChanges(true);
  };

  const handleColorChange = (index, field, value) => {
    const newColors = [...formData.colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setFormData(prev => ({ ...prev, colors: newColors }));
    setHasUnsavedChanges(true);
  };

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { color: '#000000', colorQuantity: 0 }]
    }));
    setHasUnsavedChanges(true);
  };

  const removeColor = (index) => {
    if (formData.colors.length > 1) {
      const newColors = formData.colors.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, colors: newColors }));
      setHasUnsavedChanges(true);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.result }));
        setHasUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice.toString(),
      description: product.description,
      category: product.category,
      company: product.company,
      stock: product.stock.toString(),
      reviewCount: product.reviewCount.toString(),
      stars: product.stars.toString(),
      colors: product.colors,
      image: product.image,
      isShippingAvailable: product.isShippingAvailable,
      featured: product.featured || false
    });
    setIsEditing(true);
    setHasUnsavedChanges(false);
  };

  // GUARDAR CAMBIOS EN MEMORIA LOCAL (NO EXPORTAR)
  const handleSave = () => {
    // Validaciones
    if (!formData.name.trim()) {
      toastHandler(ToastType.Error, 'El nombre del producto es requerido');
      return;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toastHandler(ToastType.Error, 'El precio debe ser mayor a 0');
      return;
    }

    const newProduct = {
      _id: selectedProduct ? selectedProduct._id : uuid(),
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice) || parseFloat(formData.price),
      description: formData.description.trim(),
      category: formData.category,
      company: formData.company.trim(),
      stock: parseInt(formData.stock) || 0,
      reviewCount: parseInt(formData.reviewCount) || 0,
      stars: parseFloat(formData.stars) || 0,
      colors: formData.colors,
      image: formData.image,
      isShippingAvailable: formData.isShippingAvailable,
      featured: formData.featured
    };

    let updatedProducts;
    if (selectedProduct) {
      updatedProducts = products.map(p => p._id === selectedProduct._id ? newProduct : p);
      toastHandler(ToastType.Success, '✅ Producto actualizado (cambios en memoria)');
    } else {
      updatedProducts = [...products, newProduct];
      toastHandler(ToastType.Success, '✅ Producto creado (cambios en memoria)');
    }

    // SOLO GUARDAR EN MEMORIA LOCAL - NO EXPORTAR
    setProducts(updatedProducts);
    setIsEditing(false);
    setSelectedProduct(null);
    setHasUnsavedChanges(false);
    resetForm();

    // Mostrar mensaje informativo
    toastHandler(ToastType.Info, 'Para aplicar los cambios, ve a "💾 Exportar/Importar" y exporta la configuración');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      description: '',
      category: '',
      company: '',
      stock: '',
      reviewCount: '',
      stars: '',
      colors: [{ color: '#000000', colorQuantity: 0 }],
      image: '',
      isShippingAvailable: true,
      featured: false
    });
    setHasUnsavedChanges(false);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm('¿Estás seguro de cancelar? Se perderán los cambios no guardados.')) {
        return;
      }
    }
    setIsEditing(false);
    setSelectedProduct(null);
    setHasUnsavedChanges(false);
    resetForm();
  };

  // ELIMINAR PRODUCTO (SOLO EN MEMORIA)
  const handleDelete = (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto? Los cambios se guardarán en memoria.')) {
      return;
    }

    const updatedProducts = products.filter(p => p._id !== productId);
    setProducts(updatedProducts);
    toastHandler(ToastType.Success, '✅ Producto eliminado (cambios en memoria)');
    toastHandler(ToastType.Info, 'Para aplicar los cambios, ve a "💾 Exportar/Importar" y exporta la configuración');
  };

  // Verificar si hay cambios pendientes
  const hasChanges = products.length !== productsFromContext.length || 
    JSON.stringify(products) !== JSON.stringify(productsFromContext);

  return (
    <div className={styles.productManager}>
      <div className={styles.header}>
        <h2>Gestión de Productos</h2>
        <div className={styles.headerActions}>
          {hasChanges && (
            <span className={styles.changesIndicator}>
              🔴 Cambios pendientes
            </span>
          )}
          <button 
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            ➕ Nuevo Producto
          </button>
        </div>
      </div>

      <div className={styles.infoBox}>
        <h4>ℹ️ Información Importante</h4>
        <p>Los cambios se guardan temporalmente en memoria. Para aplicarlos permanentemente, ve a la sección "💾 Exportar/Importar" y exporta la configuración.</p>
      </div>

      {isEditing ? (
        <div className={styles.editForm}>
          <div className={styles.formHeader}>
            <h3>{selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
            {hasUnsavedChanges && (
              <span className={styles.unsavedIndicator}>
                🔴 Cambios sin guardar
              </span>
            )}
          </div>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Nombre del Producto</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Nombre del producto"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Precio</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Precio"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Precio Original</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Precio original"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Categoría</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Categoría"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Marca</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Marca"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Stock Total</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Stock"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Número de Reseñas</label>
              <input
                type="number"
                name="reviewCount"
                value={formData.reviewCount}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Número de reseñas"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Calificación (1-5)</label>
              <input
                type="number"
                name="stars"
                value={formData.stars}
                onChange={handleInputChange}
                className="form-input"
                min="1"
                max="5"
                step="0.1"
                placeholder="Calificación"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Descripción</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Descripción del producto"
              rows="4"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Imagen del Producto</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="form-input"
            />
            <small>O ingresa una URL de imagen:</small>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {formData.image && (
              <div className={styles.imagePreview}>
                <img src={formData.image} alt="Preview" />
              </div>
            )}
          </div>

          <div className={styles.colorsSection}>
            <label>Colores y Stock por Color</label>
            {formData.colors.map((color, index) => (
              <div key={index} className={styles.colorRow}>
                <input
                  type="color"
                  value={color.color}
                  onChange={(e) => handleColorChange(index, 'color', e.target.value)}
                  className={styles.colorPicker}
                />
                <input
                  type="number"
                  value={color.colorQuantity}
                  onChange={(e) => handleColorChange(index, 'colorQuantity', parseInt(e.target.value) || 0)}
                  className="form-input"
                  placeholder="Cantidad"
                />
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="btn btn-danger"
                  disabled={formData.colors.length === 1}
                >
                  ❌
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addColor}
              className="btn btn-hipster"
            >
              ➕ Agregar Color
            </button>
          </div>

          <div className={styles.checkboxGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="isShippingAvailable"
                checked={formData.isShippingAvailable}
                onChange={handleInputChange}
              />
              Envío Disponible
            </label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
              />
              Producto Destacado
            </label>
          </div>

          <div className={styles.formActions}>
            <button onClick={handleSave} className="btn btn-primary">
              💾 Guardar Cambios (En Memoria)
            </button>
            <button onClick={handleCancel} className="btn btn-danger">
              ❌ Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.productList}>
          <div className={styles.listHeader}>
            <h3>Productos Existentes ({products.length})</h3>
            {hasChanges && (
              <div className={styles.changesAlert}>
                <span>🔴 Hay {Math.abs(products.length - productsFromContext.length)} cambios pendientes</span>
                <small>Ve a "💾 Exportar/Importar" para aplicar los cambios</small>
              </div>
            )}
          </div>
          
          <div className={styles.productGrid}>
            {products.map(product => (
              <div key={product._id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.image} alt={product.name} />
                </div>
                <div className={styles.productInfo}>
                  <h4>{product.name}</h4>
                  <p className={styles.productPrice}>${product.price} CUP</p>
                  <p className={styles.productStock}>Stock: {product.stock}</p>
                  <p className={styles.productRating}>⭐ {product.stars} ({product.reviewCount})</p>
                </div>
                <div className={styles.productActions}>
                  <button
                    onClick={() => handleEdit(product)}
                    className="btn btn-primary"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="btn btn-danger"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
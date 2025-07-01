import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { useAllProductsContext } from '../../../contexts/ProductsContextProvider';
import { useConfigContext } from '../../../contexts/ConfigContextProvider';
import { toastHandler } from '../../../utils/utils';
import { ToastType } from '../../../constants/constants';
import styles from './ProductManager.module.css';

const ProductManager = () => {
  const { products, categories } = useAllProductsContext();
  const { updateProducts } = useConfigContext();
  const [localProducts, setLocalProducts] = useState([]);
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
    setLocalProducts(products || []);
  }, [products]);

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

    if (!formData.originalPrice || parseFloat(formData.originalPrice) <= 0) {
      toastHandler(ToastType.Error, 'El precio original debe ser mayor a 0');
      return;
    }

    if (!formData.category) {
      toastHandler(ToastType.Error, 'Selecciona una categoría');
      return;
    }

    if (!formData.company.trim()) {
      toastHandler(ToastType.Error, 'La marca es requerida');
      return;
    }

    if (!formData.image.trim()) {
      toastHandler(ToastType.Error, 'La imagen del producto es requerida');
      return;
    }

    // Validar colores
    const hasValidColors = formData.colors.every(color => 
      color.color && color.colorQuantity >= 0
    );

    if (!hasValidColors) {
      toastHandler(ToastType.Error, 'Todos los colores deben tener una cantidad válida');
      return;
    }

    // Calcular stock total basado en los colores
    const totalStock = formData.colors.reduce((total, color) => total + parseInt(color.colorQuantity || 0), 0);

    const newProduct = {
      _id: selectedProduct ? selectedProduct._id : uuid(),
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice),
      description: formData.description.trim(),
      category: formData.category,
      company: formData.company.trim(),
      stock: totalStock, // Stock calculado automáticamente
      reviewCount: parseInt(formData.reviewCount) || 0,
      stars: parseFloat(formData.stars) || 0,
      colors: formData.colors.map(color => ({
        color: color.color,
        colorQuantity: parseInt(color.colorQuantity) || 0
      })),
      image: formData.image,
      isShippingAvailable: formData.isShippingAvailable,
      featured: formData.featured,
      id: selectedProduct ? selectedProduct.id : (localProducts.length + 1).toString()
    };

    let updatedProducts;
    if (selectedProduct) {
      updatedProducts = localProducts.map(p => p._id === selectedProduct._id ? newProduct : p);
      toastHandler(ToastType.Success, '✅ Producto actualizado (cambios en memoria)');
    } else {
      updatedProducts = [...localProducts, newProduct];
      toastHandler(ToastType.Success, '✅ Producto creado (cambios en memoria)');
    }

    // SOLO GUARDAR EN MEMORIA LOCAL - NO EXPORTAR AUTOMÁTICAMENTE
    setLocalProducts(updatedProducts);
    
    // Mostrar mensaje informativo
    toastHandler(ToastType.Info, 'Para aplicar los cambios, ve a "💾 Exportar/Importar" y exporta la configuración');
    
    resetForm();
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
    setSelectedProduct(null);
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm('¿Estás seguro de cancelar? Se perderán los cambios no guardados.')) {
        return;
      }
    }
    resetForm();
  };

  const deleteProduct = (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto? Los cambios se guardarán en memoria.')) {
      return;
    }

    const updatedProducts = localProducts.filter(p => p._id !== productId);
    setLocalProducts(updatedProducts);
    toastHandler(ToastType.Success, '✅ Producto eliminado (cambios en memoria)');
    toastHandler(ToastType.Info, 'Para aplicar los cambios, ve a "💾 Exportar/Importar" y exporta la configuración');
  };

  // Verificar si hay cambios pendientes
  const hasChanges = localProducts.length !== products.length || 
    JSON.stringify(localProducts) !== JSON.stringify(products);

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
              <label>Nombre del Producto *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Nombre del producto"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Precio *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Precio"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Precio Original *</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Precio original"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Categoría *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.categoryName}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Marca *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Marca"
                required
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
                min="0"
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
            <label>Descripción *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Descripción del producto"
              rows="4"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Imagen del Producto *</label>
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
              required
            />
            {formData.image && (
              <div className={styles.imagePreview}>
                <img src={formData.image} alt="Preview" />
              </div>
            )}
          </div>

          <div className={styles.colorsSection}>
            <label>Colores y Stock por Color *</label>
            <p className={styles.stockInfo}>
              <strong>Stock Total Calculado:</strong> {formData.colors.reduce((total, color) => total + parseInt(color.colorQuantity || 0), 0)} unidades
            </p>
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
                  min="0"
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
              💾 {selectedProduct ? 'Actualizar' : 'Crear'} Producto (En Memoria)
            </button>
            <button onClick={handleCancel} className="btn btn-danger">
              ❌ Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.productList}>
          <div className={styles.listHeader}>
            <h3>Productos Existentes ({localProducts.length})</h3>
            {hasChanges && (
              <div className={styles.changesAlert}>
                <span>🔴 Hay {Math.abs(localProducts.length - products.length)} cambios pendientes</span>
                <small>Ve a "💾 Exportar/Importar" para aplicar los cambios</small>
              </div>
            )}
          </div>

          <div className={styles.productGrid}>
            {localProducts.map(product => (
              <div key={product._id} className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={product.image} alt={product.name} />
                </div>
                <div className={styles.productInfo}>
                  <h4>{product.name}</h4>
                  <p className={styles.productPrice}>${product.price.toLocaleString()} CUP</p>
                  <p className={styles.productStock}>Stock: {product.stock}</p>
                  <p className={styles.productRating}>⭐ {product.stars} ({product.reviewCount})</p>
                  <p className={styles.productCategory}>📂 {product.category}</p>
                  <p className={styles.productCompany}>🏢 {product.company}</p>
                  {product.featured && <span className={styles.featuredBadge}>⭐ Destacado</span>}
                </div>
                <div className={styles.productActions}>
                  <button
                    onClick={() => handleEdit(product)}
                    className="btn btn-primary"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => deleteProduct(product._id)}
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
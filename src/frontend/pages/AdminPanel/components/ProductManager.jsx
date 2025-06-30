import React, { useState } from 'react';
import { useAllProductsContext } from '../../../contexts/ProductsContextProvider';
import { toastHandler } from '../../../utils/utils';
import { ToastType } from '../../../constants/constants';
import styles from './ProductManager.module.css';

const ProductManager = () => {
  const { products, categories } = useAllProductsContext();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleColorChange = (index, field, value) => {
    const newColors = [...formData.colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setFormData(prev => ({ ...prev, colors: newColors }));
  };

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { color: '#000000', colorQuantity: 0 }]
    }));
  };

  const removeColor = (index) => {
    if (formData.colors.length > 1) {
      const newColors = formData.colors.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, colors: newColors }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.result }));
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

    // Aquí iría la lógica para guardar el producto
    // Por ahora solo mostramos un mensaje de éxito
    toastHandler(ToastType.Success, 
      selectedProduct ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente'
    );
    
    setIsEditing(false);
    setSelectedProduct(null);
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
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedProduct(null);
    resetForm();
  };

  return (
    <div className={styles.productManager}>
      <div className={styles.header}>
        <h2>Gestión de Productos</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setIsEditing(true)}
        >
          ➕ Nuevo Producto
        </button>
      </div>

      {isEditing ? (
        <div className={styles.editForm}>
          <h3>{selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
          
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
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
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
              💾 Guardar
            </button>
            <button onClick={handleCancel} className="btn btn-danger">
              ❌ Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.productList}>
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
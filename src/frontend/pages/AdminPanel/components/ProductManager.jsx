import React, { useState, useEffect } from 'react';
import { useAllProductsContext } from '../../../contexts/ProductsContextProvider';
import { useConfigContext } from '../../../contexts/ConfigContextProvider';
import { toastHandler } from '../../../utils/utils';
import { ToastType } from '../../../constants/constants';
import { v4 as uuid } from 'uuid';
import styles from './ProductManager.module.css';

const ProductManager = () => {
  const { categories } = useAllProductsContext();
  const { storeConfig, updateProducts } = useConfigContext();
  
  const [products, setProducts] = useState([]);
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

  // Cargar productos desde la configuración
  useEffect(() => {
    setProducts(storeConfig.products || []);
  }, [storeConfig.products]);

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

  const handleSave = async () => {
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
    } else {
      updatedProducts = [...products, newProduct];
    }

    // Guardar en la configuración JSON (esto también guarda en código fuente)
    const result = await updateProducts(updatedProducts);
    
    if (result) {
      setProducts(updatedProducts);
      setIsEditing(false);
      setSelectedProduct(null);
      resetForm();
    }
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

  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto? Los cambios se guardarán en el código fuente.')) {
      return;
    }

    const updatedProducts = products.filter(p => p._id !== productId);
    const result = await updateProducts(updatedProducts);
    
    if (result) {
      setProducts(updatedProducts);
    }
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

      <div className={styles.warningBox}>
        <h4>⚠️ Importante</h4>
        <p>Los cambios realizados aquí se guardarán directamente en el código fuente de la aplicación y se exportarán en el archivo JSON de configuración.</p>
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
                {(storeConfig.categories || []).map(cat => (
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
              💾 Guardar en Código Fuente
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
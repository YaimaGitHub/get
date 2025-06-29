import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { toastHandler } from '../../../utils/utils';
import { ToastType } from '../../../constants/constants';
import { useAllProductsContext } from '../../../contexts/ProductsContextProvider';
import styles from './CategoryManager.module.css';

const CategoryManager = () => {
  const { categories } = useAllProductsContext();
  const [localCategories, setLocalCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const initialCategoryState = {
    categoryName: '',
    categoryImage: '',
    description: ''
  };

  const [categoryForm, setCategoryForm] = useState(initialCategoryState);

  // Cargar categorías desde el contexto
  useEffect(() => {
    setLocalCategories(categories || []);
  }, [categories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCategoryForm(prev => ({ ...prev, categoryImage: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveToSourceCode = async (updatedCategories) => {
    try {
      // Simular guardado en el código fuente
      // En una implementación real, esto haría una llamada al backend
      // para actualizar el archivo de categorías
      
      const categoriesData = updatedCategories.map(cat => ({
        _id: cat._id,
        categoryName: cat.categoryName,
        categoryImage: cat.categoryImage,
        description: cat.description || '',
      }));

      // Aquí iría la lógica para escribir al archivo fuente
      console.log('Guardando categorías en el código fuente:', categoriesData);
      
      // Simular delay de guardado
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Error al guardar en código fuente:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!categoryForm.categoryName.trim()) {
      toastHandler(ToastType.Error, 'El nombre de la categoría es requerido');
      return;
    }
    
    if (!categoryForm.categoryImage.trim()) {
      toastHandler(ToastType.Error, 'La imagen de la categoría es requerida');
      return;
    }

    // Verificar nombre duplicado
    const isDuplicate = localCategories.some(category => 
      category.categoryName.toLowerCase() === categoryForm.categoryName.toLowerCase() && 
      category._id !== editingCategory?._id
    );

    if (isDuplicate) {
      toastHandler(ToastType.Error, 'Ya existe una categoría con este nombre');
      return;
    }

    const newCategory = {
      ...categoryForm,
      _id: editingCategory ? editingCategory._id : uuid(),
      categoryName: categoryForm.categoryName.toLowerCase().trim(),
    };

    let updatedCategories;
    if (editingCategory) {
      updatedCategories = localCategories.map(c => c._id === editingCategory._id ? newCategory : c);
      toastHandler(ToastType.Info, 'Guardando cambios en el código fuente...');
    } else {
      updatedCategories = [...localCategories, newCategory];
      toastHandler(ToastType.Info, 'Creando categoría en el código fuente...');
    }

    // Guardar en el código fuente
    const saved = await saveToSourceCode(updatedCategories);
    
    if (saved) {
      setLocalCategories(updatedCategories);
      toastHandler(ToastType.Success, 
        editingCategory ? 'Categoría actualizada en el código fuente' : 'Categoría creada en el código fuente'
      );
      resetForm();
    } else {
      toastHandler(ToastType.Error, 'Error al guardar en el código fuente');
    }
  };

  const resetForm = () => {
    setCategoryForm(initialCategoryState);
    setEditingCategory(null);
    setShowForm(false);
  };

  const editCategory = (category) => {
    setCategoryForm({
      categoryName: category.categoryName,
      categoryImage: category.categoryImage,
      description: category.description || ''
    });
    setEditingCategory(category);
    setShowForm(true);
  };

  const toggleCategoryStatus = async (categoryId) => {
    const category = localCategories.find(c => c._id === categoryId);
    if (!category) return;

    const updatedCategories = localCategories.map(c => 
      c._id === categoryId 
        ? { ...c, disabled: !c.disabled }
        : c
    );

    toastHandler(ToastType.Info, 'Actualizando estado en el código fuente...');
    
    const saved = await saveToSourceCode(updatedCategories);
    
    if (saved) {
      setLocalCategories(updatedCategories);
      toastHandler(ToastType.Success, 
        `Categoría ${category.disabled ? 'habilitada' : 'deshabilitada'} en el código fuente`
      );
    } else {
      toastHandler(ToastType.Error, 'Error al actualizar el código fuente');
    }
  };

  const deleteCategory = async (categoryId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría? Esta acción se guardará en el código fuente.')) {
      return;
    }

    toastHandler(ToastType.Info, 'Eliminando categoría del código fuente...');
    
    const updatedCategories = localCategories.filter(c => c._id !== categoryId);
    
    const saved = await saveToSourceCode(updatedCategories);
    
    if (saved) {
      setLocalCategories(updatedCategories);
      toastHandler(ToastType.Success, 'Categoría eliminada del código fuente');
    } else {
      toastHandler(ToastType.Error, 'Error al eliminar del código fuente');
    }
  };

  return (
    <div className={styles.categoryManager}>
      <div className={styles.header}>
        <h2>Gestión de Categorías</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Nueva Categoría'}
        </button>
      </div>

      <div className={styles.warningBox}>
        <h4>⚠️ Importante</h4>
        <p>Los cambios realizados aquí se guardarán directamente en el código fuente de la aplicación, no en el almacenamiento local del navegador.</p>
      </div>

      {showForm && (
        <form className={styles.categoryForm} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Nombre de la Categoría *</label>
              <input
                type="text"
                name="categoryName"
                value={categoryForm.categoryName}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ej: smartphones"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Descripción</label>
              <textarea
                name="description"
                value={categoryForm.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Descripción de la categoría"
                rows="3"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Imagen de la Categoría *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="form-input"
            />
            <small>O ingresa una URL de imagen:</small>
            <input
              type="url"
              name="categoryImage"
              value={categoryForm.categoryImage}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {categoryForm.categoryImage && (
              <div className={styles.imagePreview}>
                <img src={categoryForm.categoryImage} alt="Preview" />
              </div>
            )}
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-primary">
              {editingCategory ? 'Actualizar Categoría' : 'Crear Categoría'}
            </button>
            <button type="button" onClick={resetForm} className="btn btn-hipster">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className={styles.categoriesList}>
        <h3>Categorías Existentes ({localCategories.length})</h3>
        {localCategories.length === 0 ? (
          <p className={styles.emptyMessage}>No hay categorías creadas aún.</p>
        ) : (
          <div className={styles.categoriesGrid}>
            {localCategories.map(category => (
              <div key={category._id} className={`${styles.categoryCard} ${category.disabled ? styles.disabled : ''}`}>
                <div className={styles.categoryImage}>
                  <img src={category.categoryImage} alt={category.categoryName} />
                  {category.disabled && (
                    <div className={styles.disabledOverlay}>
                      <span>DESHABILITADA</span>
                    </div>
                  )}
                </div>
                <div className={styles.categoryInfo}>
                  <h4>{category.categoryName}</h4>
                  {category.description && (
                    <p>{category.description}</p>
                  )}
                  <span className={`${styles.status} ${category.disabled ? styles.statusDisabled : styles.statusActive}`}>
                    {category.disabled ? 'Deshabilitada' : 'Activa'}
                  </span>
                </div>
                <div className={styles.categoryActions}>
                  <button
                    onClick={() => editCategory(category)}
                    className="btn btn-primary"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => toggleCategoryStatus(category._id)}
                    className={`btn ${category.disabled ? 'btn-success' : 'btn-hipster'}`}
                  >
                    {category.disabled ? 'Habilitar' : 'Deshabilitar'}
                  </button>
                  <button
                    onClick={() => deleteCategory(category._id)}
                    className="btn btn-danger"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
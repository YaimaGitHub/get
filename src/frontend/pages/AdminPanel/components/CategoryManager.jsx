import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { toastHandler } from '../../../utils/utils';
import { ToastType } from '../../../constants/constants';
import { useAllProductsContext } from '../../../contexts/ProductsContextProvider';
import styles from './CategoryManager.module.css';

const CategoryManager = () => {
  const { categories: categoriesFromContext } = useAllProductsContext();
  const [localCategories, setLocalCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const initialCategoryState = {
    categoryName: '',
    categoryImage: '',
    description: ''
  };

  const [categoryForm, setCategoryForm] = useState(initialCategoryState);

  // Cargar categorías desde el contexto
  useEffect(() => {
    setLocalCategories(categoriesFromContext || []);
  }, [categoriesFromContext]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryForm(prev => ({
      ...prev,
      [name]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCategoryForm(prev => ({ ...prev, categoryImage: e.target.result }));
        setHasUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // GUARDAR CAMBIOS EN MEMORIA LOCAL (NO EXPORTAR)
  const handleSubmit = (e) => {
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
      toastHandler(ToastType.Success, '✅ Categoría actualizada (cambios en memoria)');
    } else {
      updatedCategories = [...localCategories, newCategory];
      toastHandler(ToastType.Success, '✅ Categoría creada (cambios en memoria)');
    }

    // SOLO GUARDAR EN MEMORIA LOCAL - NO EXPORTAR
    setLocalCategories(updatedCategories);
    resetForm();

    // Mostrar mensaje informativo
    toastHandler(ToastType.Info, 'Para aplicar los cambios, ve a "💾 Exportar/Importar" y exporta la configuración');
  };

  const resetForm = () => {
    setCategoryForm(initialCategoryState);
    setEditingCategory(null);
    setShowForm(false);
    setHasUnsavedChanges(false);
  };

  const editCategory = (category) => {
    setCategoryForm({
      categoryName: category.categoryName,
      categoryImage: category.categoryImage,
      description: category.description || ''
    });
    setEditingCategory(category);
    setShowForm(true);
    setHasUnsavedChanges(false);
  };

  const toggleCategoryStatus = (categoryId) => {
    const updatedCategories = localCategories.map(c => 
      c._id === categoryId 
        ? { ...c, disabled: !c.disabled }
        : c
    );

    setLocalCategories(updatedCategories);
    const category = localCategories.find(c => c._id === categoryId);
    toastHandler(ToastType.Success, 
      `✅ Categoría ${category.disabled ? 'habilitada' : 'deshabilitada'} (cambios en memoria)`
    );
    toastHandler(ToastType.Info, 'Para aplicar los cambios, ve a "💾 Exportar/Importar" y exporta la configuración');
  };

  const deleteCategory = (categoryId) => {
    if (!window.confirm('¿Estás seguro de eliminar esta categoría? Los cambios se guardarán en memoria.')) {
      return;
    }

    const updatedCategories = localCategories.filter(c => c._id !== categoryId);
    setLocalCategories(updatedCategories);
    toastHandler(ToastType.Success, '✅ Categoría eliminada (cambios en memoria)');
    toastHandler(ToastType.Info, 'Para aplicar los cambios, ve a "💾 Exportar/Importar" y exporta la configuración');
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm('¿Estás seguro de cancelar? Se perderán los cambios no guardados.')) {
        return;
      }
    }
    resetForm();
  };

  // Verificar si hay cambios pendientes
  const hasChanges = localCategories.length !== categoriesFromContext.length || 
    JSON.stringify(localCategories) !== JSON.stringify(categoriesFromContext);

  return (
    <div className={styles.categoryManager}>
      <div className={styles.header}>
        <h2>Gestión de Categorías</h2>
        <div className={styles.headerActions}>
          {hasChanges && (
            <span className={styles.changesIndicator}>
              🔴 Cambios pendientes
            </span>
          )}
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : '+ Nueva Categoría'}
          </button>
        </div>
      </div>

      <div className={styles.infoBox}>
        <h4>ℹ️ Información Importante</h4>
        <p>Los cambios se guardan temporalmente en memoria. Para aplicarlos permanentemente, ve a la sección "💾 Exportar/Importar" y exporta la configuración.</p>
      </div>

      {showForm && (
        <form className={styles.categoryForm} onSubmit={handleSubmit}>
          <div className={styles.formHeader}>
            <h3>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h3>
            {hasUnsavedChanges && (
              <span className={styles.unsavedIndicator}>
                🔴 Cambios sin guardar
              </span>
            )}
          </div>

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
              💾 {editingCategory ? 'Actualizar' : 'Crear'} Categoría (En Memoria)
            </button>
            <button type="button" onClick={handleCancel} className="btn btn-hipster">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className={styles.categoriesList}>
        <div className={styles.listHeader}>
          <h3>Categorías Existentes ({localCategories.length})</h3>
          {hasChanges && (
            <div className={styles.changesAlert}>
              <span>🔴 Hay {Math.abs(localCategories.length - categoriesFromContext.length)} cambios pendientes</span>
              <small>Ve a "💾 Exportar/Importar" para aplicar los cambios</small>
            </div>
          )}
        </div>

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
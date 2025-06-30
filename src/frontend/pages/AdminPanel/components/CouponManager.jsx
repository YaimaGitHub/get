import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { toastHandler } from '../../../utils/utils';
import { ToastType } from '../../../constants/constants';
import { useConfigContext } from '../../../contexts/ConfigContextProvider';
import styles from './CouponManager.module.css';

const CouponManager = () => {
  const { storeConfig } = useConfigContext();
  const [coupons, setCoupons] = useState([]);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const initialCouponState = {
    couponCode: '',
    text: '',
    discountPercent: '',
    minCartPriceRequired: ''
  };

  const [couponForm, setCouponForm] = useState(initialCouponState);

  // Cargar cupones desde la configuración
  useEffect(() => {
    setCoupons(storeConfig.coupons || []);
  }, [storeConfig.coupons]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCouponForm(prev => ({
      ...prev,
      [name]: value
    }));
    setHasUnsavedChanges(true);
  };

  // GUARDAR CAMBIOS EN MEMORIA LOCAL (NO EXPORTAR)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!couponForm.couponCode.trim()) {
      toastHandler(ToastType.Error, 'El código del cupón es requerido');
      return;
    }
    
    if (!couponForm.discountPercent || couponForm.discountPercent <= 0 || couponForm.discountPercent > 100) {
      toastHandler(ToastType.Error, 'El descuento debe ser entre 1 y 100%');
      return;
    }

    if (!couponForm.minCartPriceRequired || couponForm.minCartPriceRequired < 0) {
      toastHandler(ToastType.Error, 'El precio mínimo debe ser mayor o igual a 0');
      return;
    }

    // Verificar código duplicado
    const isDuplicate = coupons.some(coupon => 
      coupon.couponCode.toUpperCase() === couponForm.couponCode.toUpperCase() && 
      coupon.id !== editingCoupon?.id
    );

    if (isDuplicate) {
      toastHandler(ToastType.Error, 'Ya existe un cupón con este código');
      return;
    }

    const newCoupon = {
      ...couponForm,
      id: editingCoupon ? editingCoupon.id : uuid(),
      couponCode: couponForm.couponCode.toUpperCase(),
      text: couponForm.text || `${couponForm.discountPercent}% Descuento`,
      discountPercent: parseInt(couponForm.discountPercent),
      minCartPriceRequired: parseFloat(couponForm.minCartPriceRequired)
    };

    let updatedCoupons;
    if (editingCoupon) {
      updatedCoupons = coupons.map(c => c.id === editingCoupon.id ? newCoupon : c);
      toastHandler(ToastType.Success, '✅ Cupón actualizado (cambios en memoria)');
    } else {
      updatedCoupons = [...coupons, newCoupon];
      toastHandler(ToastType.Success, '✅ Cupón creado (cambios en memoria)');
    }

    // SOLO GUARDAR EN MEMORIA LOCAL - NO EXPORTAR
    setCoupons(updatedCoupons);
    resetForm();

    // Mostrar mensaje informativo
    toastHandler(ToastType.Info, 'Para aplicar los cambios, ve a "💾 Exportar/Importar" y exporta la configuración');
  };

  const resetForm = () => {
    setCouponForm(initialCouponState);
    setEditingCoupon(null);
    setShowForm(false);
    setHasUnsavedChanges(false);
  };

  const editCoupon = (coupon) => {
    setCouponForm({
      couponCode: coupon.couponCode,
      text: coupon.text,
      discountPercent: coupon.discountPercent.toString(),
      minCartPriceRequired: coupon.minCartPriceRequired.toString()
    });
    setEditingCoupon(coupon);
    setShowForm(true);
    setHasUnsavedChanges(false);
  };

  const deleteCoupon = (couponId) => {
    if (window.confirm('¿Estás seguro de eliminar este cupón? Los cambios se guardarán en memoria.')) {
      const updatedCoupons = coupons.filter(c => c.id !== couponId);
      setCoupons(updatedCoupons);
      toastHandler(ToastType.Success, '✅ Cupón eliminado (cambios en memoria)');
      toastHandler(ToastType.Info, 'Para aplicar los cambios, ve a "💾 Exportar/Importar" y exporta la configuración');
    }
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
  const hasChanges = coupons.length !== (storeConfig.coupons || []).length || 
    JSON.stringify(coupons) !== JSON.stringify(storeConfig.coupons || []);

  return (
    <div className={styles.couponManager}>
      <div className={styles.header}>
        <h2>Gestión de Cupones</h2>
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
            {showForm ? 'Cancelar' : '+ Nuevo Cupón'}
          </button>
        </div>
      </div>

      <div className={styles.infoBox}>
        <h4>ℹ️ Información Importante</h4>
        <p>Los cambios se guardan temporalmente en memoria. Para aplicarlos permanentemente, ve a la sección "💾 Exportar/Importar" y exporta la configuración.</p>
      </div>

      {showForm && (
        <form className={styles.couponForm} onSubmit={handleSubmit}>
          <div className={styles.formHeader}>
            <h3>{editingCoupon ? 'Editar Cupón' : 'Nuevo Cupón'}</h3>
            {hasUnsavedChanges && (
              <span className={styles.unsavedIndicator}>
                🔴 Cambios sin guardar
              </span>
            )}
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Código del Cupón *</label>
              <input
                type="text"
                name="couponCode"
                value={couponForm.couponCode}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ej: DESCUENTO20"
                style={{ textTransform: 'uppercase' }}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Porcentaje de Descuento * (%)</label>
              <input
                type="number"
                name="discountPercent"
                value={couponForm.discountPercent}
                onChange={handleInputChange}
                className="form-input"
                min="1"
                max="100"
                placeholder="Ej: 20"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Precio Mínimo Requerido * (CUP)</label>
              <input
                type="number"
                name="minCartPriceRequired"
                value={couponForm.minCartPriceRequired}
                onChange={handleInputChange}
                className="form-input"
                min="0"
                step="0.01"
                placeholder="Ej: 50000"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Texto Descriptivo</label>
              <input
                type="text"
                name="text"
                value={couponForm.text}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ej: 20% Descuento"
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-primary">
              💾 {editingCoupon ? 'Actualizar' : 'Crear'} Cupón (En Memoria)
            </button>
            <button type="button" onClick={handleCancel} className="btn btn-hipster">
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className={styles.couponsList}>
        <div className={styles.listHeader}>
          <h3>Cupones Existentes ({coupons.length})</h3>
          {hasChanges && (
            <div className={styles.changesAlert}>
              <span>🔴 Hay {Math.abs(coupons.length - (storeConfig.coupons || []).length)} cambios pendientes</span>
              <small>Ve a "💾 Exportar/Importar" para aplicar los cambios</small>
            </div>
          )}
        </div>

        {coupons.length === 0 ? (
          <p className={styles.emptyMessage}>No hay cupones creados aún.</p>
        ) : (
          <div className={styles.couponsGrid}>
            {coupons.map(coupon => (
              <div key={coupon.id} className={styles.couponCard}>
                <div className={styles.couponHeader}>
                  <h4>{coupon.couponCode}</h4>
                  <span className={styles.discountBadge}>
                    {coupon.discountPercent}% OFF
                  </span>
                </div>
                <div className={styles.couponInfo}>
                  <p><strong>Descripción:</strong> {coupon.text}</p>
                  <p><strong>Descuento:</strong> {coupon.discountPercent}%</p>
                  <p><strong>Compra mínima:</strong> ${coupon.minCartPriceRequired.toLocaleString()} CUP</p>
                </div>
                <div className={styles.couponActions}>
                  <button
                    onClick={() => editCoupon(coupon)}
                    className="btn btn-primary"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteCoupon(coupon.id)}
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

export default CouponManager;
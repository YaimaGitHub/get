import { SERVICE_TYPES, ToastType } from '../../constants/constants';
import { useConfigContext } from '../../contexts/ConfigContextProvider';

import { useAllProductsContext } from '../../contexts/ProductsContextProvider';

import { useState } from 'react';

import { v4 as uuid } from 'uuid';
import FormRow from '../FormRow';

import styles from './AddressForm.module.css';
import {
  toastHandler,
  validateEmptyTextInput,
} from '../../utils/utils';

const AddressForm = ({ isAdding, isEditingAndData = null, closeForm }) => {
  const { addAddressDispatch, timedMainPageLoader, editAddressDispatch } =
    useAllProductsContext();

  const { storeConfig } = useConfigContext();
  const SANTIAGO_ZONES = storeConfig.zones || [];

  const isEditing = !!isEditingAndData;

  const defaultState = {
    username: '',
    mobile: '',
    serviceType: SERVICE_TYPES.HOME_DELIVERY,
    zone: '',
    addressInfo: '',
    receiverName: '',
    receiverPhone: '',
    additionalInfo: '',
  };

  const [inputs, setInputs] = useState(
    isEditing ? isEditingAndData : defaultState
  );

  const handleInputChange = (e) => {
    const targetEle = e.target;
    const targetEleName = targetEle.name;
    let elementValue = targetEle.value;

    if (targetEle.type === 'number') {
      elementValue = isNaN(targetEle.valueAsNumber)
        ? ''
        : targetEle.valueAsNumber;
    }

    setInputs({
      ...inputs,
      [targetEleName]: elementValue,
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    // Validaciones según el tipo de servicio
    let requiredFields = ['username', 'mobile', 'serviceType'];
    
    if (inputs.serviceType === SERVICE_TYPES.HOME_DELIVERY) {
      requiredFields = [...requiredFields, 'zone', 'addressInfo', 'receiverName', 'receiverPhone'];
    }

    // Validar campos requeridos
    for (const field of requiredFields) {
      if (!inputs[field] || (typeof inputs[field] === 'string' && !inputs[field].trim())) {
        toastHandler(ToastType.Error, 'Por favor completa todos los campos obligatorios');
        return;
      }
    }

    await timedMainPageLoader();

    const addressData = {
      ...inputs,
      addressId: isEditing ? isEditingAndData.addressId : uuid(),
      deliveryCost: inputs.serviceType === SERVICE_TYPES.HOME_DELIVERY 
        ? SANTIAGO_ZONES.find(zone => zone.id === inputs.zone)?.cost || 0
        : 0
    };

    if (isAdding) {
      addAddressDispatch(addressData);
    }

    if (isEditing) {
      editAddressDispatch(addressData);
    }

    closeForm();
  };

  const handleReset = () => {
    setInputs(defaultState);
  };

  const isHomeDelivery = inputs.serviceType === SERVICE_TYPES.HOME_DELIVERY;

  return (
    <div className={styles.formOverlay}>
      <form
        onClick={(e) => e.stopPropagation()}
        className={styles.form}
        onSubmit={handleSubmitForm}
      >
        <div className={styles.formHeader}>
          <h3>{isEditing ? 'Editar Dirección' : 'Nueva Dirección'}</h3>
          <button type="button" className={styles.closeBtn} onClick={closeForm}>
            ✕
          </button>
        </div>

        <div className={styles.formContent}>
          <FormRow
            text='Nombre'
            type='text'
            name='username'
            id='username'
            placeholder='Tu nombre completo'
            value={inputs.username}
            handleChange={handleInputChange}
          />

          <FormRow
            text='Número de Móvil'
            type='tel'
            name='mobile'
            id='mobile'
            placeholder='Tu número de móvil'
            value={inputs.mobile}
            handleChange={handleInputChange}
          />

          <div className={styles.formGroup}>
            <label htmlFor='serviceType'>Tipo de Servicio</label>
            <select
              className='form-select'
              name='serviceType'
              id='serviceType'
              onChange={handleInputChange}
              value={inputs.serviceType}
              required
            >
              <option value={SERVICE_TYPES.HOME_DELIVERY}>🚚 Entrega a domicilio</option>
              <option value={SERVICE_TYPES.PICKUP}>🏪 Pedido para recoger en el local</option>
            </select>
          </div>

          {isHomeDelivery ? (
            <div className={styles.deliverySection}>
              <div className={styles.formGroup}>
                <label htmlFor='zone'>📍 ¿Dónde la entregamos? - Selecciona la zona de tu dirección</label>
                <select
                  className='form-select'
                  name='zone'
                  id='zone'
                  onChange={handleInputChange}
                  value={inputs.zone}
                  required
                >
                  <option value='' disabled>
                    Selecciona tu zona en Santiago de Cuba:
                  </option>
                  {SANTIAGO_ZONES.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} - ${zone.cost} CUP
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor='addressInfo'>🏠 Dirección</label>
                <textarea
                  name='addressInfo'
                  id='addressInfo'
                  className='form-textarea'
                  placeholder='Dirección completa (calle, número, entre calles, etc.)'
                  value={inputs.addressInfo}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <FormRow
                text='👤 ¿Quién recibe el pedido?'
                type='text'
                name='receiverName'
                id='receiverName'
                placeholder='Nombre de quien recibe'
                value={inputs.receiverName}
                handleChange={handleInputChange}
              />

              <FormRow
                text='📞 Teléfono'
                type='tel'
                name='receiverPhone'
                id='receiverPhone'
                placeholder='Teléfono de quien recibe'
                value={inputs.receiverPhone}
                handleChange={handleInputChange}
              />
            </div>
          ) : (
            <div className={styles.formGroup}>
              <label htmlFor='additionalInfo'>💬 ¿Quieres aclararnos algo?</label>
              <textarea
                name='additionalInfo'
                id='additionalInfo'
                className='form-textarea'
                placeholder='Información adicional sobre tu pedido'
                value={inputs.additionalInfo}
                onChange={handleInputChange}
              />
            </div>
          )}
        </div>

        <div className={`btn-container ${styles.formBtnContainer}`}>
          <button type='submit' className='btn btn-primary'>
            {isEditing ? '✅ Actualizar' : '➕ Agregar'}
          </button>

          <button onClick={handleReset} type='button' className='btn btn-hipster'>
            🔄 Restablecer
          </button>

          <button type='button' className='btn btn-danger' onClick={closeForm}>
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;
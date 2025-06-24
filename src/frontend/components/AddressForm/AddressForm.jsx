import { ALL_STATES, ToastType } from '../../constants/constants';

import { useAllProductsContext } from '../../contexts/ProductsContextProvider';

import { useState } from 'react';

import { v4 as uuid } from 'uuid';
import FormRow from '../FormRow';

import styles from './AddressForm.module.css';
import {
  giveRandomData,
  toastHandler,
  validateEmptyTextInput,
} from '../../utils/utils';

const AddressForm = ({ isAdding, isEditingAndData = null, closeForm }) => {
  const { addAddressDispatch, timedMainPageLoader, editAddressDispatch } =
    useAllProductsContext();

  const isEditing = !!isEditingAndData;

  // alternate is optional
  const defaultState = {
    username: '',
    mobile: '',
    alternate: '',
    addressInfo: '',
    pincode: '',
    city: '',
    state: '',
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

    let isAnyInputEmpty = validateEmptyTextInput({
      inputsObj: inputs,
      optionalInput: 'alternate',
    });

    if (isAnyInputEmpty) {
      toastHandler(ToastType.Error, 'Por favor completa todos los campos');
      return;
    }

    await timedMainPageLoader();

    if (isAdding) {
      addAddressDispatch({ ...inputs, addressId: uuid() });
    }

    if (isEditing) {
      editAddressDispatch({ ...inputs, addressId: isEditingAndData.addressId });
    }

    closeForm();
  };

  const handleReset = () => {
    setInputs(defaultState);
  };

  const handleRandomData = () => {
    setInputs(giveRandomData());
  };

  //  stop propagation as this form will be inside modal, on clicking form, the modal should not close.
  return (
    <form
      onClick={(e) => e.stopPropagation()}
      className={styles.form}
      onSubmit={handleSubmitForm}
    >
      <FormRow
        text='Nombre'
        type='text'
        name='username'
        id='username'
        placeholder='nombre'
        value={inputs.username}
        handleChange={handleInputChange}
      />

      <FormRow
        text='Número de Móvil'
        type='number'
        name='mobile'
        id='mobile'
        placeholder='móvil'
        value={inputs.mobile}
        handleChange={handleInputChange}
      />

      <FormRow
        text='Código Postal'
        type='number'
        name='pincode'
        id='pincode'
        placeholder='código postal'
        value={inputs.pincode}
        handleChange={handleInputChange}
      />

      <FormRow
        text='Ciudad'
        type='text'
        name='city'
        id='city'
        placeholder='ciudad'
        value={inputs.city}
        handleChange={handleInputChange}
      />

      <div>
        <label htmlFor='textarea'>Dirección</label>
        <textarea
          name='addressInfo'
          id='textarea'
          className='form-textarea'
          placeholder='dirección'
          value={inputs.addressInfo}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
        <label htmlFor='alternate'>Móvil Alternativo</label>
        <input
          type='number'
          name='alternate'
          id='alternate'
          placeholder='alternativo'
          value={inputs.alternate}
          onChange={handleInputChange}
          className='form-input'
        />
      </div>

      <div>
        <label htmlFor='state'>Provincia</label>
        <select
          className='form-select'
          name='state'
          id='state'
          onChange={handleInputChange}
          value={inputs.state}
          required
        >
          <option id='state' value='' disabled>
            Elige Provincia:
          </option>

          {ALL_STATES.map((singleState, index) => (
            <option key={index} id='state' value={singleState}>
              {singleState}
            </option>
          ))}
        </select>
      </div>

      <div className={`btn-container ${styles.formBtnContainer}`}>
        <button type='submit' className='btn btn-primary'>
          {isEditing ? 'Actualizar' : 'Agregar'}
        </button>

        <button onClick={handleReset} type='button' className='btn btn-hipster'>
          Restablecer
        </button>

        <button onClick={handleRandomData} type='button' className='btn'>
          Datos Aleatorios
        </button>

        <button type='button' className='btn btn-danger' onClick={closeForm}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
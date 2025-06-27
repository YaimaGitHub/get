import { useAllProductsContext } from '../../contexts/ProductsContextProvider';
import Price from '../Price';
import styles from './CheckoutDetails.module.css';
import { useState } from 'react';
import { VscChromeClose } from 'react-icons/vsc';

import { CHARGE_AND_DISCOUNT, ToastType, SERVICE_TYPES, SANTIAGO_ZONES, STORE_WHATSAPP } from '../../constants/constants';
import CouponSearch from './CouponSearch';
import { toastHandler, Popper, generateOrderNumber } from '../../utils/utils';

import { useAuthContext } from '../../contexts/AuthContextProvider';
import { useNavigate } from 'react-router-dom';

const CheckoutDetails = ({
  timer,
  activeAddressId: activeAddressIdFromProps,
  updateCheckoutStatus,
}) => {
  const {
    cartDetails: {
      totalAmount: totalAmountFromContext,
      totalCount: totalCountFromContext,
    },
    addressList: addressListFromContext,
    cart: cartFromContext,
    clearCartDispatch,
  } = useAllProductsContext();

  const {
    user: { firstName, lastName, email },
  } = useAuthContext();
  const navigate = useNavigate();
  const [activeCoupon, setActiveCoupon] = useState(null);

  // Obtener la dirección seleccionada
  const selectedAddress = addressListFromContext.find(
    ({ addressId }) => addressId === activeAddressIdFromProps
  );

  // Calcular costo de entrega
  const deliveryCost = selectedAddress?.serviceType === SERVICE_TYPES.HOME_DELIVERY 
    ? (selectedAddress?.deliveryCost || 0)
    : 0;

  const priceAfterCouponApplied = activeCoupon
    ? -Math.floor((totalAmountFromContext * activeCoupon.discountPercent) / 100)
    : 0;

  const finalPriceToPay =
    totalAmountFromContext +
    deliveryCost +
    CHARGE_AND_DISCOUNT.discount +
    priceAfterCouponApplied;

  const updateActiveCoupon = (couponObjClicked) => {
    setActiveCoupon(couponObjClicked);
    toastHandler(ToastType.Success, 'Cupón aplicado exitosamente');
  };

  const cancelCoupon = () => {
    setActiveCoupon(null);
    toastHandler(ToastType.Warn, 'Cupón removido');
  };

  const sendToWhatsApp = async (orderData) => {
    const orderNumber = generateOrderNumber();
    
    let message = `🛒 *NUEVO PEDIDO #${orderNumber}*\n\n`;
    message += `👤 *Cliente:* ${firstName} ${lastName}\n`;
    message += `📧 *Email:* ${email}\n\n`;
    
    // Información del servicio
    if (selectedAddress.serviceType === SERVICE_TYPES.HOME_DELIVERY) {
      const zoneName = SANTIAGO_ZONES.find(z => z.id === selectedAddress.zone)?.name;
      message += `🚚 *Servicio:* Entrega a domicilio\n`;
      message += `📍 *Zona:* ${zoneName}\n`;
      message += `🏠 *Dirección:* ${selectedAddress.addressInfo}\n`;
      message += `👤 *Recibe:* ${selectedAddress.receiverName}\n`;
      message += `📱 *Teléfono recibe:* ${selectedAddress.receiverPhone}\n`;
      message += `💰 *Costo entrega:* $${deliveryCost} CUP\n`;
    } else {
      message += `🏪 *Servicio:* Recoger en local\n`;
      if (selectedAddress.additionalInfo) {
        message += `📝 *Info adicional:* ${selectedAddress.additionalInfo}\n`;
      }
    }
    
    message += `📞 *Móvil contacto:* ${selectedAddress.mobile}\n\n`;
    
    // Productos
    message += `📦 *PRODUCTOS:*\n`;
    cartFromContext.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Cantidad: ${item.qty}\n`;
      message += `   Precio: $${item.price} CUP c/u\n`;
      message += `   Subtotal: $${item.price * item.qty} CUP\n\n`;
    });
    
    // Resumen de precios
    message += `💵 *RESUMEN:*\n`;
    message += `Subtotal productos: $${totalAmountFromContext} CUP\n`;
    
    if (activeCoupon) {
      message += `Descuento (${activeCoupon.couponCode}): $${Math.abs(priceAfterCouponApplied)} CUP\n`;
    }
    
    if (deliveryCost > 0) {
      message += `Costo entrega: $${deliveryCost} CUP\n`;
    }
    
    message += `*TOTAL: $${finalPriceToPay} CUP*\n\n`;
    message += `⏰ Pedido realizado: ${new Date().toLocaleString('es-CU')}`;

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${STORE_WHATSAPP.replace(/\s+/g, '')}?text=${encodedMessage}`;
    
    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank');
    
    return orderNumber;
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toastHandler(ToastType.Error, 'Por favor selecciona una dirección');
      return;
    }

    try {
      const orderNumber = await sendToWhatsApp({
        orderNumber: generateOrderNumber(),
        customer: { firstName, lastName, email },
        address: selectedAddress,
        products: cartFromContext,
        pricing: {
          subtotal: totalAmountFromContext,
          deliveryCost,
          coupon: activeCoupon,
          total: finalPriceToPay
        }
      });

      await clearCartDispatch();
      updateCheckoutStatus({ showSuccessMsg: true });

      Popper();
      toastHandler(ToastType.Success, `Pedido #${orderNumber} enviado exitosamente`);

      timer.current = setTimeout(() => {
        updateCheckoutStatus({ showSuccessMsg: false });
        navigate('/');
      }, 3000);

    } catch (error) {
      console.error('Error al procesar el pedido:', error);
      toastHandler(ToastType.Error, 'Error al procesar el pedido');
    }
  };

  return (
    <article className={styles.checkout}>
      <h3 className='text-center'>Detalles del Precio</h3>

      <CouponSearch
        activeCoupon={activeCoupon}
        updateActiveCoupon={updateActiveCoupon}
      />

      <hr />

      <div className={styles.row}>
        <span>
          Precio ({totalCountFromContext} artículo{totalCountFromContext > 1 && 's'})
        </span>
        <Price amount={totalAmountFromContext} />
      </div>

      {activeCoupon && (
        <div className={styles.row}>
          <div className={styles.couponApplied}>
            <VscChromeClose
              type='button'
              className={styles.closeBtn}
              onClick={cancelCoupon}
            />{' '}
            <p className={styles.couponText}>
              Cupón {activeCoupon.couponCode} aplicado
            </p>
          </div>
          <Price amount={priceAfterCouponApplied} />
        </div>
      )}

      <div className={styles.row}>
        <span>
          {selectedAddress?.serviceType === SERVICE_TYPES.HOME_DELIVERY 
            ? `Entrega a domicilio` 
            : 'Gastos de Envío'
          }
        </span>
        <Price amount={deliveryCost} />
      </div>

      <hr />

      <div className={`${styles.row} ${styles.totalPrice}`}>
        <span>Precio Total</span>
        <Price amount={finalPriceToPay} />
      </div>

      <button onClick={handlePlaceOrder} className='btn btn-width-100'>
        Realizar Pedido por WhatsApp
      </button>
    </article>
  );
};

export default CheckoutDetails;
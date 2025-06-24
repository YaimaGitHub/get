import { useAllProductsContext } from '../../contexts/ProductsContextProvider';
import Price from '../Price';
import styles from './CheckoutDetails.module.css';
import { useState } from 'react';
import { VscChromeClose } from 'react-icons/vsc';

import { CHARGE_AND_DISCOUNT, ToastType } from '../../constants/constants';
import CouponSearch from './CouponSearch';
import { toastHandler, Popper } from '../../utils/utils';

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
    // addOrderDispatch,
  } = useAllProductsContext();

  const {
    user: { firstName, lastName, email },
  } = useAuthContext();
  const navigate = useNavigate();
  const [activeCoupon, setActiveCoupon] = useState(null);

  const priceAfterCouponApplied = activeCoupon
    ? -Math.floor((totalAmountFromContext * activeCoupon.discountPercent) / 100)
    : 0;

  const finalPriceToPay =
    totalAmountFromContext +
    CHARGE_AND_DISCOUNT.deliveryCharge +
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

  const loadScript = async (url) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = url;

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    try {
      const res = await loadScript(
        'https://checkout.razorpay.com/v1/checkout.js'
      );

      if (!res) {
        toastHandler(
          ToastType.Error,
          'Error al cargar Razorpay SDK, verifica tu conexión'
        );
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: finalPriceToPay * 100,
        currency: 'INR',
        name: 'Gada Electronics',
        description: 'Gracias por comprar con nosotros',
        image:
          'https://res.cloudinary.com/dtbd1y4en/image/upload/v1685641105/apple-touch-icon_edbdny.png',

        handler: async (response) => {
          const tempObj = {
            products: [...cartFromContext],
            amount: finalPriceToPay,
            paymentId: response.razorpay_payment_id,
          };

          await clearCartDispatch();
          updateCheckoutStatus({ showSuccessMsg: true });

          Popper();
          toastHandler(ToastType.Success, 'Pago exitoso');

          timer.current = setTimeout(() => {
            updateCheckoutStatus({ showSuccessMsg: false });
            navigate('/');
          }, 3000);
        },
        prefill: {
          name: `${firstName} ${lastName}`,
          email: email,
          contact: '9082931945',
        },
        theme: {
          color: 'var(--primary-500)',
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.log(error);
    }
  };

  const handlePlaceOrder = () => {
    const addressToDeliver = addressListFromContext.find(
      ({ addressId }) => addressId === activeAddressIdFromProps
    );

    if (!addressToDeliver) {
      toastHandler(ToastType.Error, 'Por favor selecciona una dirección');
      return;
    }

    displayRazorpay();
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

      <div className={styles.row}>
        <span>Descuento</span>
        <Price amount={CHARGE_AND_DISCOUNT.discount} />
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
        <span>Gastos de Envío</span>
        <Price amount={CHARGE_AND_DISCOUNT.deliveryCharge} />
      </div>

      <hr />

      <div className={`${styles.row} ${styles.totalPrice}`}>
        <span>Precio Total</span>
        <Price amount={finalPriceToPay} />
      </div>

      <button onClick={handlePlaceOrder} className='btn btn-width-100'>
        Realizar Pedido
      </button>
    </article>
  );
};

export default CheckoutDetails;
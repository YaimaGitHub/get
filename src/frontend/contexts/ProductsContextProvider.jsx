import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { toastHandler, wait } from '../utils/utils';
import {
  deleteCartDataService,
  deleteFromCartService,
  deleteFromWishlistService,
  deleteWishlistDataService,
  incDecItemInCartService,
  postAddToCartService,
  postAddToWishlistService,
} from '../Services/services';

import { productsReducer } from '../reducers';
import { PRODUCTS_ACTION } from '../utils/actions';
import { ToastType, DELAY_TO_SHOW_LOADER } from '../constants/constants';
import { useAuthContext } from './AuthContextProvider';
import { useConfigContext } from './ConfigContextProvider';
import { initialProductsState } from '../reducers/productsReducer';

const ProductsContext = createContext(null);

export const useAllProductsContext = () => useContext(ProductsContext);

const ProductsContextProvider = ({ children }) => {
  const [productsState, dispatch] = useReducer(
    productsReducer,
    initialProductsState
  );

  const { user, token: tokenFromContext } = useAuthContext();
  const { storeConfig, configError } = useConfigContext();

  // fns
  const showMainPageLoader = () => {
    dispatch({ type: PRODUCTS_ACTION.SHOW_LOADER });
  };

  const hideMainPageLoader = () => {
    dispatch({ type: PRODUCTS_ACTION.HIDE_LOADER });
  };

  const timedMainPageLoader = async () => {
    showMainPageLoader();
    await wait(DELAY_TO_SHOW_LOADER);
    hideMainPageLoader();
  };

  const updateCart = (cartList) => {
    dispatch({
      type: PRODUCTS_ACTION.UPDATE_CART,
      payload: { cart: cartList },
    });
  };

  const updateWishlist = (wishlistUpdated) => {
    dispatch({
      type: PRODUCTS_ACTION.UPDATE_WISHLIST,
      payload: { wishlist: wishlistUpdated },
    });
  };

  const clearCartInContext = () => {
    updateCart([]);
  };

  const clearWishlistInContext = () => {
    updateWishlist([]);
  };

  // Cargar productos y categorías EXCLUSIVAMENTE desde la configuración JSON
  const fetchAllProductsAndCategories = useCallback(async () => {
    dispatch({ type: PRODUCTS_ACTION.GET_ALL_PRODUCTS_BEGIN });
    await wait(DELAY_TO_SHOW_LOADER);

    try {
      // CRÍTICO: Solo funciona si hay configuración JSON válida
      if (!storeConfig || !storeConfig.storeInfo) {
        throw new Error('No se puede cargar la tienda sin configuración JSON válida');
      }

      // Obtener datos EXCLUSIVAMENTE desde la configuración JSON
      const products = storeConfig.products || [];
      const categories = storeConfig.categories || [];

      // Validar que hay datos mínimos para que la tienda funcione
      if (products.length === 0) {
        console.warn('⚠️ No hay productos en la configuración JSON');
      }

      if (categories.length === 0) {
        console.warn('⚠️ No hay categorías en la configuración JSON');
      }

      dispatch({
        type: PRODUCTS_ACTION.GET_ALL_PRODUCTS_FULFILLED,
        payload: { products, categories },
      });

      console.log('✅ Productos y categorías cargados desde JSON:', { 
        productos: products.length, 
        categorías: categories.length 
      });

    } catch (error) {
      console.error('❌ Error crítico al cargar desde JSON:', error);
      dispatch({ type: PRODUCTS_ACTION.GET_ALL_PRODUCTS_REJECTED });
      
      // Si falla la carga desde JSON, la tienda NO puede funcionar
      toastHandler(ToastType.Error, 'Error crítico: La tienda requiere configuración JSON válida');
    }
  }, [storeConfig]);

  // useEffects
  useEffect(() => {
    // Solo cargar si tenemos configuración JSON válida y sin errores
    if (storeConfig && storeConfig.storeInfo && !configError) {
      fetchAllProductsAndCategories();
    } else if (configError) {
      // Si hay error de configuración, mostrar error y no cargar nada
      dispatch({ type: PRODUCTS_ACTION.GET_ALL_PRODUCTS_REJECTED });
      console.error('❌ No se puede cargar la tienda debido a error de configuración JSON');
    }
  }, [storeConfig, configError, fetchAllProductsAndCategories]);

  useEffect(() => {
    if (!user) return;

    updateCart(user.cart);
    updateWishlist(user.wishlist);
  }, [user]);

  // Verificar que la tienda puede funcionar
  const canStoreOperate = () => {
    return storeConfig && storeConfig.storeInfo && !configError;
  };

  // fns to get data from services and update state
  const addToCartDispatch = async (productToAdd) => {
    if (!canStoreOperate()) {
      toastHandler(ToastType.Error, 'La tienda no puede funcionar sin configuración JSON');
      return;
    }

    try {
      const cart = await postAddToCartService(productToAdd, tokenFromContext);
      updateCart(cart);
      toastHandler(ToastType.Success, 'Successfully Added To Cart');
    } catch (error) {
      console.log(error.response);
    }
  };

  const addToWishlistDispatch = async (productToAdd) => {
    if (!canStoreOperate()) {
      toastHandler(ToastType.Error, 'La tienda no puede funcionar sin configuración JSON');
      return;
    }

    try {
      const wishlist = await postAddToWishlistService(
        productToAdd,
        tokenFromContext
      );

      updateWishlist(wishlist);

      toastHandler(ToastType.Success, 'Successfully Added To Wishlist');
    } catch (error) {
      console.log(error.response);
    }
  };

  const removeFromCartDispatch = async (productId) => {
    try {
      const cart = await deleteFromCartService(productId, tokenFromContext);

      updateCart(cart);
      toastHandler(ToastType.Warn, 'Removed From Cart successfully');
    } catch (error) {
      console.log(error.response);
    }
  };

  const removeFromWishlistDispatch = async (productId) => {
    try {
      const wishlist = await deleteFromWishlistService(
        productId,
        tokenFromContext
      );

      updateWishlist(wishlist);
      toastHandler(ToastType.Warn, 'Removed From Wishlist successfully');
    } catch (error) {
      console.log(error.response);
    }
  };

  const clearWishlistDispatch = async () => {
    showMainPageLoader();
    try {
      const wishlist = await deleteWishlistDataService(tokenFromContext);

      updateWishlist(wishlist);
      hideMainPageLoader();
    } catch (error) {
      console.log(error.response);
      hideMainPageLoader();
    }
  };

  const clearCartDispatch = async () => {
    showMainPageLoader();
    try {
      const cart = await deleteCartDataService(tokenFromContext);

      updateCart(cart);

      hideMainPageLoader();
    } catch (error) {
      console.log(error.response);
      hideMainPageLoader();
    }
  };

  const moveToWishlistDispatch = async (product) => {
    try {
      const [wishlist, cart] = await Promise.all([
        postAddToWishlistService(product, tokenFromContext),
        deleteFromCartService(product._id, tokenFromContext),
      ]);

      updateCart(cart);
      updateWishlist(wishlist);
      toastHandler(ToastType.Success, 'Moved to Wishlist successfully');
    } catch (error) {
      console.log(error.response);
    }
  };

  const moveToCartDispatch = async (product) => {
    // this will be called from the wishlist page
    try {
      const [cart, wishlist] = await Promise.all([
        postAddToCartService(product, tokenFromContext),
        deleteFromWishlistService(product._id, tokenFromContext),
      ]);

      updateCart(cart);
      updateWishlist(wishlist);
      toastHandler(ToastType.Success, 'Moved to Cart successfully');
    } catch (error) {
      console.log(error.response);
    }
  };

  const addOrRemoveQuantityInCart = async ({ productId, type, colorBody }) => {
    try {
      const cart = await incDecItemInCartService({
        productId,
        type,
        token: tokenFromContext,
        colorBody,
      });

      updateCart(cart);
    } catch (error) {
      console.log(error.response);
    }
  };

  // address

  const addAddressDispatch = (addressObj) => {
    toastHandler(ToastType.Success, 'Added Address Successfully');
    dispatch({
      type: PRODUCTS_ACTION.ADD_ADDRESS,
      payload: {
        address: addressObj,
      },
    });
  };

  const editAddressDispatch = (addressObj) => {
    toastHandler(ToastType.Success, 'Updated Address Successfully');
    dispatch({
      type: PRODUCTS_ACTION.EDIT_ADDRESS,
      payload: {
        address: addressObj,
      },
    });
  };

  const deleteAddressDispatch = (addressId) => {
    toastHandler(ToastType.Success, 'Deleted Address Successfully');
    dispatch({
      type: PRODUCTS_ACTION.DELETE_ADDRESS,
      payloadId: addressId,
    });
  };

  const deleteAllAddressDispatch = async () => {
    await timedMainPageLoader();
    toastHandler(ToastType.Success, 'Deleted All Address Successfully');
    dispatch({
      type: PRODUCTS_ACTION.DELETE_ALL_ADDRESS,
    });
  };

  const clearAddressInContext = () => {
    dispatch({
      type: PRODUCTS_ACTION.DELETE_ALL_ADDRESS,
    });
  };

  return (
    <ProductsContext.Provider
      value={{
        ...productsState,
        isMainPageLoading: productsState.isDataLoading,
        canStoreOperate,
        showMainPageLoader,
        hideMainPageLoader,
        timedMainPageLoader,
        addToCartDispatch,
        addToWishlistDispatch,
        removeFromWishlistDispatch,
        clearWishlistDispatch,
        clearCartDispatch,
        moveToCartDispatch,
        moveToWishlistDispatch,
        removeFromCartDispatch,
        addOrRemoveQuantityInCart,
        addAddressDispatch,
        editAddressDispatch,
        deleteAddressDispatch,
        deleteAllAddressDispatch,
        clearCartInContext,
        clearWishlistInContext,
        clearAddressInContext,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductsContextProvider;
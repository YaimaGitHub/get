import axios from 'axios';

export const loginUserService = async (userData) => {
  const response = await axios.post('/api/auth/login', {
    // email, password
    ...userData,
  });

  if (response.status === 200 || response.status === 201) {
    const { encodedToken, foundUser } = response.data;

    return {
      user: foundUser,
      token: encodedToken,
    };
  }
};

export const signupService = async (userData) => {
  const response = await axios.post('/api/auth/signup', {
    // email, password, firstName, lastName
    ...userData,
  });

  if (response.status === 200 || response.status === 201) {
    const { encodedToken, createdUser } = response.data;

    return {
      user: createdUser,
      token: encodedToken,
    };
  }
};

// Función para cargar configuración desde JSON
export const loadConfigurationFromJSON = async () => {
  try {
    const response = await fetch('/gada-electronics-config-2025-06-28.json');
    const config = await response.json();
    return config;
  } catch (error) {
    console.error('Error al cargar configuración desde JSON:', error);
    throw error;
  }
};

// Función para obtener productos y categorías desde la configuración JSON
export const getAllProductsCategoriesFromConfig = async () => {
  try {
    const config = await loadConfigurationFromJSON();
    return {
      products: config.products || [],
      categories: config.categories || []
    };
  } catch (error) {
    console.error('Error al obtener productos y categorías desde configuración:', error);
    // Fallback a la API original si falla la configuración JSON
    return getAllProductsCategoriesService();
  }
};

// Función original mantenida como fallback
export const getAllProductsCategoriesService = async () => {
  const productsPromise = axios.get('/api/products');
  const categoriesPromise = axios.get('/api/categories');

  const [productsResponse, categoriesResponse] = await Promise.all([
    productsPromise,
    categoriesPromise,
  ]);
  
  const { products } = productsResponse.data;
  const { categories } = categoriesResponse.data;

  return { products, categories };
};

export const getProductsOnSearch = async ({ query }) => {
  const res = await axios.get(`/api/products/search?query=${query}`);

  return res.data.products.models;
};

export const getSingleProductService = async (productID) => {
  try {
    // Primero intentar obtener desde la configuración JSON
    const config = await loadConfigurationFromJSON();
    const product = config.products?.find(p => p._id === productID);
    
    if (product) {
      return product;
    }
    
    // Fallback a la API original
    const {
      status,
      data: { product: apiProduct },
    } = await axios.get(`/api/products/${productID}`);

    if (!apiProduct) {
      throw new Error('Error: Product not found!');
    }

    if (status === 200 || status === 201) {
      return apiProduct;
    }
  } catch (error) {
    console.error('Error al obtener producto:', error);
    throw error;
  }
};

export const postAddToCartService = async (productToAdd, token) => {
  const response = await axios.post(
    '/api/user/cart',
    { product: productToAdd },
    { headers: { authorization: token } }
  );

  const { cart } = response.data;
  const { status } = response;
  if (status === 200 || status === 201) {
    return cart;
  }
};

export const deleteFromCartService = async (productId, token) => {
  const response = await axios.delete(`/api/user/cart/${productId}`, {
    headers: { authorization: token },
  });

  const { cart } = response.data;
  const { status } = response;
  if (status === 200 || status === 201) {
    return cart;
  }
};

export const incDecItemInCartService = async ({
  productId,
  token,
  type,
  colorBody,
}) => {
  const response = await axios.post(
    `/api/user/cart/${productId}`,
    {
      action: { type, colorBody },
    },
    { headers: { authorization: token } }
  );

  const { cart } = response.data;
  const { status } = response;
  if (status === 200 || status === 201) {
    return cart;
  }
};

export const postAddToWishlistService = async (productToAdd, token) => {
  const response = await axios.post(
    '/api/user/wishlist',
    { product: productToAdd },
    { headers: { authorization: token } }
  );
  const { wishlist } = response.data;
  const { status } = response;
  if (status === 200 || status === 201) {
    return wishlist;
  }
};

export const deleteFromWishlistService = async (productId, token) => {
  const response = await axios.delete(`/api/user/wishlist/${productId}`, {
    headers: { authorization: token },
  });

  const { wishlist } = response.data;
  const { status } = response;
  if (status === 200 || status === 201) {
    return wishlist;
  }
};

export const deleteCartDataService = async (token) => {
  const response = await axios.delete('/api/user/cart', {
    headers: { authorization: token },
  });

  const { cart } = response.data;
  const { status } = response;
  if (status === 200 || status === 201) {
    return cart;
  }
};

export const deleteWishlistDataService = async (token) => {
  const response = await axios.delete('/api/user/wishlist', {
    headers: { authorization: token },
  });

  const { wishlist } = response.data;
  const { status } = response;
  if (status === 200 || status === 201) {
    return wishlist;
  }
};
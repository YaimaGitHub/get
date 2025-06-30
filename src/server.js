import { Server, Model, RestSerializer } from 'miragejs';
import {
  loginHandler,
  signupHandler,
} from './backend/controllers/AuthController';
import {
  addItemToCartHandler,
  getCartItemsHandler,
  removeCartHandler,
  removeItemFromCartHandler,
  updateCartItemHandler,
} from './backend/controllers/CartController';
import {
  getAllCategoriesHandler,
  getCategoryHandler,
} from './backend/controllers/CategoryController';
import {
  getAllProductsHandler,
  getProductHandler,
  searchProductsHandler,
} from './backend/controllers/ProductController';
import {
  addItemToWishlistHandler,
  getWishlistItemsHandler,
  removeItemFromWishlistHandler,
  removeWishlistHandler,
} from './backend/controllers/WishlistController';
import { categories } from './backend/db/categories';
import { products } from './backend/db/products';
import { users } from './backend/db/users';

// Configuración dinámica que se actualiza desde el panel de administración
let dynamicConfigData = {
  storeInfo: {
    storeName: 'Gada Electronics',
    whatsappNumber: '+53 54690878',
    storeAddressId: 'store-main-address',
  },
  coupons: [],
  zones: [
    { id: 'nuevo_vista_alegre', name: 'Nuevo vista alegre', cost: 100 }
  ],
  products: products,
  categories: categories,
  sourceCode: {
    backend: {},
    frontend: {},
    lastScanned: null,
    totalFiles: 0
  },
  lastModified: new Date().toISOString(),
  version: '1.0.0'
};

// Función para actualizar la configuración dinámica
export const updateDynamicConfig = (newConfig) => {
  dynamicConfigData = {
    ...newConfig,
    lastModified: new Date().toISOString()
  };
  console.log('✅ Configuración dinámica actualizada:', dynamicConfigData);
};

export function makeServer({ environment = 'development' } = {}) {
  return new Server({
    serializers: {
      application: RestSerializer,
    },
    environment,
    models: {
      product: Model,
      category: Model,
      user: Model,
      cart: Model,
      wishlist: Model,
    },

    // Runs on the start of the server
    seeds(server) {
      // disballing console logs from Mirage
      server.logging = false;
      
      // Usar productos desde configuración dinámica
      (dynamicConfigData.products || products).forEach((item) => {
        server.create('product', { ...item });
      });

      users.forEach((item) =>
        server.create('user', { ...item, cart: [], wishlist: [] })
      );

      // Usar categorías desde configuración dinámica
      (dynamicConfigData.categories || categories).forEach((item) => 
        server.create('category', { ...item })
      );
    },

    routes() {
      this.namespace = 'api';
      
      // auth routes (public)
      this.post('/auth/signup', signupHandler.bind(this));
      this.post('/auth/login', loginHandler.bind(this));

      // products routes (public)
      this.get('/products', getAllProductsHandler.bind(this));
      this.get('/products/:productId', getProductHandler.bind(this));
      this.get('/products/search', searchProductsHandler.bind(this));

      // categories routes (public)
      this.get('/categories', getAllCategoriesHandler.bind(this));
      this.get('/categories/:categoryId', getCategoryHandler.bind(this));

      // cart routes (private)
      this.get('/user/cart', getCartItemsHandler.bind(this));
      this.post('/user/cart', addItemToCartHandler.bind(this));
      this.post('/user/cart/:productId', updateCartItemHandler.bind(this));
      this.delete(
        '/user/cart/:productId',
        removeItemFromCartHandler.bind(this)
      );
      this.delete('/user/cart', removeCartHandler.bind(this));

      // wishlist routes (private)
      this.get('/user/wishlist', getWishlistItemsHandler.bind(this));
      this.post('/user/wishlist', addItemToWishlistHandler.bind(this));
      this.delete(
        '/user/wishlist/:productId',
        removeItemFromWishlistHandler.bind(this)
      );
      this.delete('/user/wishlist', removeWishlistHandler.bind(this));

      // Reset namespace to handle config file route
      this.namespace = '';
      
      // Configuration file route (public) - CRÍTICO para el funcionamiento
      this.get('/gada-electronics-config-2025-06-30.json', () => {
        console.log('📄 Sirviendo configuración JSON:', dynamicConfigData);
        return dynamicConfigData;
      });

      // Ruta para actualizar configuración (solo para desarrollo)
      this.post('/api/admin/update-config', (schema, request) => {
        try {
          const newConfig = JSON.parse(request.requestBody);
          updateDynamicConfig(newConfig);
          return { success: true, message: 'Configuración actualizada' };
        } catch (error) {
          return { success: false, error: error.message };
        }
      });
    },
  });
}
import { Response } from 'miragejs';
import { loadProductsFromConfig, searchProductsFromConfig, getProductFromConfig } from '../db/products';

/**
 * All the routes related to Product are present here.
 * These are Publicly accessible routes.
 * 
 * IMPORTANTE: Los controladores ahora cargan datos desde configuración JSON
 * */

/**
 * This handler handles gets all products from JSON configuration.
 * send GET Request at /api/products
 * */
export const getAllProductsHandler = async function () {
  try {
    const products = await loadProductsFromConfig();
    return new Response(200, {}, { products });
  } catch (error) {
    console.error('Error al cargar productos desde configuración:', error);
    return new Response(200, {}, { products: this.db.products });
  }
};

/**
 * This handler handles gets a single product from JSON configuration.
 * send GET Request at /api/user/products/:productId
 * */
export const getProductHandler = async function (schema, request) {
  const productId = request.params.productId;
  try {
    // Intentar cargar desde configuración JSON primero
    const product = await getProductFromConfig(productId);
    
    if (product) {
      return new Response(200, {}, { product });
    }
    
    // Fallback a la base de datos de Mirage
    const fallbackProduct = schema.products.findBy({ _id: productId });
    return new Response(200, {}, { product: fallbackProduct });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    return new Response(
      500,
      {},
      {
        error: 'Error al obtener el producto',
      }
    );
  }
};

/**
 * This handler handles product search from JSON configuration.
 * send GET Request at /api/products/search?query=searchTerm
 * */
export const searchProductsHandler = async function (schema, request) {
  const query = request.queryParams.query;

  try {
    // Buscar en configuración JSON primero
    const products = await searchProductsFromConfig(query);
    
    if (products && products.length > 0) {
      return new Response(200, {}, { products: { models: products } });
    }
    
    // Fallback a búsqueda en Mirage
    let fallbackProducts = schema.products.where((product) =>
      product.name.toLowerCase().startsWith(query.toLowerCase())
    );

    if (fallbackProducts.length < 10) {
      fallbackProducts = schema.products.where((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    const limitedProducts =
      fallbackProducts.length > 10 ? fallbackProducts.slice(0, 10) : fallbackProducts;

    return new Response(200, {}, { products: { models: limitedProducts } });
  } catch (error) {
    console.error('Error en búsqueda de productos:', error);
    return new Response(
      500,
      {},
      {
        error: 'Error en la búsqueda de productos',
      }
    );
  }
};
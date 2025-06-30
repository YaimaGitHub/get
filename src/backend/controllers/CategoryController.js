import { Response } from "miragejs";
import { loadCategoriesFromConfig, getCategoryFromConfig, getActiveCategoriesFromConfig } from '../db/categories';

/**
 * All the routes related to Category are present here.
 * These are Publicly accessible routes.
 * 
 * IMPORTANTE: Los controladores ahora cargan datos desde configuración JSON
 * */

/**
 * This handler handles gets all categories from JSON configuration.
 * send GET Request at /api/categories
 * */
export const getAllCategoriesHandler = async function () {
  try {
    // Cargar categorías activas desde configuración JSON
    const categories = await getActiveCategoriesFromConfig();
    return new Response(200, {}, { categories });
  } catch (error) {
    console.error('Error al cargar categorías desde configuración:', error);
    // Fallback a la base de datos de Mirage
    return new Response(200, {}, { categories: this.db.categories });
  }
};

/**
 * This handler handles gets a single category from JSON configuration.
 * send GET Request at /api/user/category/:categoryId
 * */
export const getCategoryHandler = async function (schema, request) {
  const categoryId = request.params.categoryId;
  try {
    // Intentar cargar desde configuración JSON primero
    const category = await getCategoryFromConfig(categoryId);
    
    if (category) {
      return new Response(200, {}, { category });
    }
    
    // Fallback a la base de datos de Mirage
    const fallbackCategory = schema.categories.findBy({ _id: categoryId });
    return new Response(200, {}, { category: fallbackCategory });
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    return new Response(
      500,
      {},
      {
        error: 'Error al obtener la categoría',
      }
    );
  }
};
/**
 * Category Database - CONFIGURACIÓN DINÁMICA DESDE JSON
 * 
 * IMPORTANTE: Esta base de datos se carga dinámicamente desde el archivo JSON de configuración.
 * Las categorías aquí definidas son solo un fallback en caso de que falle la carga desde JSON.
 * 
 * La configuración real de categorías se obtiene desde:
 * - Archivo JSON de configuración exportado/importado
 * - Panel de administración que modifica el JSON
 * - Sistema de configuración centralizado
 */

// Categorías de fallback (se usan solo si falla la carga desde JSON)
export const categories = [
  {
    _id: '35abdf47-0dae-40fc-b201-a981e9daa3d4',
    categoryName: 'laptop',
    categoryImage:
      'https://res.cloudinary.com/dtbd1y4en/image/upload/v1683908106/redmi-book-15_ksizgp.jpg',
    description: '',
  },
  {
    _id: 'fab4d8a9-84cd-49bb-9479-ff73e5bcf0fc',
    categoryName: 'tv',
    categoryImage:
      'https://res.cloudinary.com/dtbd1y4en/image/upload/v1683918874/oneplus-55U1S_pl3nko.jpg',
    description: '',
  },
  {
    _id: 'a9c05f11-bb6a-4501-9390-3201ed9f9448',
    categoryName: 'smartwatch',
    categoryImage:
      'https://res.cloudinary.com/dtbd1y4en/image/upload/v1683911006/apple-watch-ultra_ony1kc.jpg',
    description: '',
  },
  {
    _id: 'a71bd701-eca8-41a8-a385-e1ec91a03697',
    categoryName: 'earphone',
    categoryImage:
      'https://res.cloudinary.com/dtbd1y4en/image/upload/v1683955385/oneplus-nord-buds_b9yphw.jpg',
    description: '',
  },
  {
    _id: '16080c75-5573-4626-9b89-37c670907c02',
    categoryName: 'mobile',
    categoryImage:
      'https://res.cloudinary.com/dtbd1y4en/image/upload/v1683957585/oneplus-nord-CE-3-lite_weksou.jpg',
    description: '',
  },
];

/**
 * Función para cargar categorías desde configuración JSON
 * Esta función se usa en lugar de la exportación directa
 */
export const loadCategoriesFromConfig = async () => {
  try {
    const response = await fetch('/gada-electronics-config-2025-06-28.json');
    const config = await response.json();
    
    if (config.categories && config.categories.length > 0) {
      console.log('Categorías cargadas desde configuración JSON:', config.categories.length);
      return config.categories;
    }
    
    console.log('Usando categorías de fallback');
    return categories;
  } catch (error) {
    console.error('Error al cargar categorías desde JSON, usando fallback:', error);
    return categories;
  }
};

/**
 * Función para obtener una categoría específica desde configuración JSON
 */
export const getCategoryFromConfig = async (categoryId) => {
  try {
    const configCategories = await loadCategoriesFromConfig();
    return configCategories.find(category => category._id === categoryId);
  } catch (error) {
    console.error('Error al obtener categoría desde configuración:', error);
    return categories.find(category => category._id === categoryId);
  }
};

/**
 * Función para obtener categorías activas (no deshabilitadas)
 */
export const getActiveCategoriesFromConfig = async () => {
  try {
    const configCategories = await loadCategoriesFromConfig();
    return configCategories.filter(category => !category.disabled);
  } catch (error) {
    console.error('Error al obtener categorías activas:', error);
    return categories;
  }
};
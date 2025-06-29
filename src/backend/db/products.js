/**
 * Product Database - CONFIGURACIÓN DINÁMICA DESDE JSON
 * 
 * IMPORTANTE: Esta base de datos se carga dinámicamente desde el archivo JSON de configuración.
 * Los productos aquí definidos son solo un fallback en caso de que falle la carga desde JSON.
 * 
 * La configuración real de productos se obtiene desde:
 * - Archivo JSON de configuración exportado/importado
 * - Panel de administración que modifica el JSON
 * - Sistema de configuración centralizado
 */

// Productos de fallback (se usan solo si falla la carga desde JSON)
export const products = [
  {
    _id: '9eb0c25b-447c-4723-9ce4-639527debb68',
    name: 'mi book 15',
    price: 31990,
    originalPrice: 51999,
    image:
      'https://res.cloudinary.com/dtbd1y4en/image/upload/v1683908106/redmi-book-15_ksizgp.jpg',
    colors: [
      {
        color: '#0000ff',
        colorQuantity: 10,
      },
      {
        color: '#00ff00',
        colorQuantity: 6,
      },
      {
        color: '#ff0000',
        colorQuantity: 9,
      },
    ],
    company: 'redmi',
    description:
      'For this model, screen size is 39.62 cm and hard disk size is 256 GB. CPU Model\tCore is i3. RAM Memory Installed Size is 8 GB. Operating System is Windows 10 Home. Special Feature includes Anti Glare Screen, Light Weight, Thin. Graphics Card is Integrated',
    category: 'laptop',
    isShippingAvailable: true,
    stock: 25,
    reviewCount: 418,
    stars: 3.7,
  },
  {
    _id: 'eb7db2dd-231a-47f5-b803-4415c2150efa',
    name: 'mi notebook pro',
    price: 54499,
    originalPrice: 74999,
    image:
      'https://res.cloudinary.com/dtbd1y4en/image/upload/v1683908295/mi-notebook-pro_hi4vih.jpg',
    colors: [
      {
        color: '#00ff00',
        colorQuantity: 8,
      },
      {
        color: '#000',
        colorQuantity: 2,
      },
    ],
    company: 'redmi',
    description:
      'For this model, screen size is 14 Inches and hard disk size is 512 GB. CPU Model Core is i5. RAM Memory Installed Size is 16 GB. Operating System is Windows 11. Special Feature includes Fingerprint Reader, Backlit Keyboard. Graphics Card is Integrated',
    category: 'laptop',
    isShippingAvailable: false,
    stock: 10,
    reviewCount: 1805,
    stars: 4.3,
  },
  // ... resto de productos de fallback
];

/**
 * Función para cargar productos desde configuración JSON
 * Esta función se usa en lugar de la exportación directa
 */
export const loadProductsFromConfig = async () => {
  try {
    const response = await fetch('/gada-electronics-config-2025-06-28.json');
    const config = await response.json();
    
    if (config.products && config.products.length > 0) {
      console.log('Productos cargados desde configuración JSON:', config.products.length);
      return config.products;
    }
    
    console.log('Usando productos de fallback');
    return products;
  } catch (error) {
    console.error('Error al cargar productos desde JSON, usando fallback:', error);
    return products;
  }
};

/**
 * Función para obtener un producto específico desde configuración JSON
 */
export const getProductFromConfig = async (productId) => {
  try {
    const configProducts = await loadProductsFromConfig();
    return configProducts.find(product => product._id === productId);
  } catch (error) {
    console.error('Error al obtener producto desde configuración:', error);
    return products.find(product => product._id === productId);
  }
};

/**
 * Función para buscar productos desde configuración JSON
 */
export const searchProductsFromConfig = async (query) => {
  try {
    const configProducts = await loadProductsFromConfig();
    
    let filteredProducts = configProducts.filter(product =>
      product.name.toLowerCase().startsWith(query.toLowerCase())
    );

    if (filteredProducts.length < 10) {
      filteredProducts = configProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    return filteredProducts.length > 10 ? filteredProducts.slice(0, 10) : filteredProducts;
  } catch (error) {
    console.error('Error al buscar productos desde configuración:', error);
    // Fallback a búsqueda en productos estáticos
    let filteredProducts = products.filter(product =>
      product.name.toLowerCase().startsWith(query.toLowerCase())
    );

    if (filteredProducts.length < 10) {
      filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    return filteredProducts.length > 10 ? filteredProducts.slice(0, 10) : filteredProducts;
  }
};
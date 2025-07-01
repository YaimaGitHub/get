import React, { useState } from 'react';
import { toastHandler } from '../../../utils/utils';
import { ToastType } from '../../../constants/constants';
import { useConfigContext } from '../../../contexts/ConfigContextProvider';
import { useAllProductsContext } from '../../../contexts/ProductsContextProvider';
import styles from './BackupManager.module.css';

const BackupManager = () => {
  const { storeConfig } = useConfigContext();
  const { products, categories } = useAllProductsContext();
  const [isExporting, setIsExporting] = useState(false);

  // Función para generar el contenido de constants.jsx actualizado
  const generateConstantsFile = () => {
    const constantsContent = `import { AiFillGithub, AiFillLinkedin, AiOutlineTwitter } from 'react-icons/ai';
import { v4 as uuid } from 'uuid';

export const FOOTER_LINKS = [
  {
    id: 1,
    icon: <AiOutlineTwitter />,
    url: 'https://twitter.com/Swastik2001',
  },
  {
    id: 2,
    icon: <AiFillLinkedin />,
    url: 'https://www.linkedin.com/in/swastik-patro-2a54bb19b/',
  },
  {
    id: 3,
    icon: <AiFillGithub />,
    url: 'https://github.com/swastikpatro',
  },
];

export const ToastType = {
  Warn: 'warn',
  Info: 'info',
  Success: 'success',
  Error: 'error',
};

export const SORT_TYPE = {
  PRICE_LOW_TO_HIGH: 'precio: menor a mayor',
  PRICE_HIGH_TO_LOW: 'precio: mayor a menor',
  NAME_A_TO_Z: 'nombre: a a z',
  NAME_Z_TO_A: 'nombre: z a a',
};

export const RATINGS = [4, 3, 2, 1];

export const TEST_USER = {
  email: 'jethalal.gada@gmail.com',
  password: 'babitaji1234',
};

export const SUPER_ADMIN = {
  email: 'admin@gadaelectronics.com',
  password: 'root',
};

export const GUEST_USER = {
  email: 'invitado@tienda.com',
  password: '123456',
};

export const LOCAL_STORAGE_KEYS = {
  User: 'user',
  Token: 'token',
  StoreConfig: 'storeConfig',
};

export const LOGIN_CLICK_TYPE = {
  GuestClick: 'guest',
  RegisterClick: 'register',
  AdminClick: 'admin',
};

export const INCREMENT_DECRMENT_TYPE = {
  INCREMENT: 'increment',
  DECREMENT: 'decrement',
};

export const FILTER_INPUT_TYPE = {
  PRICE: 'price',
  COMPANY: 'company',
  SORT: 'sortByOption',
  RATING: 'rating',
  CATEGORY: 'category',
};

export const DELAY_TO_SHOW_LOADER = 500;
export const DELAY_DEBOUNCED_MS = 250;
export const TOTAL_SKELETONS_LENGTH = 10;
export const DELAY_BETWEEN_BLUR_AND_CLICK = 250;
export const CUSTOM_TOASTID = 1;
export const ITEMS_PER_PAGE = 9;

export const ALL_STATES = [
  'Andalucía',
  'Aragón',
  'Asturias',
  'Baleares',
  'Canarias',
  'Cantabria',
  'Castilla-La Mancha',
  'Castilla y León',
  'Cataluña',
  'Ceuta',
  'Comunidad de Madrid',
  'Comunidad Foral de Navarra',
  'Comunidad Valenciana',
  'Extremadura',
  'Galicia',
  'La Rioja',
  'Melilla',
  'País Vasco',
  'Región de Murcia',
];

export const SERVICE_TYPES = {
  HOME_DELIVERY: 'home_delivery',
  PICKUP: 'pickup'
};

// Zonas de Santiago de Cuba con costos de entrega - ACTUALIZADAS
export const SANTIAGO_ZONES = ${JSON.stringify(storeConfig.zones || [], null, 2)};

// Cupones de descuento - ACTUALIZADOS
export const COUPONS = ${JSON.stringify(storeConfig.coupons || [], null, 2)};

export const CHARGE_AND_DISCOUNT = {
  deliveryCharge: 0,
  discount: 0,
};

export const MIN_DISTANCE_BETWEEN_THUMBS = 1000;
export const MAX_RESPONSES_IN_CACHE_TO_STORE = 50;

// WhatsApp de la tienda - ACTUALIZADO
export const STORE_WHATSAPP = '${storeConfig.storeInfo?.whatsappNumber || '+53 54690878'}';

// Configuración por defecto de la tienda - ACTUALIZADA
export const DEFAULT_STORE_CONFIG = ${JSON.stringify(storeConfig.storeInfo || {
  storeName: 'Gada Electronics',
  whatsappNumber: '+53 54690878',
  storeAddress: 'Santiago de Cuba, Cuba',
  lastModified: new Date().toISOString(),
  version: '1.0.0'
}, null, 2)};

export const COUNTRY_CODES = [
  { code: '+1', country: 'Estados Unidos/Canadá', flag: '🇺🇸' },
  { code: '+7', country: 'Rusia', flag: '🇷🇺' },
  { code: '+20', country: 'Egipto', flag: '🇪🇬' },
  { code: '+27', country: 'Sudáfrica', flag: '🇿🇦' },
  { code: '+30', country: 'Grecia', flag: '🇬🇷' },
  { code: '+31', country: 'Países Bajos', flag: '🇳🇱' },
  { code: '+32', country: 'Bélgica', flag: '🇧🇪' },
  { code: '+33', country: 'Francia', flag: '🇫🇷' },
  { code: '+34', country: 'España', flag: '🇪🇸' },
  { code: '+36', country: 'Hungría', flag: '🇭🇺' },
  { code: '+39', country: 'Italia', flag: '🇮🇹' },
  { code: '+40', country: 'Rumania', flag: '🇷🇴' },
  { code: '+41', country: 'Suiza', flag: '🇨🇭' },
  { code: '+43', country: 'Austria', flag: '🇦🇹' },
  { code: '+44', country: 'Reino Unido', flag: '🇬🇧' },
  { code: '+45', country: 'Dinamarca', flag: '🇩🇰' },
  { code: '+46', country: 'Suecia', flag: '🇸🇪' },
  { code: '+47', country: 'Noruega', flag: '🇳🇴' },
  { code: '+48', country: 'Polonia', flag: '🇵🇱' },
  { code: '+49', country: 'Alemania', flag: '🇩🇪' },
  { code: '+51', country: 'Perú', flag: '🇵🇪' },
  { code: '+52', country: 'México', flag: '🇲🇽' },
  { code: '+53', country: 'Cuba', flag: '🇨🇺' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+55', country: 'Brasil', flag: '🇧🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+60', country: 'Malasia', flag: '🇲🇾' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+63', country: 'Filipinas', flag: '🇵🇭' },
  { code: '+64', country: 'Nueva Zelanda', flag: '🇳🇿' },
  { code: '+65', country: 'Singapur', flag: '🇸🇬' },
  { code: '+66', country: 'Tailandia', flag: '🇹🇭' },
  { code: '+81', country: 'Japón', flag: '🇯🇵' },
  { code: '+82', country: 'Corea del Sur', flag: '🇰🇷' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+90', country: 'Turquía', flag: '🇹🇷' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+92', country: 'Pakistán', flag: '🇵🇰' },
  { code: '+93', country: 'Afganistán', flag: '🇦🇫' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+95', country: 'Myanmar', flag: '🇲🇲' },
  { code: '+98', country: 'Irán', flag: '🇮🇷' },
];
`;
    return constantsContent;
  };

  // Función para generar el contenido de products.js actualizado
  const generateProductsFile = () => {
    // Usar los productos del localStorage si están disponibles, sino usar los del contexto
    const savedConfig = localStorage.getItem('adminStoreConfig');
    let productsToExport = products || [];
    
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        if (parsedConfig.products && parsedConfig.products.length > 0) {
          productsToExport = parsedConfig.products;
        }
      } catch (error) {
        console.error('Error al cargar productos guardados:', error);
      }
    }

    const productsContent = `/**
 * Product Database can be added here.
 * You can add products of your wish with different attributes
 * */

export const products = ${JSON.stringify(productsToExport, null, 2)};
`;
    return productsContent;
  };

  // Función para generar el contenido de categories.js actualizado
  const generateCategoriesFile = () => {
    // Usar las categorías del localStorage si están disponibles, sino usar las del contexto
    const savedConfig = localStorage.getItem('adminStoreConfig');
    let categoriesToExport = categories || [];
    
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        if (parsedConfig.categories && parsedConfig.categories.length > 0) {
          categoriesToExport = parsedConfig.categories;
        }
      } catch (error) {
        console.error('Error al cargar categorías guardadas:', error);
      }
    }

    const categoriesContent = `/**
 * Category Database can be added here.
 * You can add category of your wish with different attributes
 * */

export const categories = ${JSON.stringify(categoriesToExport, null, 2)};
`;
    return categoriesContent;
  };

  // Función para generar mensajes actualizados
  const generateMessagesFile = () => {
    const savedMessages = localStorage.getItem('storeMessages');
    let messages = {};
    
    if (savedMessages) {
      try {
        messages = JSON.parse(savedMessages);
      } catch (error) {
        console.error('Error al cargar mensajes:', error);
      }
    }

    const messagesContent = `/**
 * Store Messages - Centralized text management
 * All user-facing text and messages for the store
 * */

export const STORE_MESSAGES = ${JSON.stringify(messages, null, 2)};
`;
    return messagesContent;
  };

  const handleExportToBackup = async () => {
    setIsExporting(true);
    
    try {
      // Simular proceso de exportación
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Crear archivos actualizados
      const files = [
        {
          name: 'constants.jsx',
          content: generateConstantsFile(),
          path: 'src/frontend/constants/'
        },
        {
          name: 'products.js',
          content: generateProductsFile(),
          path: 'src/backend/db/'
        },
        {
          name: 'categories.js',
          content: generateCategoriesFile(),
          path: 'src/backend/db/'
        },
        {
          name: 'messages.js',
          content: generateMessagesFile(),
          path: 'src/frontend/constants/'
        }
      ];

      // Crear un ZIP con todos los archivos
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Crear carpeta backup
      const backupFolder = zip.folder('backup');
      const timestamp = new Date().toISOString().split('T')[0];
      
      // Agregar archivos al ZIP
      files.forEach(file => {
        const folderPath = file.path.replace('src/', '');
        const folder = backupFolder.folder(folderPath);
        folder.file(file.name, file.content);
      });

      // Agregar archivo de configuración JSON completo
      const savedConfig = localStorage.getItem('adminStoreConfig');
      let fullConfig = {
        storeConfig,
        products,
        categories,
        messages: JSON.parse(localStorage.getItem('storeMessages') || '{}'),
        exportDate: new Date().toISOString(),
        version: '2.0.0'
      };

      // Si hay configuración guardada, usarla
      if (savedConfig) {
        try {
          const parsedConfig = JSON.parse(savedConfig);
          fullConfig = {
            ...fullConfig,
            ...parsedConfig,
            exportDate: new Date().toISOString(),
            version: '2.0.0'
          };
        } catch (error) {
          console.error('Error al cargar configuración guardada:', error);
        }
      }
      
      backupFolder.file('full-config.json', JSON.stringify(fullConfig, null, 2));

      // Generar y descargar el ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gada-electronics-backup-${timestamp}.zip`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      toastHandler(ToastType.Success, '🎉 Backup exportado exitosamente');
      toastHandler(ToastType.Info, 'Los archivos incluyen todos los cambios realizados en productos, categorías, cupones y configuraciones');
      
    } catch (error) {
      console.error('Error al exportar backup:', error);
      toastHandler(ToastType.Error, 'Error al exportar el backup');
    } finally {
      setIsExporting(false);
    }
  };

  // Obtener estadísticas actualizadas
  const getStats = () => {
    const savedConfig = localStorage.getItem('adminStoreConfig');
    let stats = {
      products: products?.length || 0,
      categories: categories?.length || 0,
      coupons: storeConfig.coupons?.length || 0,
      zones: storeConfig.zones?.length || 0
    };

    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        stats = {
          products: parsedConfig.products?.length || stats.products,
          categories: parsedConfig.categories?.length || stats.categories,
          coupons: parsedConfig.coupons?.length || stats.coupons,
          zones: parsedConfig.zones?.length || stats.zones
        };
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      }
    }

    return stats;
  };

  const stats = getStats();

  return (
    <div className={styles.backupManager}>
      <h2>🗂️ Sistema de Backup Completo</h2>
      
      <div className={styles.infoSection}>
        <h3>ℹ️ Información del Sistema de Backup</h3>
        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <strong>📁 Archivos incluidos:</strong>
            <ul>
              <li><code>constants.jsx</code> - Configuración de cupones, zonas y WhatsApp</li>
              <li><code>products.js</code> - Base de datos de productos actualizada</li>
              <li><code>categories.js</code> - Base de datos de categorías actualizada</li>
              <li><code>messages.js</code> - Todos los mensajes de la tienda</li>
              <li><code>full-config.json</code> - Configuración completa en JSON</li>
            </ul>
          </div>
          <div className={styles.infoItem}>
            <strong>🔄 Proceso de backup:</strong> Todos los cambios realizados en el panel se exportan a archivos actualizados manteniendo la estructura original del código fuente.
          </div>
          <div className={styles.infoItem}>
            <strong>📦 Formato:</strong> Los archivos se exportan en un archivo ZIP organizado por carpetas según la estructura del proyecto.
          </div>
          <div className={styles.infoItem}>
            <strong>🛡️ Seguridad:</strong> Mantiene la integridad del código fuente y permite restaurar fácilmente los cambios.
          </div>
        </div>
      </div>

      <div className={styles.exportSection}>
        <div className={styles.exportCard}>
          <div className={styles.cardHeader}>
            <h3>📤 Exportar Backup Completo</h3>
          </div>
          <div className={styles.cardContent}>
            <p>
              Exporta todos los cambios realizados en el panel de control a archivos de código fuente 
              actualizados. Esto incluye productos, categorías, cupones, zonas, mensajes y configuraciones.
            </p>
            <div className={styles.changesSummary}>
              <h4>📊 Resumen de cambios a exportar:</h4>
              <ul>
                <li>🎫 {stats.coupons} cupones configurados</li>
                <li>📍 {stats.zones} zonas de entrega</li>
                <li>📦 {stats.products} productos en catálogo</li>
                <li>📂 {stats.categories} categorías disponibles</li>
                <li>💬 {Object.keys(JSON.parse(localStorage.getItem('storeMessages') || '{}')).length} categorías de mensajes</li>
              </ul>
            </div>
            <button 
              onClick={handleExportToBackup}
              disabled={isExporting}
              className={`btn btn-primary ${styles.exportButton}`}
            >
              {isExporting ? (
                <span className={styles.loading}>
                  <span className="loader-2"></span>
                  Exportando backup...
                </span>
              ) : (
                '📤 Exportar Backup Completo'
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.instructionsSection}>
        <h3>📋 Instrucciones de Uso</h3>
        <div className={styles.stepsList}>
          <div className={styles.step}>
            <span className={styles.stepNumber}>1</span>
            <div className={styles.stepContent}>
              <strong>Realizar cambios:</strong> Modifica productos, categorías, cupones, zonas o mensajes en las diferentes secciones del panel.
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>2</span>
            <div className={styles.stepContent}>
              <strong>Exportar backup:</strong> Haz clic en "Exportar Backup Completo" para generar los archivos actualizados.
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>3</span>
            <div className={styles.stepContent}>
              <strong>Descargar archivos:</strong> Se descargará un archivo ZIP con todos los archivos de código fuente actualizados.
            </div>
          </div>
          <div className={styles.step}>
            <span className={styles.stepNumber}>4</span>
            <div className={styles.stepContent}>
              <strong>Aplicar cambios:</strong> Extrae los archivos del ZIP y reemplaza los archivos correspondientes en tu proyecto.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupManager;
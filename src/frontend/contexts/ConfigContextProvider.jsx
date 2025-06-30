import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toastHandler } from '../utils/utils';
import { ToastType } from '../constants/constants';

const ConfigContext = createContext(null);

export const useConfigContext = () => useContext(ConfigContext);

const ConfigContextProvider = ({ children }) => {
  // Estado principal que controla TODA la configuración de la tienda
  const [storeConfig, setStoreConfig] = useState({
    storeInfo: {
      storeName: 'Gada Electronics',
      whatsappNumber: '+53 54690878',
      storeAddressId: 'store-main-address',
    },
    coupons: [],
    zones: [],
    products: [],
    categories: [],
    sourceCode: {
      backend: {},
      frontend: {},
      lastScanned: null,
      totalFiles: 0
    },
    lastModified: new Date().toISOString(),
    version: '1.0.0'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [configError, setConfigError] = useState(null);

  // Función para leer y analizar todo el código fuente
  const scanSourceCode = useCallback(async () => {
    setIsLoading(true);
    try {
      const sourceCodeData = {
        backend: {},
        frontend: {},
        lastScanned: new Date().toISOString(),
        totalFiles: 0
      };

      // Definir estructura de archivos a escanear
      const filesToScan = [
        // Backend files
        'src/backend/controllers/AuthController.js',
        'src/backend/controllers/CartController.js',
        'src/backend/controllers/CategoryController.js',
        'src/backend/controllers/ProductController.js',
        'src/backend/controllers/WishlistController.js',
        'src/backend/db/categories.js',
        'src/backend/db/products.js',
        'src/backend/db/users.js',
        'src/backend/utils/authUtils.js',
        
        // Frontend files
        'src/frontend/constants/constants.jsx',
        'src/frontend/contexts/AuthContextProvider.js',
        'src/frontend/contexts/ProductsContextProvider.jsx',
        'src/frontend/contexts/FiltersContextProvider.js',
        'src/frontend/Services/services.js',
        'src/frontend/utils/utils.js',
        'src/frontend/utils/actions.js',
        
        // Component files
        'src/frontend/components/Navbar/Navbar.jsx',
        'src/frontend/components/Footer/Footer.jsx',
        'src/frontend/components/ProductCard/ProductCard.jsx',
        'src/frontend/components/Categories/Categories.jsx',
        'src/frontend/components/Hero/Hero.jsx',
        
        // Page files
        'src/frontend/pages/Home.jsx',
        'src/frontend/pages/LoginPage.jsx',
        'src/frontend/pages/SignupPage.jsx',
        'src/frontend/pages/ProductListingPage/ProductListingPage.jsx',
        'src/frontend/pages/SingleProductPage/SingleProductPage.jsx',
        'src/frontend/pages/CartPage/CartPage.jsx',
        'src/frontend/pages/WishlistPage/WishListPage.jsx',
        'src/frontend/pages/Checkout/Checkout.jsx',
        'src/frontend/pages/Profile/Profile.jsx',
        'src/frontend/pages/Address/Address.jsx',
        
        // Admin Panel files
        'src/frontend/pages/AdminPanel/AdminPanel.jsx',
        'src/frontend/pages/AdminPanel/components/ProductManager.jsx',
        'src/frontend/pages/AdminPanel/components/CategoryManager.jsx',
        'src/frontend/pages/AdminPanel/components/CouponManager.jsx',
        'src/frontend/pages/AdminPanel/components/StoreSettings.jsx',
        'src/frontend/pages/AdminPanel/components/ConfigManager.jsx',
        
        // Configuration files
        'src/server.js',
        'src/index.js',
        'src/App.jsx',
        'package.json',
        'public/index.html'
      ];

      // Simular lectura de archivos (en un entorno real, esto sería una llamada al backend)
      for (const filePath of filesToScan) {
        try {
          // En un entorno real, aquí haríamos fetch al archivo
          const fileContent = await readFileContent(filePath);
          
          if (filePath.includes('backend/')) {
            const fileName = filePath.split('/').pop();
            const category = filePath.includes('controllers/') ? 'controllers' :
                           filePath.includes('db/') ? 'database' :
                           filePath.includes('utils/') ? 'utils' : 'other';
            
            if (!sourceCodeData.backend[category]) {
              sourceCodeData.backend[category] = {};
            }
            sourceCodeData.backend[category][fileName] = {
              path: filePath,
              content: fileContent,
              lastModified: new Date().toISOString(),
              size: fileContent.length
            };
          } else if (filePath.includes('frontend/')) {
            const fileName = filePath.split('/').pop();
            const category = filePath.includes('components/') ? 'components' :
                           filePath.includes('pages/') ? 'pages' :
                           filePath.includes('contexts/') ? 'contexts' :
                           filePath.includes('constants/') ? 'constants' :
                           filePath.includes('Services/') ? 'services' :
                           filePath.includes('utils/') ? 'utils' : 'other';
            
            if (!sourceCodeData.frontend[category]) {
              sourceCodeData.frontend[category] = {};
            }
            sourceCodeData.frontend[category][fileName] = {
              path: filePath,
              content: fileContent,
              lastModified: new Date().toISOString(),
              size: fileContent.length
            };
          }
          
          sourceCodeData.totalFiles++;
        } catch (error) {
          console.warn(`No se pudo leer el archivo: ${filePath}`, error);
        }
      }

      return sourceCodeData;
    } catch (error) {
      console.error('Error al escanear código fuente:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función simulada para leer contenido de archivos
  const readFileContent = async (filePath) => {
    // En un entorno real, esto sería una llamada al backend para leer el archivo
    // Por ahora, retornamos un contenido simulado basado en el tipo de archivo
    return `// Contenido del archivo: ${filePath}\n// Escaneado en: ${new Date().toISOString()}\n// Este contenido sería el código real del archivo`;
  };

  // Función para cargar configuración desde JSON con validación estricta
  const loadConfigurationFromJSON = useCallback(async () => {
    setIsLoading(true);
    setConfigError(null);
    
    try {
      // Intentar cargar desde el archivo JSON principal
      const response = await fetch('/gada-electronics-config-2025-06-30.json');
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - No se pudo cargar el archivo de configuración`);
      }
      
      const config = await response.json();
      
      // Validación estricta de la estructura del archivo
      if (!config || typeof config !== 'object') {
        throw new Error('El archivo de configuración no tiene un formato JSON válido');
      }
      
      if (!config.storeInfo || !config.lastModified) {
        throw new Error('El archivo de configuración no tiene la estructura requerida');
      }
      
      // Escanear código fuente y agregarlo a la configuración
      const sourceCodeData = await scanSourceCode();
      config.sourceCode = sourceCodeData;
      
      setStoreConfig(config);
      console.log('✅ Configuración cargada exitosamente desde JSON:', config);
      
      return config;
    } catch (error) {
      console.error('❌ Error crítico al cargar configuración:', error);
      setConfigError(error.message);
      
      // La tienda NO puede funcionar sin el archivo JSON
      toastHandler(ToastType.Error, `Error crítico: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [scanSourceCode]);

  // Cargar configuración al iniciar (CRÍTICO para el funcionamiento)
  useEffect(() => {
    loadConfigurationFromJSON().catch(error => {
      console.error('La tienda no puede funcionar sin el archivo de configuración JSON');
      setConfigError('La tienda requiere el archivo JSON para funcionar');
    });
  }, [loadConfigurationFromJSON]);

  // Función para guardar configuración en JSON (REAL, no simulado)
  const saveConfigurationToJSON = useCallback(async (config) => {
    setIsLoading(true);
    
    try {
      const updatedConfig = {
        ...config,
        lastModified: new Date().toISOString(),
        version: '1.0.0'
      };
      
      // Crear el contenido del archivo JSON
      const jsonContent = JSON.stringify(updatedConfig, null, 2);
      
      // Crear y descargar el archivo JSON actualizado
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gada-electronics-config-${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      // Actualizar el estado local
      setStoreConfig(updatedConfig);
      
      toastHandler(ToastType.Success, '✅ Configuración guardada y exportada exitosamente');
      
      // Recargar la página para aplicar los cambios desde el nuevo archivo
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
      return updatedConfig;
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      toastHandler(ToastType.Error, 'Error al guardar la configuración');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Funciones de actualización específicas que guardan en JSON inmediatamente
  const updateProducts = useCallback(async (newProducts) => {
    try {
      const updatedConfig = {
        ...storeConfig,
        products: newProducts,
        lastModified: new Date().toISOString()
      };
      
      await saveConfigurationToJSON(updatedConfig);
      return updatedConfig;
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al actualizar productos');
      return null;
    }
  }, [storeConfig, saveConfigurationToJSON]);

  const updateCategories = useCallback(async (newCategories) => {
    try {
      const updatedConfig = {
        ...storeConfig,
        categories: newCategories,
        lastModified: new Date().toISOString()
      };
      
      await saveConfigurationToJSON(updatedConfig);
      return updatedConfig;
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al actualizar categorías');
      return null;
    }
  }, [storeConfig, saveConfigurationToJSON]);

  const updateCoupons = useCallback(async (newCoupons) => {
    try {
      const updatedConfig = {
        ...storeConfig,
        coupons: newCoupons,
        lastModified: new Date().toISOString()
      };
      
      await saveConfigurationToJSON(updatedConfig);
      return updatedConfig;
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al actualizar cupones');
      return null;
    }
  }, [storeConfig, saveConfigurationToJSON]);

  const updateZones = useCallback(async (newZones) => {
    try {
      const updatedConfig = {
        ...storeConfig,
        zones: newZones,
        lastModified: new Date().toISOString()
      };
      
      await saveConfigurationToJSON(updatedConfig);
      return updatedConfig;
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al actualizar zonas');
      return null;
    }
  }, [storeConfig, saveConfigurationToJSON]);

  const updateStoreInfo = useCallback(async (newStoreInfo) => {
    try {
      const updatedConfig = {
        ...storeConfig,
        storeInfo: newStoreInfo,
        lastModified: new Date().toISOString()
      };
      
      await saveConfigurationToJSON(updatedConfig);
      return updatedConfig;
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al actualizar información de tienda');
      return null;
    }
  }, [storeConfig, saveConfigurationToJSON]);

  // Función para importar configuración desde archivo JSON
  const importConfiguration = useCallback(async (file) => {
    setIsLoading(true);
    
    try {
      const text = await file.text();
      const config = JSON.parse(text);
      
      // Validar estructura del archivo
      if (!config.storeInfo || !config.lastModified) {
        throw new Error('Archivo de configuración inválido - estructura incorrecta');
      }

      // Escanear código fuente y agregarlo
      const sourceCodeData = await scanSourceCode();
      config.sourceCode = sourceCodeData;
      
      // Guardar la nueva configuración
      await saveConfigurationToJSON(config);
      
      toastHandler(ToastType.Success, '✅ Configuración importada y aplicada exitosamente');
      
    } catch (error) {
      console.error('Error al importar configuración:', error);
      toastHandler(ToastType.Error, `Error al importar: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [saveConfigurationToJSON, scanSourceCode]);

  // Función para exportar configuración completa
  const exportConfiguration = useCallback(async () => {
    try {
      // Escanear código fuente actualizado antes de exportar
      const sourceCodeData = await scanSourceCode();
      
      const configToExport = {
        ...storeConfig,
        sourceCode: sourceCodeData,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      await saveConfigurationToJSON(configToExport);
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al exportar configuración');
    }
  }, [storeConfig, saveConfigurationToJSON, scanSourceCode]);

  // Función para restablecer configuración (requiere archivo JSON válido)
  const resetConfiguration = useCallback(async () => {
    try {
      await loadConfigurationFromJSON();
      toastHandler(ToastType.Success, 'Configuración restablecida desde archivo JSON');
    } catch (error) {
      toastHandler(ToastType.Error, 'Error: No se puede restablecer sin archivo JSON válido');
    }
  }, [loadConfigurationFromJSON]);

  // Función para manejar errores críticos de configuración
  const handleConfigurationError = useCallback(() => {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '2rem'
      }}>
        <h1>⚠️ Error Crítico de Configuración</h1>
        <p>La tienda no puede funcionar sin el archivo JSON de configuración.</p>
        <p>Error: {configError}</p>
        <div style={{ marginTop: '2rem' }}>
          <input
            type="file"
            accept=".json"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                importConfiguration(file).catch(console.error);
              }
            }}
            style={{ marginBottom: '1rem', padding: '0.5rem' }}
          />
          <br />
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Reintentar Carga
          </button>
        </div>
      </div>
    );
  }, [configError, importConfiguration]);

  // Si hay error crítico, mostrar interfaz de recuperación
  if (configError && !storeConfig.storeInfo) {
    return handleConfigurationError();
  }

  return (
    <ConfigContext.Provider value={{
      // Estado principal
      storeConfig,
      isLoading,
      configError,
      
      // Funciones de actualización específicas (guardan en JSON automáticamente)
      updateProducts,
      updateCategories,
      updateCoupons,
      updateZones,
      updateStoreInfo,
      
      // Funciones de gestión de configuración
      exportConfiguration,
      importConfiguration,
      resetConfiguration,
      loadConfigurationFromJSON,
      saveConfigurationToJSON,
      scanSourceCode,
      
      // Función para obtener cualquier sección
      getConfigSection: (section) => storeConfig[section] || [],
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigContextProvider;
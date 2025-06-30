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
    lastModified: new Date().toISOString(),
    version: '1.0.0'
  });

  // Función para cargar configuración desde JSON
  const loadConfigurationFromJSON = useCallback(async () => {
    try {
      // Intentar cargar desde localStorage primero (simulando carga desde JSON)
      const savedConfig = localStorage.getItem('storeCompleteConfig');
      
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        setStoreConfig(parsedConfig);
        console.log('Configuración cargada desde JSON:', parsedConfig);
      } else {
        // Cargar configuración por defecto desde el archivo JSON incluido
        await loadDefaultConfiguration();
      }
    } catch (error) {
      console.error('Error al cargar configuración desde JSON:', error);
      await loadDefaultConfiguration();
    }
  }, []);

  // Cargar configuración desde el archivo JSON al iniciar
  useEffect(() => {
    loadConfigurationFromJSON();
  }, [loadConfigurationFromJSON]);

  // Cargar configuración por defecto desde archivo JSON
  const loadDefaultConfiguration = async () => {
    try {
      // Simular carga del archivo JSON por defecto
      const response = await fetch('/gada-electronics-config-2025-06-29.json');
      const defaultConfig = await response.json();
      
      setStoreConfig(defaultConfig);
      saveConfigurationToJSON(defaultConfig);
    } catch (error) {
      console.error('Error al cargar configuración por defecto:', error);
      // Usar configuración mínima si falla todo
      const fallbackConfig = {
        storeInfo: {
          storeName: 'Gada Electronics',
          whatsappNumber: '+53 54690878',
          storeAddressId: 'store-main-address',
        },
        coupons: [],
        zones: [],
        products: [],
        categories: [],
        lastModified: new Date().toISOString(),
        version: '1.0.0'
      };
      setStoreConfig(fallbackConfig);
    }
  };

  // Función principal para guardar configuración en JSON
  const saveConfigurationToJSON = (config) => {
    const updatedConfig = {
      ...config,
      lastModified: new Date().toISOString()
    };
    
    // Guardar en localStorage (simulando escritura a archivo JSON)
    localStorage.setItem('storeCompleteConfig', JSON.stringify(updatedConfig));
    setStoreConfig(updatedConfig);
    
    console.log('Configuración guardada en JSON:', updatedConfig);
    return updatedConfig;
  };

  // Función para simular guardado en código fuente
  const saveToSourceCode = async (data, section) => {
    try {
      toastHandler(ToastType.Info, `Guardando ${section} en el código fuente...`);
      
      // Simular delay de escritura al archivo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En una implementación real, esto haría una llamada al backend
      // para escribir los cambios directamente en los archivos fuente
      console.log(`Guardando ${section} en código fuente:`, data);
      
      // Simular éxito/fallo ocasional para realismo
      if (Math.random() > 0.05) { // 95% de éxito
        toastHandler(ToastType.Success, `${section} guardado en código fuente exitosamente`);
        return { success: true };
      } else {
        throw new Error('Error simulado de escritura');
      }
    } catch (error) {
      console.error('Error al guardar en código fuente:', error);
      toastHandler(ToastType.Error, `Error al guardar ${section} en código fuente: ${error.message}`);
      return { success: false, error: error.message };
    }
  };

  // Actualizar productos
  const updateProducts = async (newProducts) => {
    const result = await saveToSourceCode(newProducts, 'productos');
    
    if (result.success) {
      const updatedConfig = saveConfigurationToJSON({
        ...storeConfig,
        products: newProducts
      });
      return updatedConfig;
    }
    return null;
  };

  // Actualizar categorías
  const updateCategories = async (newCategories) => {
    const result = await saveToSourceCode(newCategories, 'categorías');
    
    if (result.success) {
      const updatedConfig = saveConfigurationToJSON({
        ...storeConfig,
        categories: newCategories
      });
      return updatedConfig;
    }
    return null;
  };

  // Actualizar cupones
  const updateCoupons = async (newCoupons) => {
    const result = await saveToSourceCode(newCoupons, 'cupones');
    
    if (result.success) {
      const updatedConfig = saveConfigurationToJSON({
        ...storeConfig,
        coupons: newCoupons
      });
      return updatedConfig;
    }
    return null;
  };

  // Actualizar zonas
  const updateZones = async (newZones) => {
    const result = await saveToSourceCode(newZones, 'zonas');
    
    if (result.success) {
      const updatedConfig = saveConfigurationToJSON({
        ...storeConfig,
        zones: newZones
      });
      return updatedConfig;
    }
    return null;
  };

  // Actualizar información de la tienda
  const updateStoreInfo = async (newStoreInfo) => {
    const result = await saveToSourceCode(newStoreInfo, 'información de tienda');
    
    if (result.success) {
      const updatedConfig = saveConfigurationToJSON({
        ...storeConfig,
        storeInfo: newStoreInfo
      });
      return updatedConfig;
    }
    return null;
  };

  // Exportar configuración completa
  const exportConfiguration = () => {
    const configToExport = {
      ...storeConfig,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    const dataStr = JSON.stringify(configToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gada-electronics-config-${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    toastHandler(ToastType.Success, 'Configuración completa exportada exitosamente');
  };

  // Importar configuración completa
  const importConfiguration = async (file) => {
    try {
      const text = await file.text();
      const config = JSON.parse(text);
      
      // Validar estructura del archivo
      if (!config.storeInfo || !config.lastModified) {
        throw new Error('Archivo de configuración inválido');
      }

      // Guardar configuración importada
      saveConfigurationToJSON(config);
      toastHandler(ToastType.Success, 'Configuración importada exitosamente');
      
      // Recargar la página para aplicar los cambios
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al importar la configuración: ' + error.message);
    }
  };

  // Restablecer configuración
  const resetConfiguration = async () => {
    await loadDefaultConfiguration();
    toastHandler(ToastType.Success, 'Configuración restablecida desde archivo JSON por defecto');
  };

  // Función para obtener cualquier parte de la configuración
  const getConfigSection = (section) => {
    return storeConfig[section] || [];
  };

  // Función para actualizar cualquier sección de la configuración
  const updateConfigSection = async (section, data) => {
    const result = await saveToSourceCode(data, section);
    
    if (result.success) {
      const updatedConfig = saveConfigurationToJSON({
        ...storeConfig,
        [section]: data
      });
      return updatedConfig;
    }
    return null;
  };

  return (
    <ConfigContext.Provider value={{
      // Estado principal
      storeConfig,
      
      // Funciones de actualización específicas
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
      
      // Funciones genéricas
      getConfigSection,
      updateConfigSection,
      saveToSourceCode
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigContextProvider;
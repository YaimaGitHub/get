import React, { createContext, useContext, useState, useEffect } from 'react';
import { toastHandler } from '../utils/utils';
import { ToastType, DEFAULT_STORE_CONFIG, COUPONS, SANTIAGO_ZONES } from '../constants/constants';

const ConfigContext = createContext(null);

export const useConfigContext = () => useContext(ConfigContext);

const ConfigContextProvider = ({ children }) => {
  const [storeConfig, setStoreConfig] = useState({
    storeInfo: DEFAULT_STORE_CONFIG,
    coupons: COUPONS,
    zones: SANTIAGO_ZONES,
    products: [],
    lastModified: new Date().toISOString()
  });

  // Cargar configuración desde localStorage al iniciar
  useEffect(() => {
    const savedConfig = localStorage.getItem('adminStoreConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setStoreConfig(parsedConfig);
      } catch (error) {
        console.error('Error al cargar configuración:', error);
      }
    }
  }, []);

  // Función para simular guardado en código fuente
  const saveToSourceCode = async (configData, section) => {
    try {
      // Simular delay de escritura al archivo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En una implementación real, esto haría una llamada al backend
      // para escribir los cambios directamente en los archivos fuente
      console.log(`Guardando ${section} en código fuente:`, configData);
      
      // Simular éxito/fallo ocasional para realismo
      if (Math.random() > 0.1) { // 90% de éxito
        return { success: true };
      } else {
        throw new Error('Error simulado de escritura');
      }
    } catch (error) {
      console.error('Error al guardar en código fuente:', error);
      return { success: false, error: error.message };
    }
  };

  // Guardar configuración en localStorage cuando cambie
  const saveConfig = (newConfig) => {
    const updatedConfig = {
      ...newConfig,
      lastModified: new Date().toISOString()
    };
    
    setStoreConfig(updatedConfig);
    localStorage.setItem('adminStoreConfig', JSON.stringify(updatedConfig));
    toastHandler(ToastType.Success, 'Configuración guardada exitosamente');
  };

  // Actualizar cupones con guardado en código fuente
  const updateCoupons = async (newCoupons) => {
    toastHandler(ToastType.Info, 'Guardando cupones en el código fuente...');
    
    const result = await saveToSourceCode(newCoupons, 'cupones');
    
    if (result.success) {
      const updatedConfig = {
        ...storeConfig,
        coupons: newCoupons,
        lastModified: new Date().toISOString()
      };
      saveConfig(updatedConfig);
      toastHandler(ToastType.Success, 'Cupones guardados en el código fuente exitosamente');
    } else {
      toastHandler(ToastType.Error, `Error al guardar en código fuente: ${result.error}`);
    }
  };

  // Actualizar zonas con guardado en código fuente
  const updateZones = async (newZones) => {
    toastHandler(ToastType.Info, 'Guardando zonas en el código fuente...');
    
    const result = await saveToSourceCode(newZones, 'zonas');
    
    if (result.success) {
      const updatedConfig = {
        ...storeConfig,
        zones: newZones,
        lastModified: new Date().toISOString()
      };
      saveConfig(updatedConfig);
      toastHandler(ToastType.Success, 'Zonas guardadas en el código fuente exitosamente');
    } else {
      toastHandler(ToastType.Error, `Error al guardar en código fuente: ${result.error}`);
    }
  };

  // Actualizar información de la tienda con guardado en código fuente
  const updateStoreInfo = async (newStoreInfo) => {
    toastHandler(ToastType.Info, 'Guardando información de tienda en el código fuente...');
    
    const result = await saveToSourceCode(newStoreInfo, 'información de tienda');
    
    if (result.success) {
      const updatedConfig = {
        ...storeConfig,
        storeInfo: newStoreInfo,
        lastModified: new Date().toISOString()
      };
      saveConfig(updatedConfig);
      toastHandler(ToastType.Success, 'Información de tienda guardada en el código fuente exitosamente');
    } else {
      toastHandler(ToastType.Error, `Error al guardar en código fuente: ${result.error}`);
    }
  };

  // Actualizar productos con guardado en código fuente
  const updateProducts = async (newProducts) => {
    toastHandler(ToastType.Info, 'Guardando productos en el código fuente...');
    
    const result = await saveToSourceCode(newProducts, 'productos');
    
    if (result.success) {
      const updatedConfig = {
        ...storeConfig,
        products: newProducts,
        lastModified: new Date().toISOString()
      };
      saveConfig(updatedConfig);
      toastHandler(ToastType.Success, 'Productos guardados en el código fuente exitosamente');
    } else {
      toastHandler(ToastType.Error, `Error al guardar en código fuente: ${result.error}`);
    }
  };

  // Exportar configuración
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
    
    toastHandler(ToastType.Success, 'Configuración exportada exitosamente');
  };

  // Importar configuración
  const importConfiguration = async (file) => {
    try {
      const text = await file.text();
      const config = JSON.parse(text);
      
      // Validar estructura del archivo
      if (!config.storeInfo || !config.lastModified) {
        throw new Error('Archivo de configuración inválido');
      }

      saveConfig(config);
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
  const resetConfiguration = () => {
    const defaultConfig = {
      storeInfo: DEFAULT_STORE_CONFIG,
      coupons: COUPONS,
      zones: SANTIAGO_ZONES,
      products: [],
      lastModified: new Date().toISOString()
    };
    
    saveConfig(defaultConfig);
    toastHandler(ToastType.Success, 'Configuración restablecida a valores por defecto');
  };

  return (
    <ConfigContext.Provider value={{
      storeConfig,
      updateCoupons,
      updateZones,
      updateStoreInfo,
      updateProducts,
      exportConfiguration,
      importConfiguration,
      resetConfiguration,
      saveConfig,
      saveToSourceCode
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigContextProvider;
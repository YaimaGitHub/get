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

  // Estado temporal para cambios pendientes (NO se exporta automáticamente)
  const [pendingChanges, setPendingChanges] = useState({
    products: null,
    categories: null,
    coupons: null,
    zones: null,
    storeInfo: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [configError, setConfigError] = useState(null);

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
  }, []);

  // Cargar configuración al iniciar (CRÍTICO para el funcionamiento)
  useEffect(() => {
    loadConfigurationFromJSON().catch(error => {
      console.error('La tienda no puede funcionar sin el archivo de configuración JSON');
      setConfigError('La tienda requiere el archivo JSON para funcionar');
    });
  }, [loadConfigurationFromJSON]);

  // Función para actualizar el servidor con la nueva configuración
  const updateServerConfig = async (newConfig) => {
    try {
      const response = await fetch('/api/admin/update-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newConfig)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar configuración en el servidor');
      }

      const result = await response.json();
      console.log('✅ Configuración actualizada en el servidor:', result);
      return true;
    } catch (error) {
      console.error('❌ Error al actualizar servidor:', error);
      return false;
    }
  };

  // FUNCIÓN PRINCIPAL DE EXPORTACIÓN (REAL, NO SIMULADA)
  const exportConfiguration = useCallback(async () => {
    setIsLoading(true);
    
    try {
      // Combinar configuración actual con cambios pendientes
      const finalConfig = {
        ...storeConfig,
        products: pendingChanges.products || storeConfig.products,
        categories: pendingChanges.categories || storeConfig.categories,
        coupons: pendingChanges.coupons || storeConfig.coupons,
        zones: pendingChanges.zones || storeConfig.zones,
        storeInfo: pendingChanges.storeInfo || storeConfig.storeInfo,
        lastModified: new Date().toISOString(),
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      // 1. Actualizar el servidor con la nueva configuración
      const serverUpdated = await updateServerConfig(finalConfig);
      
      if (!serverUpdated) {
        throw new Error('No se pudo actualizar la configuración en el servidor');
      }

      // 2. Crear y descargar el archivo JSON actualizado
      const jsonContent = JSON.stringify(finalConfig, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `gada-electronics-config-${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // 3. Actualizar el estado local y limpiar cambios pendientes
      setStoreConfig(finalConfig);
      setPendingChanges({
        products: null,
        categories: null,
        coupons: null,
        zones: null,
        storeInfo: null
      });
      
      toastHandler(ToastType.Success, '✅ Configuración exportada y aplicada exitosamente');
      
      // 4. Recargar la página para aplicar los cambios desde el nuevo archivo
      setTimeout(() => {
        toastHandler(ToastType.Info, 'Recargando la tienda para aplicar cambios...');
        window.location.reload();
      }, 2000);
      
      return finalConfig;
    } catch (error) {
      console.error('Error al exportar configuración:', error);
      toastHandler(ToastType.Error, `Error al exportar: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [storeConfig, pendingChanges]);

  // Funciones para guardar cambios SOLO EN MEMORIA (NO exportar)
  const updateProducts = useCallback((newProducts) => {
    setPendingChanges(prev => ({ ...prev, products: newProducts }));
    toastHandler(ToastType.Success, '✅ Productos actualizados en memoria');
    toastHandler(ToastType.Info, 'Ve a "💾 Exportar/Importar" para aplicar los cambios');
  }, []);

  const updateCategories = useCallback((newCategories) => {
    setPendingChanges(prev => ({ ...prev, categories: newCategories }));
    toastHandler(ToastType.Success, '✅ Categorías actualizadas en memoria');
    toastHandler(ToastType.Info, 'Ve a "💾 Exportar/Importar" para aplicar los cambios');
  }, []);

  const updateCoupons = useCallback((newCoupons) => {
    setPendingChanges(prev => ({ ...prev, coupons: newCoupons }));
    toastHandler(ToastType.Success, '✅ Cupones actualizados en memoria');
    toastHandler(ToastType.Info, 'Ve a "💾 Exportar/Importar" para aplicar los cambios');
  }, []);

  const updateZones = useCallback((newZones) => {
    setPendingChanges(prev => ({ ...prev, zones: newZones }));
    toastHandler(ToastType.Success, '✅ Zonas actualizadas en memoria');
    toastHandler(ToastType.Info, 'Ve a "💾 Exportar/Importar" para aplicar los cambios');
  }, []);

  const updateStoreInfo = useCallback((newStoreInfo) => {
    setPendingChanges(prev => ({ ...prev, storeInfo: newStoreInfo }));
    toastHandler(ToastType.Success, '✅ Información de tienda actualizada en memoria');
    toastHandler(ToastType.Info, 'Ve a "💾 Exportar/Importar" para aplicar los cambios');
  }, []);

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

      // Actualizar servidor y estado local
      const serverUpdated = await updateServerConfig(config);
      
      if (!serverUpdated) {
        throw new Error('No se pudo actualizar la configuración en el servidor');
      }

      setStoreConfig(config);
      setPendingChanges({
        products: null,
        categories: null,
        coupons: null,
        zones: null,
        storeInfo: null
      });
      
      toastHandler(ToastType.Success, '✅ Configuración importada exitosamente');
      
      // Recargar para aplicar cambios
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Error al importar configuración:', error);
      toastHandler(ToastType.Error, `Error al importar: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para restablecer configuración
  const resetConfiguration = useCallback(async () => {
    try {
      await loadConfigurationFromJSON();
      setPendingChanges({
        products: null,
        categories: null,
        coupons: null,
        zones: null,
        storeInfo: null
      });
      toastHandler(ToastType.Success, 'Configuración restablecida desde archivo JSON');
    } catch (error) {
      toastHandler(ToastType.Error, 'Error: No se puede restablecer sin archivo JSON válido');
    }
  }, [loadConfigurationFromJSON]);

  // Función para obtener configuración actual (incluyendo cambios pendientes)
  const getCurrentConfig = useCallback(() => {
    return {
      ...storeConfig,
      products: pendingChanges.products || storeConfig.products,
      categories: pendingChanges.categories || storeConfig.categories,
      coupons: pendingChanges.coupons || storeConfig.coupons,
      zones: pendingChanges.zones || storeConfig.zones,
      storeInfo: pendingChanges.storeInfo || storeConfig.storeInfo,
    };
  }, [storeConfig, pendingChanges]);

  // Verificar si hay cambios pendientes
  const hasPendingChanges = useCallback(() => {
    return Object.values(pendingChanges).some(change => change !== null);
  }, [pendingChanges]);

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
      storeConfig: getCurrentConfig(),
      isLoading,
      configError,
      hasPendingChanges,
      
      // Funciones de actualización (SOLO guardan en memoria)
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
      
      // Función para obtener cualquier sección
      getConfigSection: (section) => getCurrentConfig()[section] || [],
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigContextProvider;
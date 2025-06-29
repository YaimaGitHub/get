import React, { useState } from 'react';
import { toastHandler } from '../../../utils/utils';
import { ToastType } from '../../../constants/constants';
import { useConfigContext } from '../../../contexts/ConfigContextProvider';
import styles from './ConfigManager.module.css';

const ConfigManager = () => {
  const { 
    storeConfig,
    exportConfiguration, 
    importConfiguration, 
    resetConfiguration 
  } = useConfigContext();
  
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      exportConfiguration();
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al exportar la configuración');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsImporting(true);

    try {
      await importConfiguration(file);
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al importar la configuración');
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  const handleReset = async () => {
    if (!window.confirm('¿Estás seguro de restablecer toda la configuración a los valores por defecto? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      resetConfiguration();
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al restablecer la configuración');
    }
  };

  return (
    <div className={styles.configManager}>
      <h2>Gestión de Configuración Completa</h2>
      
      <div className={styles.configStats}>
        <div className={styles.statCard}>
          <h4>📊 Estado Actual</h4>
          <div className={styles.statGrid}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{storeConfig.products?.length || 0}</span>
              <span className={styles.statLabel}>Productos</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{storeConfig.categories?.length || 0}</span>
              <span className={styles.statLabel}>Categorías</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{storeConfig.coupons?.length || 0}</span>
              <span className={styles.statLabel}>Cupones</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{storeConfig.zones?.length || 0}</span>
              <span className={styles.statLabel}>Zonas</span>
            </div>
          </div>
          <p className={styles.lastModified}>
            Última modificación: {new Date(storeConfig.lastModified).toLocaleString('es-CU')}
          </p>
        </div>
      </div>
      
      <div className={styles.configSection}>
        <div className={styles.configCard}>
          <div className={styles.cardHeader}>
            <h3>📤 Exportar Configuración Completa</h3>
          </div>
          <div className={styles.cardContent}>
            <p>
              Exporta TODA la configuración de la tienda incluyendo:
            </p>
            <ul className={styles.featureList}>
              <li>✅ Todos los productos con sus detalles</li>
              <li>✅ Todas las categorías</li>
              <li>✅ Todos los cupones de descuento</li>
              <li>✅ Todas las zonas de entrega</li>
              <li>✅ Configuración general de la tienda</li>
              <li>✅ Información de WhatsApp y contacto</li>
            </ul>
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className={`btn btn-primary ${styles.actionButton}`}
            >
              {isExporting ? (
                <span className={styles.loading}>
                  <span className="loader-2"></span>
                  Exportando...
                </span>
              ) : (
                '📤 Exportar Configuración Completa'
              )}
            </button>
          </div>
        </div>

        <div className={styles.configCard}>
          <div className={styles.cardHeader}>
            <h3>📥 Importar Configuración Completa</h3>
          </div>
          <div className={styles.cardContent}>
            <p>
              Importa una configuración completa previamente exportada. 
              <strong> Esto sobrescribirá TODA la configuración actual.</strong>
            </p>
            <div className={styles.importContainer}>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting}
                className={styles.fileInput}
                id="config-import"
              />
              <label 
                htmlFor="config-import" 
                className={`btn btn-success ${styles.actionButton} ${isImporting ? styles.disabled : ''}`}
              >
                {isImporting ? (
                  <span className={styles.loading}>
                    <span className="loader-2"></span>
                    Importando...
                  </span>
                ) : (
                  '📥 Seleccionar Archivo JSON'
                )}
              </label>
            </div>
          </div>
        </div>

        <div className={styles.configCard}>
          <div className={styles.cardHeader}>
            <h3>🔄 Restablecer Configuración</h3>
          </div>
          <div className={styles.cardContent}>
            <p>
              Restablece TODA la configuración de la tienda a los valores por defecto del archivo JSON original. 
              <strong> Esta acción eliminará todos los cambios realizados.</strong>
            </p>
            <button 
              onClick={handleReset}
              className={`btn btn-danger ${styles.actionButton}`}
            >
              🔄 Restablecer a Configuración Original
            </button>
          </div>
        </div>
      </div>

      <div className={styles.infoSection}>
        <h3>ℹ️ Información del Sistema</h3>
        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <strong>🎯 Funcionamiento:</strong> La tienda se rige completamente por el archivo JSON exportado
          </div>
          <div className={styles.infoItem}>
            <strong>💾 Guardado:</strong> Todos los cambios se guardan en el código fuente y se exportan en JSON
          </div>
          <div className={styles.infoItem}>
            <strong>📁 Formato:</strong> JSON (.json) con estructura completa de la tienda
          </div>
          <div className={styles.infoItem}>
            <strong>🔄 Sincronización:</strong> Cambios en el panel se reflejan automáticamente en el JSON
          </div>
          <div className={styles.infoItem}>
            <strong>🛡️ Seguridad:</strong> Realiza copias de seguridad antes de importar configuraciones
          </div>
          <div className={styles.infoItem}>
            <strong>⚡ Rendimiento:</strong> Configuración optimizada para carga rápida
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigManager;
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
    resetConfiguration,
    isLoading,
    configError,
    hasPendingChanges
  } = useConfigContext();
  
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    if (!hasPendingChanges()) {
      toastHandler(ToastType.Info, 'No hay cambios pendientes para exportar');
      return;
    }

    setIsExporting(true);
    
    try {
      toastHandler(ToastType.Info, 'Exportando configuración completa al archivo JSON...');
      await exportConfiguration();
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al exportar la configuración');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toastHandler(ToastType.Error, 'Solo se permiten archivos JSON');
      event.target.value = '';
      return;
    }

    setIsImporting(true);

    try {
      toastHandler(ToastType.Info, 'Importando configuración desde archivo JSON...');
      await importConfiguration(file);
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al importar la configuración');
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  const handleReset = async () => {
    if (!window.confirm('⚠️ ¿Estás seguro de restablecer toda la configuración? Esta acción recargará la tienda desde el archivo JSON original.')) {
      return;
    }

    try {
      toastHandler(ToastType.Info, 'Restableciendo configuración desde JSON original...');
      await resetConfiguration();
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al restablecer la configuración');
    }
  };

  const getConfigSize = () => {
    const configString = JSON.stringify(storeConfig);
    return (new Blob([configString]).size / 1024).toFixed(2);
  };

  return (
    <div className={styles.configManager}>
      <h2>💾 Exportar/Importar Configuración JSON</h2>
      
      {configError && (
        <div className={styles.errorAlert}>
          <h4>⚠️ Error de Configuración</h4>
          <p>{configError}</p>
        </div>
      )}

      {hasPendingChanges() && (
        <div className={styles.pendingChangesAlert}>
          <h4>🔴 Cambios Pendientes Detectados</h4>
          <p>Hay modificaciones en el panel de control que no se han aplicado a la tienda. Exporta la configuración para aplicar todos los cambios.</p>
        </div>
      )}
      
      <div className={styles.configStats}>
        <div className={styles.statCard}>
          <h4>📊 Estado de la Configuración JSON</h4>
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
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{getConfigSize()}</span>
              <span className={styles.statLabel}>KB Total</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{hasPendingChanges() ? '🔴' : '✅'}</span>
              <span className={styles.statLabel}>Estado</span>
            </div>
          </div>
          <div className={styles.configInfo}>
            <p><strong>📅 Última modificación:</strong> {new Date(storeConfig.lastModified).toLocaleString('es-CU')}</p>
            <p><strong>🔢 Versión:</strong> {storeConfig.version}</p>
            <p><strong>🏪 Tienda:</strong> {storeConfig.storeInfo?.storeName}</p>
            <p><strong>📊 Cambios pendientes:</strong> {hasPendingChanges() ? 'SÍ - Requiere exportación' : 'NO - Todo aplicado'}</p>
          </div>
        </div>
      </div>
      
      <div className={styles.configSection}>
        <div className={styles.configCard}>
          <div className={styles.cardHeader}>
            <h3>📤 Exportar Configuración al Archivo JSON</h3>
          </div>
          <div className={styles.cardContent}>
            <p>
              Exporta TODOS los cambios realizados en el panel de control al archivo JSON de la tienda:
            </p>
            <ul className={styles.featureList}>
              <li>✅ Todos los productos modificados/creados/eliminados</li>
              <li>✅ Todas las categorías modificadas/creadas/eliminadas</li>
              <li>✅ Todos los cupones modificados/creados/eliminados</li>
              <li>✅ Todas las zonas modificadas/creadas/eliminadas</li>
              <li>✅ Configuración de tienda actualizada</li>
              <li>✅ Información de contacto y WhatsApp</li>
              <li>✅ Metadatos y versiones actualizadas</li>
            </ul>
            <div className={styles.criticalInfo}>
              <p><strong>🎯 IMPORTANTE:</strong> Este proceso aplicará TODOS los cambios pendientes a la tienda y generará el archivo JSON actualizado.</p>
            </div>
            <button 
              onClick={handleExport}
              disabled={isExporting || isLoading || !hasPendingChanges()}
              className={`btn ${hasPendingChanges() ? 'btn-primary' : 'btn-hipster'} ${styles.actionButton}`}
            >
              {isExporting ? (
                <span className={styles.loading}>
                  <span className="loader-2"></span>
                  Exportando...
                </span>
              ) : hasPendingChanges() ? (
                '📤 Exportar Cambios al Archivo JSON'
              ) : (
                '✅ No hay cambios para exportar'
              )}
            </button>
          </div>
        </div>

        <div className={styles.configCard}>
          <div className={styles.cardHeader}>
            <h3>📥 Importar Configuración desde JSON</h3>
          </div>
          <div className={styles.cardContent}>
            <p>
              Importa una configuración completa desde un archivo JSON válido.
            </p>
            <div className={styles.criticalWarning}>
              <h4>🚨 ADVERTENCIA CRÍTICA</h4>
              <p>Esta acción sobrescribirá TODA la configuración actual de la tienda y recargará la página automáticamente.</p>
            </div>
            <div className={styles.importContainer}>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={isImporting || isLoading}
                className={styles.fileInput}
                id="config-import"
              />
              <label 
                htmlFor="config-import" 
                className={`btn btn-success ${styles.actionButton} ${(isImporting || isLoading) ? styles.disabled : ''}`}
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
            <h3>🔄 Restablecer desde JSON Original</h3>
          </div>
          <div className={styles.cardContent}>
            <p>
              Restablece la configuración cargando nuevamente el archivo JSON original de la tienda.
            </p>
            <div className={styles.criticalWarning}>
              <h4>🚨 ADVERTENCIA</h4>
              <p>Esta acción eliminará todos los cambios no exportados y recargará desde el archivo JSON base.</p>
            </div>
            <button 
              onClick={handleReset}
              disabled={isLoading}
              className={`btn btn-danger ${styles.actionButton}`}
            >
              🔄 Restablecer desde JSON Original
            </button>
          </div>
        </div>
      </div>

      <div className={styles.infoSection}>
        <h3>ℹ️ Información del Sistema JSON</h3>
        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <strong>🎯 Funcionamiento:</strong> La tienda depende 100% del archivo JSON para funcionar
          </div>
          <div className={styles.infoItem}>
            <strong>💾 Guardado:</strong> Los cambios se guardan en memoria hasta la exportación
          </div>
          <div className={styles.infoItem}>
            <strong>📁 Exportación:</strong> Solo se exporta cuando hay cambios pendientes
          </div>
          <div className={styles.infoItem}>
            <strong>🔄 Aplicación:</strong> Los cambios se aplican al exportar al archivo JSON
          </div>
          <div className={styles.infoItem}>
            <strong>🛡️ Seguridad:</strong> Sin dependencia del localStorage del navegador
          </div>
          <div className={styles.infoItem}>
            <strong>⚡ Tiempo Real:</strong> Los cambios se aplican inmediatamente al exportar
          </div>
        </div>
      </div>

      <div className={styles.technicalInfo}>
        <h3>🔧 Información Técnica</h3>
        <div className={styles.techDetails}>
          <div className={styles.techItem}>
            <strong>Archivo de configuración:</strong> gada-electronics-config-[fecha].json
          </div>
          <div className={styles.techItem}>
            <strong>Proceso de exportación:</strong> Memoria → Servidor → Archivo JSON → Recarga
          </div>
          <div className={styles.techItem}>
            <strong>Validación:</strong> Estructura JSON validada automáticamente
          </div>
          <div className={styles.techItem}>
            <strong>Backup:</strong> Se genera automáticamente al exportar
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigManager;
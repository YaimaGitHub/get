import React, { useState, useEffect } from 'react';
import { useConfigContext } from '../../../contexts/ConfigContextProvider';
import { toastHandler } from '../../../utils/utils';
import { ToastType } from '../../../constants/constants';
import styles from './SourceCodeManager.module.css';

const SourceCodeManager = () => {
  const { storeConfig, scanSourceCode, saveConfigurationToJSON } = useConfigContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('backend');
  const [isScanning, setIsScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const sourceCode = storeConfig.sourceCode || { backend: {}, frontend: {}, totalFiles: 0 };

  const handleScanSourceCode = async () => {
    setIsScanning(true);
    try {
      toastHandler(ToastType.Info, 'Escaneando código fuente...');
      const newSourceCode = await scanSourceCode();
      
      const updatedConfig = {
        ...storeConfig,
        sourceCode: newSourceCode,
        lastModified: new Date().toISOString()
      };
      
      await saveConfigurationToJSON(updatedConfig);
      toastHandler(ToastType.Success, `✅ Código fuente escaneado: ${newSourceCode.totalFiles} archivos`);
    } catch (error) {
      toastHandler(ToastType.Error, 'Error al escanear código fuente');
    } finally {
      setIsScanning(false);
    }
  };

  const renderFileTree = (category) => {
    const categoryData = sourceCode[category] || {};
    
    return Object.keys(categoryData).map(subcategory => (
      <div key={subcategory} className={styles.subcategory}>
        <h4 className={styles.subcategoryTitle}>
          📁 {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
        </h4>
        <div className={styles.fileList}>
          {Object.entries(categoryData[subcategory]).map(([fileName, fileData]) => (
            <div
              key={fileName}
              className={`${styles.fileItem} ${selectedFile?.path === fileData.path ? styles.selected : ''}`}
              onClick={() => setSelectedFile(fileData)}
            >
              <div className={styles.fileName}>
                📄 {fileName}
              </div>
              <div className={styles.fileInfo}>
                <span className={styles.fileSize}>
                  {(fileData.size / 1024).toFixed(1)} KB
                </span>
                <span className={styles.fileDate}>
                  {new Date(fileData.lastModified).toLocaleDateString('es-CU')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };

  const filteredFiles = () => {
    if (!searchTerm) return null;
    
    const allFiles = [];
    ['backend', 'frontend'].forEach(category => {
      const categoryData = sourceCode[category] || {};
      Object.values(categoryData).forEach(subcategory => {
        Object.entries(subcategory).forEach(([fileName, fileData]) => {
          if (fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              fileData.path.toLowerCase().includes(searchTerm.toLowerCase())) {
            allFiles.push({ fileName, ...fileData });
          }
        });
      });
    });
    
    return allFiles;
  };

  const searchResults = filteredFiles();

  return (
    <div className={styles.sourceCodeManager}>
      <div className={styles.header}>
        <h2>📂 Gestión de Código Fuente</h2>
        <button 
          onClick={handleScanSourceCode}
          disabled={isScanning}
          className="btn btn-primary"
        >
          {isScanning ? (
            <span className={styles.loading}>
              <span className="loader-2"></span>
              Escaneando...
            </span>
          ) : (
            '🔄 Escanear Código Fuente'
          )}
        </button>
      </div>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h4>📊 Estadísticas del Código</h4>
          <div className={styles.stats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{sourceCode.totalFiles}</span>
              <span className={styles.statLabel}>Archivos Totales</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {Object.keys(sourceCode.backend || {}).length}
              </span>
              <span className={styles.statLabel}>Categorías Backend</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>
                {Object.keys(sourceCode.frontend || {}).length}
              </span>
              <span className={styles.statLabel}>Categorías Frontend</span>
            </div>
          </div>
          {sourceCode.lastScanned && (
            <p className={styles.lastScanned}>
              Último escaneo: {new Date(sourceCode.lastScanned).toLocaleString('es-CU')}
            </p>
          )}
        </div>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="🔍 Buscar archivos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`form-input ${styles.searchInput}`}
        />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.sidebar}>
          <div className={styles.categoryTabs}>
            <button
              className={`${styles.categoryTab} ${selectedCategory === 'backend' ? styles.active : ''}`}
              onClick={() => setSelectedCategory('backend')}
            >
              🔧 Backend
            </button>
            <button
              className={`${styles.categoryTab} ${selectedCategory === 'frontend' ? styles.active : ''}`}
              onClick={() => setSelectedCategory('frontend')}
            >
              🎨 Frontend
            </button>
          </div>

          <div className={styles.fileTree}>
            {searchResults ? (
              <div className={styles.searchResults}>
                <h4>🔍 Resultados de búsqueda ({searchResults.length})</h4>
                {searchResults.map((file, index) => (
                  <div
                    key={index}
                    className={`${styles.fileItem} ${selectedFile?.path === file.path ? styles.selected : ''}`}
                    onClick={() => setSelectedFile(file)}
                  >
                    <div className={styles.fileName}>📄 {file.fileName}</div>
                    <div className={styles.filePath}>{file.path}</div>
                  </div>
                ))}
              </div>
            ) : (
              renderFileTree(selectedCategory)
            )}
          </div>
        </div>

        <div className={styles.fileViewer}>
          {selectedFile ? (
            <div className={styles.fileContent}>
              <div className={styles.fileHeader}>
                <h3>📄 {selectedFile.path}</h3>
                <div className={styles.fileMetadata}>
                  <span>📏 Tamaño: {(selectedFile.size / 1024).toFixed(1)} KB</span>
                  <span>📅 Modificado: {new Date(selectedFile.lastModified).toLocaleString('es-CU')}</span>
                </div>
              </div>
              <div className={styles.codeContainer}>
                <pre className={styles.codeContent}>
                  <code>{selectedFile.content}</code>
                </pre>
              </div>
            </div>
          ) : (
            <div className={styles.noFileSelected}>
              <h3>📂 Selecciona un archivo para ver su contenido</h3>
              <p>Haz clic en cualquier archivo del árbol de la izquierda para ver su código fuente.</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.infoSection}>
        <h3>ℹ️ Información del Sistema de Código Fuente</h3>
        <div className={styles.infoList}>
          <div className={styles.infoItem}>
            <strong>🎯 Propósito:</strong> Escanea y organiza todo el código fuente de la aplicación
          </div>
          <div className={styles.infoItem}>
            <strong>📁 Estructura:</strong> Organizado por categorías (Backend/Frontend) y subcategorías
          </div>
          <div className={styles.infoItem}>
            <strong>🔄 Actualización:</strong> Escaneo manual para obtener la versión más reciente
          </div>
          <div className={styles.infoItem}>
            <strong>💾 Almacenamiento:</strong> Todo se guarda en el archivo JSON de configuración
          </div>
          <div className={styles.infoItem}>
            <strong>🔍 Búsqueda:</strong> Busca archivos por nombre o ruta
          </div>
          <div className={styles.infoItem}>
            <strong>📊 Estadísticas:</strong> Información detallada sobre el código base
          </div>
        </div>
      </div>
    </div>
  );
};

export default SourceCodeManager;
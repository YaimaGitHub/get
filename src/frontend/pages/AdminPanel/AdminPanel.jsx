import React, { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContextProvider';
import { Navigate } from 'react-router-dom';
import ProductManager from './components/ProductManager';
import CouponManager from './components/CouponManager';
import StoreSettings from './components/StoreSettings';
import ConfigManager from './components/ConfigManager';
import CategoryManager from './components/CategoryManager';
import SourceCodeManager from './components/SourceCodeManager';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
  const { isAdmin } = useAuthContext();
  const [activeTab, setActiveTab] = useState('products');

  if (!isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  const tabs = [
    { id: 'products', label: '📦 Productos', component: ProductManager },
    { id: 'categories', label: '📂 Categorías', component: CategoryManager },
    { id: 'coupons', label: '🎫 Cupones', component: CouponManager },
    { id: 'settings', label: '⚙️ Configuración', component: StoreSettings },
    { id: 'sourcecode', label: '📂 Código Fuente', component: SourceCodeManager },
    { id: 'config', label: '💾 Exportar/Importar', component: ConfigManager },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className={styles.adminPanel}>
      <div className={styles.header}>
        <h1>👑 Panel de Control de Administrador</h1>
        <p>Gestión completa de la tienda basada en archivo JSON</p>
      </div>

      <div className={styles.tabContainer}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default AdminPanel;
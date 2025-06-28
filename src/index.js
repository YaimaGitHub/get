import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import 'normalize.css';
import './index.css';
import { makeServer } from './server';
import {
  AuthContextProvider,
  FiltersContextProvider,
  ProductsContextProvider,
  ConfigContextProvider,
} from './frontend/contexts';

// Call make Server
makeServer();

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <ConfigContextProvider>
        <ProductsContextProvider>
          <FiltersContextProvider>
            <App />
          </FiltersContextProvider>
        </ProductsContextProvider>
      </ConfigContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import {Auth0ProviderWithNavigate} from "./auth0/Auth0ProviderWithNavigate.tsx";
// import { Provider } from 'react-redux';
// import { store } from './redux/store.ts';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <Auth0ProviderWithNavigate>
          {/* Envolvemos la aplicación en Provider y pasamos la tienda de Redux como prop */}
           <Provider store={store}>
            <App /> {/* Renderizamos el componente principal de la aplicación */}
          </Provider>
      </Auth0ProviderWithNavigate>
  </React.StrictMode>
);

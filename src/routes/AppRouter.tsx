// AppRouter.tsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Sidebar from '../components/Sider/SideBar';
import Inicio from '../components/Inicio/Inicio';
import Usuario from '../components/Usuario/Usuario';
import { ListaCupones } from '../components/Marketing/Cupones';
import { Promocion } from '../components/Marketing/Promociones';
import { Estadisticas } from '../components/Estadisticas/Estadisticas';
import { ListaProductos } from '../components/Productos/ListaProductos';
import BaseNavBar from '../components/common/BaseNavBar';
import Promociones from '../types/Promocion';


const AppRouter: React.FC = () => {
  const navLinks = [
    { title: 'Inicio', to: '/' },
    { title: 'Usuario', to: '/usuario' },
    { title: 'Estadísticas', to: '/estadisticas' },
    { title: 'Productos', to: '/productos/lista' },
    { title: 'Cupones', to: '/cupones/lista' },
    { title: 'Promocion', to: '/promociones/lista' },

  ];

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <BaseNavBar links={navLinks} />
        <div style={{ flex: 1, overflow: 'auto' }}>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/usuario" element={<Usuario />} />
            <Route path="/estadisticas" element={<Estadisticas />} />
            <Route path="/productos/lista" element={<ListaProductos />} />
            <Route path="/cupones/lista" element={<ListaCupones />} />
            <Route path="/promociones/lista" element={<Promocion />} />

            {/* Agregar más rutas aquí */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AppRouter;

import React from 'react';
import Sidebar from '../components/Sider/SideBar';
import { Route, Routes } from 'react-router-dom';
import { ListaProductos } from '../components/Productos/ListaProductos';
import { CContainer, CRow, CCol } from "@coreui/react";
import Inicio from '../components/Inicio/Inicio';
import Usuario from '../components/Usuario/Usuario';
import { ListaCupones } from '../components/Marketing/Cupones';
import { Promocion } from '../components/Marketing/Promociones';
import Estadisticas from '../components/Estadisticas/Estadisticas';
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
    <React.Fragment>
      <BaseNavBar /> {/* Agregar BaseNavBar aquí */}
      <CContainer fluid>
        <CRow>
          {/* Sidebar */}
          <CCol xs="auto" className="sidebar">
            <Sidebar />
          </CCol>

          {/* Contenido principal */}
          <CCol>
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/usuario" element={<Usuario />} />
              <Route path="/estadisticas" element={<Estadisticas />} />
              <Route path="/productos/lista" element={<ListaProductos />} />
              <Route path="/cupones/lista" element={<ListaCupones />} />
              <Route path="/promociones/lista" element={<Promocion />} />

              {/* Agrega más rutas aquí */}
              <Route path="/categorias" element={<Categoria />} />
          </Routes>
          </CCol>
        </CRow>
      </CContainer>
    </React.Fragment>
  );
};

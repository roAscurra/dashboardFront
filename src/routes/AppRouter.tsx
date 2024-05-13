import React from 'react';
import Sidebar from '../components/Sider/SideBar';
import { Route, Routes } from 'react-router-dom';
import { ListaProductos } from '../components/Productos/ListaProductos';
import { CContainer, CRow, CCol } from "@coreui/react";
import Inicio from '../components/Inicio/Inicio';
import Usuario from '../components/Usuario/Usuario';
import { ListaCupones } from '../components/Marketing/Cupones';
import Estadisticas from '../components/Estadisticas/Estadisticas';
import BaseNavBar from '../components/common/BaseNavBar';
import { ListaPromocion } from '../components/Marketing/Promocion';
import Categoria from '../components/Categoria/Categoria';
import  { ListaSucursal } from '../components/Configuracion/Sucursal';
import { ListaArticulosInsumo } from '../components/ArticuloInsumo/ArticuloInsumo';

export const AppRouter = () => {
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
              <Route path='/ArticuloInsumo/Lista' element={< ListaArticulosInsumo/>}></Route>
              <Route path="/" element={<Inicio />} />
              <Route path="/usuario" element={<Usuario />} />
              <Route path="/estadisticas" element={<Estadisticas />} />
              <Route path="/productos/lista" element={<ListaProductos />} />
              <Route path="/categorias" element={<Categoria />} />
              <Route path="/cupones/lista" element={<ListaCupones />} />
              <Route path="/promociones/lista" element={<ListaPromocion />} />
              <Route path="/sucursales/lista" element={<ListaSucursal />} />


              {/* Agrega más rutas aquí */}
            </Routes>
          </CCol>
        </CRow>
      </CContainer>
    </React.Fragment>
  );
};
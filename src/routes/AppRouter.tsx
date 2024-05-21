import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { CContainer, CRow, CCol } from "@coreui/react";

import BaseNavBar from '../components/ui/common/BaseNavBar';
import {ListaArticulosInsumo} from "../components/screens/ArticuloInsumo/ArticuloInsumo.tsx";
import Inicio from "../components/screens/Inicio/Inicio.tsx";
import Usuario from "../components/screens/Usuario/Usuario.tsx";
import Estadisticas from "../components/screens/Estadisticas/Estadisticas.tsx";
import {ListaProductos} from "../components/screens/Productos/ListaProductos.tsx";
import Categoria from "../components/screens/Categoria/Categoria.tsx";
import {ListaCupones} from "../components/screens/Marketing/Cupones/Cupones.tsx";
import {ListaPromocion} from "../components/screens/Marketing/Promociones/Promocion.tsx";
import {ListaSucursal} from "../components/screens/Sucursal/Sucursal.tsx";
import {ListaEmpresa} from "../components/screens/Empresa/Empresa.tsx";
import SubirImagen from "../components/screens/Empresa/SubirImagen.tsx";

import Sidebar from "../components/ui/Sider/SideBar.tsx";

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
            <Route path="/" element={<ListaEmpresa />} />
              <Route path='/ArticuloInsumo/Lista' element={< ListaArticulosInsumo/>}></Route>
              <Route path="/" element={<Inicio />} />
              <Route path="/usuario" element={<Usuario />} />
              <Route path="/estadisticas" element={<Estadisticas />} />
              <Route path="/productos/lista" element={<ListaProductos />} />
              <Route path="/categorias" element={<Categoria />} />
              <Route path="/cupones/lista" element={<ListaCupones />} />
              <Route path="/promociones/lista" element={<ListaPromocion />} />
              <Route path="/sucursales/lista" element={<ListaSucursal />} />
              <Route path="/empresas/:id/sucursales" element={<ListaSucursal />} />
              <Route path="/imagenEmpresa" element={<SubirImagen />} /> {/* Ruta para el componente SubirImagen */}

              {/* Agrega más rutas aquí */}
            </Routes>
          </CCol>
        </CRow>
      </CContainer>
    </React.Fragment>
  );
};
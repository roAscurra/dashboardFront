import Sidebar from '../components/Sider/SideBar'
import { Route, Routes } from 'react-router-dom'
import { ListaProductos } from '../components/Productos/ListaProductos'
import { CContainer, CRow, CCol } from "@coreui/react"; // Importa los componentes de diseño de CoreUI
import Inicio from '../components/Inicio/Inicio';
import Usuario from '../components/Usuario/Usuario';
import { ListaCupones } from '../components/Marketing/Cupones';
import Estadisticas from '../components/Estadisticas/Estadisticas';

export const AppRouter = () => {
  return (
    <CContainer fluid>
      <CRow>
        {/* Sidebar */}
        <CCol xs="auto" className="sidebar">
          <Sidebar />
        </CCol>

        {/* Contenido principal */}
        <CCol>
          <Routes>
            <Route path ="/" element={<Inicio/>}/>
            <Route path ="/usuario" element={<Usuario/>}/>
            <Route path ="/estadisticas" element={<Estadisticas />}/>
            <Route path="/productos/lista" element={<ListaProductos />} />
            <Route path="/cupones/lista" element={<ListaCupones />} />
            {/* Agrega más rutas aquí */}
          </Routes>
        </CCol>
      </CRow>
    </CContainer>
  )
}
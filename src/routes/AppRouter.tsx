import { Route, Routes } from 'react-router-dom';
import {ListaArticulosInsumo} from "../components/screens/ArticuloInsumo/ArticuloInsumo.tsx";
import Inicio from "../components/screens/Inicio/Inicio.tsx";
import Usuario from "../components/screens/Usuario/Usuario.tsx";
import {ListaProductos} from "../components/screens/Productos/ListaProductos.tsx";
import Categoria from "../components/screens/Categoria/Categoria.tsx";
import {ListaPromocion} from "../components/screens/Promocion/Promocion.tsx";
import {ListaSucursal} from "../components/screens/Sucursal/Sucursal.tsx";
import {ListaEmpresa} from "../components/screens/Empresa/Empresa.tsx";
import UnidadMedida from '../components/screens/UnidadMedida/UnidadMedida.tsx';
import {AuthenticationGuard} from "../auth0/AuthenticationGuard.tsx";
import { ListaPedidos } from '../components/screens/Pedidos/ListaPedidos.tsx';
import {Reporte} from "../components/screens/Reporte.tsx";


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthenticationGuard component={ListaEmpresa} />} />
      <Route path='/articuloInsumo/Lista/:sucursalId' element={<AuthenticationGuard component={ListaArticulosInsumo} />} />
      <Route path="/inicio/:sucursalId" element={<AuthenticationGuard component={Inicio} />} />
      <Route path="/usuario/:sucursalId" element={<AuthenticationGuard component={Usuario} />} />
      <Route path="/productos/lista/:sucursalId" element={<AuthenticationGuard component={ListaProductos} />} />
      <Route path="/categorias/:sucursalId" element={<AuthenticationGuard component={Categoria} />} />
      <Route path='/unidadMedida/:sucursalId' element={<AuthenticationGuard component={UnidadMedida}/>}/>
      <Route path="/promociones/lista/:sucursalId" element={<AuthenticationGuard component={ListaPromocion} />} />
      <Route path="/sucursal/:empresaId" element={<AuthenticationGuard component={ListaSucursal} />} />
      <Route path="/pedidos/:sucursalId" element={<AuthenticationGuard component={ListaPedidos} />}/>
      <Route path="/reportes" element={<AuthenticationGuard component={Reporte} />}/>
    </Routes>
  );
};
export default AppRouter;
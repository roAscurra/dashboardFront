import { Route, Routes } from 'react-router-dom';
import { BaseNavBar } from '../components/ui/common/BaseNavBar';
import {ListaArticulosInsumo} from "../components/screens/ArticuloInsumo/ArticuloInsumo.tsx";
import Inicio from "../components/screens/Inicio/Inicio.tsx";
import Usuario from "../components/screens/Usuario/Usuario.tsx";
// import Estadisticas from "../components/screens/Estadisticas/Estadisticas.tsx";
import {ListaProductos} from "../components/screens/Productos/ListaProductos.tsx";
import Categoria from "../components/screens/Categoria/Categoria.tsx";
// import {ListaCupones} from "../components/screens/Marketing/Cupones/Cupones.tsx";
import {ListaPromocion} from "../components/screens/Promocion/Promocion.tsx";
import {ListaSucursal} from "../components/screens/Sucursal/Sucursal.tsx";
import {ListaEmpresa} from "../components/screens/Empresa/Empresa.tsx";
import UnidadMedida from '../components/screens/UnidadMedida/UnidadMedida.tsx';


const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<><BaseNavBar title="Empresas" /> <ListaEmpresa /></>} />
      <Route path='/articuloInsumo/Lista/:sucursalId' element={<ListaArticulosInsumo />} /> ta
      <Route path="/inicio/:sucursalId" element={<Inicio />} /> ta
      <Route path="/usuario/:sucursalId" element={<Usuario />} />
      <Route path="/productos/lista/:sucursalId" element={<ListaProductos />} /> ta
      <Route path="/categorias/:sucursalId" element={<Categoria />} /> ta
      <Route path='/unidadMedida/:sucursalId' element={<UnidadMedida/>}/>
      <Route path="/promociones/lista/:sucursalId" element={<ListaPromocion />} />
      <Route path="/sucursal/:empresaId" element={<><BaseNavBar title="Sucursales" /><ListaSucursal /></>} />
    </Routes>
  );
};
export default AppRouter;
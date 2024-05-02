import Sidebar from '../components/Sider/SideBar'
import { Route, Routes } from 'react-router-dom'
import { ListaProductos } from '../components/Productos/ListaProductos'

export const AppRouter = () => {
  return (
    <>
      <Sidebar />
      {/* Definición de las rutas */}
      <Routes>

        {/* Ruta para la pantalla de personas */}
        <Route path="/productos/lista" element={<ListaProductos />} />
      </Routes>
    </>
  )
}

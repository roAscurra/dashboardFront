import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { CContainer, CRow, CCol } from '@coreui/react';
import Sidebar from './components/ui/Sider/SideBar';
import AppRouter from './routes/AppRouter';

const AppContent = () => {
  const location = useLocation();
  const hideSidebarPaths = ["/"]; // Ocultar sidebar en la ruta raíz

  const shouldShowSidebar = !hideSidebarPaths.some(path => location.pathname === path);

  return (
    <CContainer fluid>
      <CRow>
        {shouldShowSidebar && (
          <CCol xs="auto" className="sidebar">
            <Sidebar />
          </CCol>
        )}
        <CCol>
          <AppRouter />
        </CCol>
      </CRow>
    </CContainer>
  );
}

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

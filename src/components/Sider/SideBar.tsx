import React from "react";
import { Link } from "react-router-dom";
import * as icon from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CNavGroup,
  CNavItem,
  CNavTitle,
  CSidebar,
  CSidebarNav,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";

const Sidebar: React.FC = () => {
  return (
    <div>
      <CSidebar
        className="border-end d-flex flex-column"
        style={{ height: "100vh" }}
      >
        <CSidebarNav style={{ display: "flex", flexDirection: "column" }}>
          <CNavTitle style={{ marginBottom: "10px" }}>Dashboard</CNavTitle>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "#ffeeba",
              color: "#856404",
              padding: "5px",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
          >
            <CNavItem>
              <Link
                to="/usuario"
                className="nav-link"
                style={{ color: "#856404" }}
              >
                <CIcon customClassName="nav-icon" icon={icon.cilPeople} />
                Usuarios
              </Link>
            </CNavItem>
          </div>
          <CNavItem>
            <Link to="/" className="nav-link">
              <CIcon customClassName="nav-icon" icon={icon.cilHamburgerMenu} />
              Inicio
            </Link>
          </CNavItem>
          <CNavItem>
            <Link to="/estadisticas" className="nav-link">
              <CIcon customClassName="nav-icon" icon={icon.cilChartPie} />
              Estadísticas
            </Link>
          </CNavItem>
          <CNavGroup
            toggler={
              <>
                <CIcon customClassName="nav-icon" icon={icon.cilFastfood} />
                Productos
              </>
            }
          >
            <CNavItem>
              <Link to="/productos/lista" className="nav-link">
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>
                Lista de Productos
              </Link>
            </CNavItem>
            <CNavItem>
              <Link to="/categorias" className="nav-link">
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>
                Categorías
              </Link>
            </CNavItem>
          </CNavGroup>
          <CNavItem>
              <Link
                to="/ArticuloInsumo/Lista"className="nav-link">
                <CIcon customClassName="nav-icon" icon={icon.cilClipboard} />
                Articulo Insumo
              </Link>
          </CNavItem>
          <CNavGroup
            toggler={
              <>
                <CIcon customClassName="nav-icon" icon={icon.cilBarChart} />
                Marketing
              </>
            }
          >
            <CNavItem>
              <Link to="/cupones/lista" className="nav-link">
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>
                Cupones
              </Link>
            </CNavItem>
            <CNavItem>
              <Link to="/promociones/lista" className="nav-link">
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>
                Promociones
              </Link>
            </CNavItem>
          </CNavGroup>
          <CNavGroup
            toggler={
              <>
                <CIcon customClassName="nav-icon" icon={icon.cilSettings} />
                Configuración
              </>
            }
          >
            <CNavItem>
              <Link to="/sucursales/lista" className="nav-link">
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>
                Sucursales
              </Link>
            </CNavItem>
          </CNavGroup>
        </CSidebarNav>
      </CSidebar>
    </div>
  );
};

export default Sidebar;

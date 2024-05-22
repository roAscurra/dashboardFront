import React from "react";
import { Link, useParams } from "react-router-dom";
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
  const { sucursalId } = useParams(); // Obtén el ID de la URL

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
                to={`/usuario/${sucursalId}`}
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
            <Link to={`/sucursales/lista/${sucursalId}`} className="nav-link">
              <CIcon customClassName="nav-icon" icon={icon.cilLocationPin} />
              Sucursales
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
              <Link to={`/productos/lista/${sucursalId}`} className="nav-link">
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>
                Lista de Productos
              </Link>
            </CNavItem>
            <CNavItem>
              <Link to={`/categorias/${sucursalId}`} className="nav-link">
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>
                Categorías
              </Link>
            </CNavItem>
          </CNavGroup>
          <CNavItem>
              <Link
                to={`/articuloInsumo/Lista/${sucursalId}`}className="nav-link">
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
              <Link to={`/promociones/lista/${sucursalId}`} className="nav-link">
                <span className="nav-icon">
                  <span className="nav-icon-bullet"></span>
                </span>
                Promociones
              </Link>
            </CNavItem>
          </CNavGroup>
          
        </CSidebarNav>
      </CSidebar>
    </div>
  );
};

export default Sidebar;

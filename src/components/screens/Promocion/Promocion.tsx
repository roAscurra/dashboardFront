import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux.ts";
import PromocionService from "../../../services/PromocionService.ts";
import Promocion from "../../../types/Promocion.ts";
import { setPromocion } from "../../../redux/slices/Promocion.ts";
import { toggleModal } from "../../../redux/slices/Modal.ts";
import SearchBar from "../../ui/SearchBar/SearchBar.tsx";
import TableComponent from "../../ui/Table/Table.tsx";
import ModalEliminarPromocion from "../../ui/Modal/Promocion/ModalEliminarPromocion.tsx";
import ModalPromocion from "../../ui/Modal/Promocion/ModalPromocion.tsx";
import { handleSearch } from "../../../utils.ts/utils.ts";
import { CCol, CContainer, CRow } from "@coreui/react";
import { BaseNavBar } from "../../ui/common/BaseNavBar.tsx";
import Sidebar from "../../ui/Sider/SideBar.tsx";
import { useParams } from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

export const ListaPromocion = () => {
  const { getAccessTokenSilently } = useAuth0();
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const promocionService = new PromocionService();
  const [filterData, setFilterData] = useState<Row[]>([]);
  const [promocionToEdit, setPromocionToEdit] = useState<Promocion | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const globalPromocion = useAppSelector(
    (state) => state.promocion.data
  );
  const { sucursalId } = useParams(); // Obtén el ID de la sucursal de la URL


// Función para abrir la modal de eliminación
const handleOpenDeleteModal = (rowData: Row) => {
  setPromocionToEdit({
    id: rowData.id,
    eliminado: rowData.eliminado,
    denominacion: rowData.denominacion,
    horaDesde: rowData.horaDesde,
    horaHasta: rowData.horaHasta,
    fechaDesde: rowData.fechaDesde,
    fechaHasta: rowData.fechaHasta,
    descripcionDescuento: rowData.descripcionDescuento,
    precioPromocional: rowData.precioPromocional,
    tipoPromocion: rowData.tipoPromocion,
    imagenes: rowData.imagenes,
    sucursales: rowData.sucursales,
    promocionDetalle: rowData.promocionDetalle
    });
  setDeleteModalOpen(true); // Utiliza el estado directamente para abrir la modal de eliminación
};
  const handleDelete = async () => {
    try {
      if (promocionToEdit && promocionToEdit.id) {
        await promocionService.delete(url + 'promocion', promocionToEdit.id.toString(), await getAccessTokenSilently({}));
        console.log('Se ha eliminado correctamente.');
        handleCloseDeleteModal(); // Cerrar el modal de eliminación
        fetchPromocion(); // Actualizar la lista de promociones después de la eliminación
      } else {
        console.error('No se puede eliminar la Promocion porque no se proporcionó un ID válido.');
      }
    } catch (error) {
      console.error('Error al eliminar la promocion:', error);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false); // Utiliza el estado directamente para cerrar la modal de eliminación
  };

   // Definiendo fetchSucursal con useCallback
   const fetchPromocion = useCallback(async () => {
    try { 
      // Si hay una sucursal seleccionada, filtrar las promociones por la sucursal
      if (sucursalId) {
        
        const sucursalIdNumber = parseInt(sucursalId);

        const promociones = await promocionService.promocionesSucursal(url, sucursalIdNumber, await getAccessTokenSilently({}));
        // Actualizar el estado con las promociones 
        dispatch(setPromocion(promociones));
        setFilterData(promociones);
      } 
  
    } catch (error) {
      console.error("Error al obtener las promociones:", error);
    }
  }, [dispatch, promocionService, sucursalId, url]);
  
  
  useEffect(() => {
    fetchPromocion();
    onSearch('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddPromocion = () => {
    // Reset promocionToEdit to null when adding a new cupon
    setPromocionToEdit(null);
    dispatch(toggleModal({ modalName: "modal" }));
  };

   // Función para abrir la modal de edición
// Definición de handleOpenEditModal
const handleOpenEditModal = (rowData: Row) => {
  setPromocionToEdit({
    id: rowData.id,
    eliminado: rowData.eliminado,
    denominacion: rowData.denominacion,
    horaDesde: rowData.horaDesde,
    horaHasta: rowData.horaHasta,
    fechaDesde: rowData.fechaDesde,
    fechaHasta: rowData.fechaHasta,
    descripcionDescuento: rowData.descripcionDescuento,
    precioPromocional: rowData.precioPromocional,
    tipoPromocion: rowData.tipoPromocion,
    imagenes: rowData.imagenes,
    sucursales: rowData.sucursales,
    promocionDetalle: rowData.promocionDetalle
  });
  dispatch(toggleModal({ modalName: 'modal' }));
};

const onSearch = (query: string) => {
  handleSearch(query, globalPromocion,  setFilterData);
};
  const columns: Column[] = [
    // { id: "id", label: "Id", renderCell: (rowData) => <>{rowData.id}</> },
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <>{rowData.denominacion}</> },
    { id: "horaDesde", label: "Fecha Desde", renderCell: (rowData) => <>{rowData.horaDesde}</> },
    { id: "horaHasta", label: "Fecha Desde", renderCell: (rowData) => <>{rowData.horaHasta}</> },
    { id: "fechaDesde", label: "Fecha Desde", renderCell: (rowData) => <>{rowData.fechaDesde}</> },
    { id: "fechaHasta", label: "Fecha Hasta", renderCell: (rowData) => <>{rowData.fechaHasta}</> },
    { id: "descripcionDescuento", label: "Descripcion Descuento", renderCell: (rowData) => <>{rowData.descripcionDescuento}</> },
    { id: "precioPromocional", label: "Precio Promocional", renderCell: (rowData) => <>{rowData.precioPromocional}</> },
    { id: "tipoPromocion", label: "Tipo Promoción", renderCell: (rowData) => <>{rowData.tipoPromocion}</> },
  ];

  return (
  <React.Fragment>
    <BaseNavBar title="" />
    <CContainer fluid style={{backgroundColor: "#fff"}}>
      <CRow>
        {/* Sidebar */}
        <CCol xs="auto" className="sidebar">
          <Sidebar />
        </CCol>
        <CCol>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              my: 2,
            }}
          >
            <Container maxWidth="lg">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  my: 1,
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Promociones
                </Typography>
                <Button
                  sx={{
                    bgcolor: "#9c27b0",
                    "&:hover": {
                      bgcolor: "#9c27b0",
                    },
                  }}
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddPromocion}
                >
                  Promocion
                </Button>
              </Box>
              <Box sx={{ mt: 2 }}>
                <SearchBar onSearch={onSearch} />
              </Box> 
              <TableComponent
                data={filterData}
                columns={columns}
                handleOpenEditModal={handleOpenEditModal}
                handleOpenDeleteModal={handleOpenDeleteModal} // Pasa la función para abrir la modal de eliminación
                isListaPedidos={false}
                
              />
              <ModalEliminarPromocion show={deleteModalOpen} onHide={handleCloseDeleteModal} promocion={promocionToEdit} onDelete={handleDelete} />
              {/* Llamando a ModalPromocion con la prop fetchPromocion y promocionToEdit */}
              <ModalPromocion getPromocion={fetchPromocion} promocionToEdit={promocionToEdit !== null ? promocionToEdit : undefined} />
            </Container>
          </Box>
        </CCol>
      </CRow>
    </CContainer>
  </React.Fragment>
  );
}
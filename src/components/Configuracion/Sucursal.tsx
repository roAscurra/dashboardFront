import { useCallback, useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch } from "../../hooks/redux";
import TableComponent from '../Table/Table';
import SearchBar from "../SearchBar/SearchBar";
import { setSucursal } from "../../redux/slices/Sucursal";
import SucursalService from "../../services/SucursalService";
import { toggleModal } from "../../redux/slices/Modal";
import Sucursal from "../../types/Sucursal";
import ModalEliminarSucursal from "../Modal/ModalEliminarSucursal";
import ModalSucursal from "../Modal/ModalSucursal";


interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}


export const ListaSucursal = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const sucursalService = new SucursalService();
  const [filterData, setFilterData] = useState<Row[]>([]);
  const [sucursalToEdit, setSucursalToEdit] = useState<Sucursal | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);


  // Función para abrir la modal de eliminación
  const handleOpenDeleteModal = (rowData: Row) => {
    setSucursalToEdit({
      id: rowData.id,
      denominacion: rowData.denominacion,
      horarioApertura: rowData.horarioApertura,
      horarioCierre: rowData.horarioCierre,
      sucursal: rowData.sucursal

    });
    setDeleteModalOpen(true); // Utiliza el estado directamente para abrir la modal de eliminación
  };
  const handleDelete = async () => {
    try {
      if (sucursalToEdit && sucursalToEdit.id) {
        await sucursalService.delete(url + 'sucursales', sucursalToEdit.id.toString());
        console.log('Se ha eliminado correctamente.');
        handleCloseDeleteModal(); // Cerrar el modal de eliminación
        fetchSucursal(); // Actualizar la lista de sucursales después de la eliminación
      } else {
        console.error('No se puede eliminar la sucursal porque no se proporcionó un ID válido.');
      }
    } catch (error) {
      console.error('Error al eliminar la sucursal:', error);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false); // Utiliza el estado directamente para cerrar la modal de eliminación
  };

  // Definiendo fetchSucursales con useCallback
  const fetchSucursal = useCallback(async () => {
    try {
      const sucursales = await sucursalService.getAll(url + 'sucursales');
      dispatch(setSucursal(sucursales));
      setFilterData(sucursales);

    } catch (error) {
      console.error("Error al obtener la sucursal:", error);
    }
  }, [dispatch, sucursalService, url]);

  useEffect(() => {
    // Llamando a fetchSucursal dentro de useEffect
    fetchSucursal();
  }, [fetchSucursal]); // fetchSucursal se pasa como dependencia

  const handleAddSucursal = () => {
    // Reset sucursalToEdit to null when adding a new sucursal
    setSucursalToEdit(null);
    dispatch(toggleModal({ modalName: "modal" }));
  };

    // Función para abrir la modal de edición
// Definición de handleOpenEditModal
const handleOpenEditModal = (rowData: Row) => {
  setSucursalToEdit({
    id: rowData.id,
    denominacion: rowData.denominacion,
    horarioApertura: rowData.horarioApertura,
    horarioCierre: rowData.horarioCierre,
    sucursal: rowData.sucursal

  });
  dispatch(toggleModal({ modalName: 'modal' }));
};


const handleSearch = (query: string) => {
  const filtered = filterData.filter((item) =>
    item.descripcion.toLowerCase().includes(query.toLowerCase())
  );
  setFilterData(filtered);
};


const columns: Column[] = [
  { id: "id", label: "Id", renderCell: (rowData) => <>{rowData.id}</> },
  { id: "denominacion", label: "Denominacion", renderCell: (rowData) => <>{rowData.denominacion}</> },
  { id: "horarioApertura", label: "Horario apertura", renderCell: (rowData) => <>{rowData.fechaDesde}</> },
  { id: "horarioCierre", label: "Horario cierre", renderCell: (rowData) => <>{rowData.fechaHasta}</> },
  { id: "sucursal", label: "Sucursal", renderCell: (rowData) => <>{rowData.descripcionDescuento}</> },
 
];

return (
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
          Sucursales
        </Typography>
        <Button
          sx={{
            bgcolor: "#cc5533",
            "&:hover": {
              bgcolor: "#b23e1f",
            },
          }}
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddSucursal}
        >
          Sucursal
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        <SearchBar onSearch={handleSearch} />
      </Box> 
      <TableComponent
        data={filterData}
        columns={columns}
        handleOpenEditModal={handleOpenEditModal}
        handleOpenDeleteModal={handleOpenDeleteModal} // Pasa la función para abrir la modal de eliminación
      />
      <ModalEliminarSucursal show={deleteModalOpen} onHide={handleCloseDeleteModal} sucursal={sucursalToEdit} onDelete={handleDelete} />


      {/* Llamando a ModalSucursal con la prop fetchSucursal y sucursalToEdit */}
      <ModalSucursal getSucursal={fetchSucursal} sucursalToEdit={sucursalToEdit !== null ? sucursalToEdit : undefined} />
    </Container>
  </Box>
);
}


import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import {useAppDispatch, useAppSelector} from "../../../../hooks/redux.ts";
import TableComponent from "../../../ui/Table/Table.tsx";
import SearchBar from "../../../ui/SearchBar/SearchBar.tsx";
import ModalCupon from "../../../ui/Modal/Cupon/ModalCupon.tsx";
import { toggleModal } from "../../../../redux/slices/Modal.ts";
import CuponesService from "../../../../services/CuponesService.ts";
import Cupones from "../../../../types/Cupones.ts";
import ModalEliminarCupon from "../../../ui/Modal/Cupon/ModalEliminarCupon.tsx";
import {handleSearch} from "../../../../utils.ts/utils.ts";
import {setCupon} from "../../../../redux/slices/Cupones.ts";

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

export const ListaCupones = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const cuponesService = new CuponesService();
  const [filterData, setFilterData] = useState<Row[]>([]);
  const [cuponToEdit, setCuponToEdit] = useState<Cupones | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const globalCupones = useAppSelector(
      (state) => state.cupones.data
  );
  // Función para abrir la modal de eliminación
  const handleOpenDeleteModal = (rowData: Row) => {
    setCuponToEdit({
      id: rowData.id,
      denominacion: rowData.denominacion,
      fechaDesde: rowData.fechaDesde,
      fechaHasta: rowData.fechaHasta,
      descripcion: rowData.descripcion
    });
    setDeleteModalOpen(true); // Utiliza el estado directamente para abrir la modal de eliminación
  };
  const handleDelete = async () => {
    try {
      if (cuponToEdit && cuponToEdit.id) {
        await cuponesService.delete(url + 'cupones', cuponToEdit.id.toString());
        console.log('Se ha eliminado correctamente.');
        handleCloseDeleteModal(); // Cerrar el modal de eliminación
        fetchCupones(); // Actualizar la lista de cupones después de la eliminación
      } else {
        console.error('No se puede eliminar el cupón porque no se proporcionó un ID válido.');
      }
    } catch (error) {
      console.error('Error al eliminar el cupón:', error);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false); // Utiliza el estado directamente para cerrar la modal de eliminación
  };

  // Definiendo fetchCupones con useCallback
  const fetchCupones = useCallback(async () => {
    try {
      const cupones = await cuponesService.getAll(url + 'cupones');
      dispatch(setCupon(cupones));
      setFilterData(cupones);

    } catch (error) {
      console.error("Error al obtener los cupones:", error);
    }
  }, [dispatch, cuponesService, url]);

  useEffect(() => {
    // Llamando a fetchCupones dentro de useEffect
    fetchCupones();
    onSearch('');
  }, []); // fetchCupones se pasa como dependencia

  const handleAddCupon = () => {
    // Reset cuponToEdit to null when adding a new cupon
    setCuponToEdit(null);
    dispatch(toggleModal({ modalName: "modal" }));
  };



  // Función para abrir la modal de edición
// Definición de handleOpenEditModal
const handleOpenEditModal = (rowData: Row) => {
  setCuponToEdit({
    id: rowData.id,
    denominacion: rowData.denominacion,
    fechaDesde: rowData.fechaDesde,
    fechaHasta: rowData.fechaHasta,
    descripcion: rowData.descripcion
  });
  dispatch(toggleModal({ modalName: 'modal' }));
};

  const onSearch = (query: string) => {
    handleSearch(query, globalCupones,  setFilterData);
  };

  const columns: Column[] = [
    { id: "id", label: "Id", renderCell: (rowData) => <>{rowData.id}</> },
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <>{rowData.denominacion}</> },
    { id: "fechaDesde", label: "Fecha Desde", renderCell: (rowData) => <>{rowData.fechaDesde}</> },
    { id: "fechaHasta", label: "Fecha Hasta", renderCell: (rowData) => <>{rowData.fechaHasta}</> },
    { id: "descripcion", label: "Descripción", renderCell: (rowData) => <>{rowData.descripcion}</> }
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
            Cupones
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
            onClick={handleAddCupon}
          >
            Cupon
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
        />
        <ModalEliminarCupon show={deleteModalOpen} onHide={handleCloseDeleteModal} cupon={cuponToEdit} onDelete={handleDelete} />


        {/* Llamando a ModalCupon con la prop fetchCupones y cuponToEdit */}
        <ModalCupon getCupones={fetchCupones} cuponToEdit={cuponToEdit !== null ? cuponToEdit : undefined} />
      </Container>
    </Box>
  );
}


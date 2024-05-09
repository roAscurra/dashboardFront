import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import TableComponent from '../Table/Table';
import SearchBar from "../SearchBar/SearchBar";
import Sucursal, { setSucursal } from "../../redux/slices/Sucursal";
import SucursalesService from "../../services/SucursalService";
import { toggleModal } from "../../redux/slices/Modal";

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

export const Sucursales: React.FC = () => {
  // Obtiene la función de despacho de acciones de Redux.
  const dispatch = useAppDispatch();
  // Obtiene el estado global de Redux relacionado con las sucursales.
  const globalSucursales = useAppSelector(
    (state) => state.sucursales);
  const url = import.meta.env.VITE_API_URL;
  const sucursalesService = new SucursalesService();

  // Estado local para almacenar los datos filtrados.
  const [filteredData, setFilteredData] = useState<Row[]>([]);
  //const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Efecto que se ejecuta al cargar el componente o al cambiar el término de búsqueda.
  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        // Obtiene todas las sucursales.
        const sucursales = await sucursalesService.getAll(url + 'sucursales')
        // Establece los datos filtrados para su visualización.
        setFilteredData(sucursales);
        // Envía las sucursales al estado global de Redux.
        dispatch(setSucursal(sucursales));
      } catch (error) {
        console.error("Error al obtener las sucursales:", error);
      }
    };

    fetchSucursales();
  }, [dispatch, sucursalesService, url]);

  // Función para manejar la búsqueda de sucursales.
  const handleSearch = (query: string) => {
    // Filtra las sucursales globales según la consulta de búsqueda.
    const filtered = globalSucursales.sucursal.filter((sucursales: any) =>
      sucursales.denominacion.toLowerCase().includes(query.toLowerCase())
    );

    console.log("hola conii")

    // Establece los datos filtrados para su visualización.
    setFilteredData(filtered);
  };

  const handleAddSucursal = () => {
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleOpenDeleteModal = () => {

   // setDeleteModalOpen(true);
  };

  const handleOpenEditModal = () => {

    dispatch(toggleModal({ modalName: 'modal' }));
  };


  // Columnas de la tabla de sucursales.
  const columns: Column[] = [
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <>{rowData.denominacion}</> },
    { id: "horarioApertura", label: "Horario apertura", renderCell: (rowData) => <>{rowData.fechaDesde}</> },
    { id: "horarioCierre", label: "Horario cierre", renderCell: (rowData) => <>{rowData.fechaHasta}</> },
    { id: "sucursal", label: "Sucursal", renderCell: (rowData) => <>{rowData.descripcionDescuento}</> },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 2 }}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
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
            Sucursales
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={handleSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} handleOpenDeleteModal={handleOpenDeleteModal} handleOpenEditModal={handleOpenEditModal} />
        {/* Llamando a ModalSucursal con la prop fetchSucursales */}
      </Container>
    </Box>
  );
};


export default Sucursal;
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import TableComponent from "../Table/Table";
import SearchBar from "../SearchBar/SearchBar";
import { setPromocion } from "../../redux/slices/Promocion";
import PromocionType from "../../types/Promocion";
import PromocionService from "../../services/PromocionService";
import { toggleModal } from "../../redux/slices/Modal";
import ModalPromocion from "../Modal/ModalPromociones";
import { useCallback } from 'react';

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

export const Promocion: React.FC = () => {
  // Obtiene la función de despacho de acciones de Redux.
  const dispatch = useAppDispatch();
  // Obtiene el estado global de Redux relacionado con las promociones.
  const globalPromociones = useAppSelector(
    (state) => state.promocion);
  const url = import.meta.env.VITE_API_URL;
  const promocionService = new PromocionService();

  // Estado local para almacenar los datos filtrados.
  const [filteredData, setFilteredData] = useState<Row[]>([]);

  // Efecto que se ejecuta al cargar el componente o al cambiar el término de búsqueda.
useEffect(() => {
  const fetchPromociones = async () => {
    try {
      // Obtiene todas las promociones.
      const promociones = await promocionService.getAll(url + 'promociones')       
      // Establece los datos filtrados para su visualización.
      setFilteredData(promociones); 
      // Envía las promociones al estado global de Redux.
      dispatch(setPromocion(promociones)); 
    } catch (error) {
      console.error("Error al obtener las promociones:", error);
    }
  };

  fetchPromociones();
}, [dispatch, promocionService, url]);

 // Función para manejar la búsqueda de promociones.
 const handleSearch = (query: string) => {
  // Filtra las promociones globales según la consulta de búsqueda.
  const filtered = globalPromociones.promocion.filter((promociones:any) =>
    promociones.denominacion.toLowerCase().includes(query.toLowerCase())
  );

  console.log("hola")

  // Establece los datos filtrados para su visualización.
  setFilteredData(filtered);
};

  const handleAddPromocion = () => {
    dispatch(toggleModal({ modalName: "modal" }));
  };

  
  // Columnas de la tabla de promociones.
  const columns: Column[] = [
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <>{rowData.denominacion}</> },
    { id: "fechaDesde", label: "Desde", renderCell: (rowData) => <>{rowData.fechaDesde}</> },
    { id: "fechaHasta", label: "Hasta", renderCell: (rowData) => <>{rowData.fechaHasta}</> },
    { id: "descripcionDescuento", label: "Descripción Descuento", renderCell: (rowData) => <>{rowData.descripcionDescuento}</> },
    { id: "precioPromocional", label: "Precio Promocional", renderCell: (rowData) => <>{rowData.precioPromocional}</> },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 2}}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
          <Typography variant="h5" gutterBottom>
            Promociones
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
            onClick={handleAddPromocion}
          >
            Promoción
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={handleSearch} />
        </Box>
        <TableComponent data={filteredData} columns={columns} />
           {/* Llamando a ModalCupon con la prop fetchCupones */}
           <ModalPromocion getPromociones={setPromocion} />
      </Container>
    </Box>
  );
};


export default Promocion;
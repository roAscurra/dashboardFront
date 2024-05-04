import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch } from "../../hooks/redux";
import TableComponent from "../Table/Table";
import SearchBar from "../SearchBar/SearchBar";
import { setCupones } from "../../redux/slices/Cupones";
import SucursalService from "../../services/SucursalService";
import Cupones from "../../types/Cupones";
import ModalCupon from "../Modal/ModalCupon";
import { toggleModal } from "../../redux/slices/Modal";
import CuponesService from "../../services/CuponesService";

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

  // Definiendo fetchCupones con useCallback
  const fetchCupones = useCallback(async () => {
    try {
      const sucursales = await cuponesService.getAll(url + 'cupones');
      dispatch(setCupones(sucursales));
      setFilterData(sucursales);

    } catch (error) {
      console.error("Error al obtener los cupones:", error);
    }
  }, [dispatch, cuponesService, url]);

  useEffect(() => {
    // Llamando a fetchCupones dentro de useEffect
    fetchCupones();
  }, [fetchCupones]); // fetchCupones se pasa como dependencia

  const handleAddCupon = () => {
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleSearch = (query: string) => {
    const filtered = filterData.filter((item) =>
      item.descripcion.toLowerCase().includes(query.toLowerCase())
    );
    setFilterData(filtered);
  };

  const columns: Column[] = [
    { id: "id", label: "Id", renderCell: (rowData) => <>{rowData.id}</> },
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <>{rowData.denominacion}</> },
    { id: "fechaDesde", label: "Fecha Desde", renderCell: (rowData) => <>{rowData.fechaDesde}</> },
    { id: "fechaHasta", label: "Fecha Hasta", renderCell: (rowData) => <>{rowData.fechaHasta}</> },
    { id: "descripcion", label: "Descripción", renderCell: (rowData) => <>{rowData.descripcion}</> },
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
          <SearchBar onSearch={handleSearch} />
        </Box> 
        <TableComponent data={filterData} columns={columns} />
        {/* Llamando a ModalCupon con la prop fetchCupones */}
        <ModalCupon getCupones={fetchCupones} />
      </Container>
    </Box>
  );
}

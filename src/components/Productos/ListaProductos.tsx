import { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setArticuloManufacturado } from "../../redux/slices/ArticuloManufacturado";
import TableComponent from "../Table/Table";
import ProductoService from "../../services/ProductoService";
import SearchBar from "../SearchBar/SearchBar";

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

export const ListaProductos = () => {

  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const productoService = new ProductoService();
  // Estado global de Redux
  const globalArticulosManufacturados = useAppSelector(
    (state) => state.articuloManufacturado.articuloManufacturado
  );

  const [filteredData, setFilteredData] = useState<Row[]>([]);

  useEffect(() => {
    // Función para obtener los artículos manufacturados
    const fetchArticulosManufacturados = async () => {
      try {
        const articulosManufacturados = await productoService.getAll(url + 'articulosManufacturados');
        dispatch(setArticuloManufacturado(articulosManufacturados));
        setFilteredData(articulosManufacturados);
      } catch (error) {
        console.error("Error al obtener los artículos manufacturados:", error);
      }
    };

    fetchArticulosManufacturados();
  }, [dispatch]);

  // Función para manejar la búsqueda de artículos manufacturados
  const handleSearch = (query: string) => {
    const filtered = globalArticulosManufacturados.filter((item) =>
      item.denominacion.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Definición de las columnas para la tabla de artículos manufacturados
  const columns: Column[] = [
    {
      id: "imagen",
      label: "Imagen",
      renderCell: (rowData) => (
        <img
          src={rowData.imagenes.length > 0 ? rowData.imagenes[0].url : ""}
          alt="Imagen"
          style={{ width: 50, height: 50 }}
        />
      ),
    },
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <>{rowData.denominacion}</> },
    { id: "precioVenta", label: "Precio", renderCell: (rowData) => <>{rowData.precioVenta}</> },
    { id: "descripcion", label: "Descripción", renderCell: (rowData) => <>{rowData.descripcion}</> },
    {
      id: "tiempoEstimadoMinutos",
      label: "Tiempo estimado en minutos",
      renderCell: (rowData) => <>{rowData.tiempoEstimadoMinutos}</>,
    },
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
            Productos
          </Typography>
          <Button
             sx={{
              bgcolor: "#cc5533", // Terracota
              "&:hover": {
                bgcolor: "#b23e1f", // Terracota más oscuro al pasar el mouse
              },
            }}
            variant="contained"
            startIcon={<Add />}
          >
            Producto
          </Button>
        </Box>
        {/* Barra de búsqueda */}
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={handleSearch} />
        </Box> 
        {/* Componente de tabla para mostrar los artículos manufacturados */}
        <TableComponent data={filteredData} columns={columns} />
      </Container>
    </Box>
  );
}

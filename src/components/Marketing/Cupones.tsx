import { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch } from "../../hooks/redux";
import TableComponent from "../Table/Table";
import SearchBar from "../SearchBar/SearchBar";
// import CuponesService from "../../services/CuponesService";
import { setCupones } from "../../redux/slices/Cupones";
import SucursalService from "../../services/SucursalService";
import Cupones from "../../types/Cupones";
// import ModalGeneric from "../Modal/ModalGeneric";

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
  const sucursalService = new SucursalService();
  // Estado global de Redux
//   const globalCupones = useAppSelector(
//     (state) => state.cupo
//   );

  const [filterData, setFilterData] = useState<Row[]>([]);

  useEffect(() => {
    // Función para obtener los artículos manufacturados
    const fetchCupones = async () => {
        try {
          const sucursales = await sucursalService.getAll(url + 'sucursales');
          const allCupones: { [key: number]: Cupones[] } = {};
      
          // Itera sobre cada sucursal
          sucursales.forEach(sucursal => {
            // Obtiene los cupones de la sucursal actual
            const sucursalCupones = sucursal.cupones;
            
            // Asigna los cupones de la sucursal al objeto allCupones
            allCupones[sucursal.id] = sucursalCupones;
          });
          
          // Envía los cupones al store de Redux
          dispatch(setCupones(allCupones));
          
          // Selecciona y muestra los cupones de la primera sucursal por defecto
          if (sucursales.length > 0) {
            setFilterData(allCupones[sucursales[0].id]);
          }
        } catch (error) {
          console.error("Error al obtener los cupones:", error);
        }
      };
      
    fetchCupones();
  }, [dispatch]);

  // Función para manejar la búsqueda de cupones
    const handleSearch = (query: string) => {
        const filtered = filterData.filter((item) =>
        item.descripcion.toLowerCase().includes(query.toLowerCase())
        );
        setFilterData(filtered);
    };
  
  
  // Definición de las columnas para la tabla de artículos manufacturados
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
              bgcolor: "#cc5533", // Terracota
              "&:hover": {
                bgcolor: "#b23e1f", // Terracota más oscuro al pasar el mouse
              },
            }}
            variant="contained"
            startIcon={<Add />}
          >
            Cupon
          </Button>
        </Box>
        {/* Barra de búsqueda */}
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={handleSearch} />
        </Box> 
        {/* Componente de tabla para mostrar los artículos manufacturados */}
        <TableComponent data={filterData} columns={columns} />
      </Container>
    </Box>
  );
}

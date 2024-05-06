import { useCallback, useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setArticuloManufacturado } from "../../redux/slices/ArticuloManufacturado";
import { toggleModal } from "../../redux/slices/Modal";
import TableComponent from "../Table/Table";
import ProductoService from "../../services/ProductoService";
import SearchBar from "../SearchBar/SearchBar";
import AManufacturado from "../../types/ArticuloManufacturado";
import ModalProducto from "../Modal/ModalProducto";
import ModalEliminarProducto from "../Modal/ModalEliminarProducto";

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
  const [productToEdit, setProductToEdit] = useState<AManufacturado | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = (rowData: Row) => {
    setProductToEdit({
      id: rowData.id,
      denominacion: rowData.denominacion,
      precioVenta: rowData.precioVenta,
      imagenes: rowData.imagenes,
      unidadMedida: rowData.unidadMedida,
      descripcion: rowData.descripcion,
      tiempoEstimadoMinutos: rowData.tiempoEstimadoMinutos,
      preparacion: rowData.preparacion,
      articuloManufacturadoDetalles: rowData.articuloManufacturado
    });
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false); // Utiliza el estado directamente para cerrar la modal de eliminación
  };

  const handleDelete = async () => {
    try {
      if (productToEdit && productToEdit.id) {
        await productoService.delete(url + 'productos', productToEdit.id.toString());
        console.log('Se ha eliminado correctamente.');
        handleCloseDeleteModal(); // Cerrar el modal de eliminación
        fetchProductos(); 
      } else {
        console.error('No se puede eliminar el producto porque no se proporcionó un ID válido.');
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };


  const fetchProductos = useCallback(async () => {
    try {
      const productos = await productoService.getAll(url + 'articulosManufacturados');
      dispatch(setArticuloManufacturado(productos));
      setFilteredData(productos);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  }, [dispatch, productoService, url]);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const handleAddProduct = () => {
    // Reset cuponToEdit to null when adding a new cupon
    setProductToEdit(null);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleOpenEditModal = (rowData: Row) => {
    setProductToEdit({
      id: rowData.id,
      denominacion: rowData.denominacion,
      precioVenta: rowData.precioVenta,
      imagenes: rowData.imagenes,
      unidadMedida: rowData.unidadMedida,
      descripcion: rowData.descripcion,
      tiempoEstimadoMinutos: rowData.tiempoEstimadoMinutos,
      preparacion: rowData.preparacion,
      articuloManufacturadoDetalles: rowData.articuloManufacturado
    });
    dispatch(toggleModal({ modalName: 'modal' }));
  };


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
            onClick={handleAddProduct}
          >
            Producto
          </Button>
        </Box>
        {/* Barra de búsqueda */}
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={handleSearch} />
        </Box>
        {/* Componente de tabla para mostrar los artículos manufacturados */}
        <TableComponent data={filteredData} columns={columns} handleOpenDeleteModal={handleOpenDeleteModal} handleOpenEditModal={handleOpenEditModal} />

        {/* Llamando a ModalCupon con la prop fetchCupones y cuponToEdit */}
        <ModalProducto getProducts={fetchProductos} productToEdit={productToEdit !== null ? productToEdit : undefined} />

        <ModalEliminarProducto show={deleteModalOpen} onHide={handleCloseDeleteModal} product={productToEdit} onDelete={handleDelete} />
      </Container>
    </Box>
  );
}

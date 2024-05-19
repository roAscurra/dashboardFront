import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch } from "../../../hooks/redux";
import ArticuloInsumoService from "../../../services/ArticuloInsumoService";
import { setArticuloInsumo } from "../../../redux/slices/ArticuloInsumo";
import { toggleModal } from "../../../redux/slices/Modal";
import SearchBar from "../../ui/SearchBar/SearchBar";
import TableComponent from "../../ui/Table/Table";
import ModalEliminarArticuloInsumo from "../../ui/Modal/ArticuloInsumo/ModalEliminarArticuloInsumo.tsx";
import ModalArticuloInsumo from "../../ui/Modal/ArticuloInsumo/ModalArticuloInsumo.tsx";
import ArticuloInsumo from "../../../types/ArticuloInsumoType";

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

export const ListaArticulosInsumo = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const articuloInsumoService = new ArticuloInsumoService();
  const [filterData, setFilterData] = useState<Row[]>([]);
  const [articuloToEdit, setArticuloToEdit] = useState<ArticuloInsumo | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const handleOpenDeleteModal = (rowData: Row) => {
    setArticuloToEdit({
      id: rowData.id,
      denominacion: rowData.denominacion,
      precioVenta: rowData.precioVenta,
      imagenes: rowData.imagenes,
      precioCompra: rowData.precioCompra,
      stockActual: rowData.stockActual,
      stockMaximo: rowData.stockMaximo,
      esParaElaborar: rowData.esParaElaborar,
      unidadMedida: rowData.unidadMedida?.denominacion,
    });
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (articuloToEdit && articuloToEdit.id) {
        await articuloInsumoService.delete(
          url + "articulos-insumo",
          articuloToEdit.id.toString()
        );
        console.log("Artículo de insumo eliminado correctamente.");
        handleCloseDeleteModal();
        fetchArticulosInsumo();
      } else {
        console.error(
          "No se puede eliminar el artículo de insumo porque no se proporcionó un ID válido."
        );
      }
    } catch (error) {
      console.error("Error al eliminar el artículo de insumo:", error);
    }
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const fetchArticulosInsumo = useCallback(async () => {
    try {
      const articulosInsumo = await articuloInsumoService.getAll(
        url + "articulosInsumos"
      );
      console.log(articulosInsumo)
      dispatch(setArticuloInsumo(articulosInsumo));
      setFilterData(articulosInsumo);
    } catch (error) {
      console.error("Error al obtener los artículos de insumo:", error);
    }
  }, [dispatch, articuloInsumoService, url]);

  useEffect(() => {
    fetchArticulosInsumo();
  }, [fetchArticulosInsumo]);

  const handleAddArticuloInsumo = () => {
    setArticuloToEdit(null);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleOpenEditModal = (rowData: Row) => {
    setArticuloToEdit({
      id: rowData.id,
      denominacion: rowData.denominacion,
      precioVenta: rowData.precioVenta,
      imagenes: rowData.imagenes,
      precioCompra: rowData.precioCompra,
      stockActual: rowData.stockActual,
      stockMaximo: rowData.stockMaximo,
      esParaElaborar: rowData.esParaElaborar,
      unidadMedida: rowData.unidadMedida?.denominacion,
    });
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleSearch = (query: string) => {
    const filtered = filterData.filter((item) =>
      item.denominacion.toLowerCase().includes(query.toLowerCase())
    );
    setFilterData(filtered);
  };

  // const columns: Column[] = [
  //   { id: "id", label: "Id", renderCell: (rowData) => <>{rowData.id}</> },
  //   {
  //     id: "denominacion",
  //     label: "Nombre",
  //     renderCell: (rowData) => <>{rowData.denominacion}</>,
  //   },
  //   {
  //     id: "precioVenta",
  //     label: "Precio de Venta",
  //     renderCell: (rowData) => <>{rowData.precioVenta}</>,
  //   },
  //   {
  //     id: "imagenes",
  //     label: "Imágenes",
  //     renderCell: (rowData) => (
  //       <>
  //         {rowData.imagenes.map((imagen: string, index: number) => (
  //           <img key={index} src={imagen} alt={`Imagen ${index}`} />
  //         ))}
  //       </>
  //     ),
  //   },
  //   {
  //     id: "unidadMedida",
  //     label: "Unidad de Medida",
  //     renderCell: (rowData) => <>{rowData.unidadMedida.nombre}</>,
  //   },
  //   {
  //     id: "precioCompra",
  //     label: "Precio de Compra",
  //     renderCell: (rowData) => <>{rowData.precioCompra}</>,
  //   },
  //   {
  //     id: "stockActual",
  //     label: "Stock Actual",
  //     renderCell: (rowData) => <>{rowData.stockActual}</>,
  //   },
  //   {
  //     id: "stockMaximo",
  //     label: "Stock Máximo",
  //     renderCell: (rowData) => <>{rowData.stockMaximo}</>,
  //   },
  //   {
  //     id: "esParaElaborar",
  //     label: "¿Es para Elaborar?",
  //     renderCell: (rowData) => <>{rowData.esParaElaborar ? "Sí" : "No"}</>,
  //   },
  //   {
  //     id: "acciones",
  //     label: "Acciones",
  //     renderCell: (rowData) => (
  //       <div>
  //         <Button onClick={() => handleOpenEditModal(rowData)}>Editar</Button>
  //       </div>
  //     ),
  //   },
  // ];
  const columns: Column[] = [
    { id: "id", label: "Id", renderCell: (rowData) => <>{rowData.id}</> },
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <>{rowData.denominacion}</> },
    { id: "precioVenta", label: "Precio Venta", renderCell: (rowData) => <>{rowData.precioVenta}</> },
    { id: "precioCompra", label: "Precio Compra", renderCell: (rowData) => <>{rowData.precioCompra}</> },
    { id: "stockActual", label: "Stock Actual", renderCell: (rowData) => <>{rowData.stockActual}</> },
    { id: "stockMaximo", label: "Stock Maximo", renderCell: (rowData) => <>{rowData.stockMaximo}</> },
    // { id: "unidadMedida", label: "Unidad de Medida", renderCell: (rowData) => <>{rowData.unidadMedida ? rowData.unidadMedida.denominacion : ""}</> },

    // Agregar columna de acciones para editar
    // { id: "acciones", label: "Acciones", renderCell: (rowData) => (
    //   <div>
    //     <Button onClick={() => handleOpenEditModal(rowData)}>Editar</Button>
    //   </div>

    // )},
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
            Artículos de Insumo
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
            onClick={handleAddArticuloInsumo}
          >
            Nuevo Artículo
          </Button>
        </Box>
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={handleSearch} />
        </Box>
        <TableComponent
          data={filterData}
          columns={columns}
          handleOpenEditModal={handleOpenEditModal}
          handleOpenDeleteModal={handleOpenDeleteModal}
        />
        <ModalEliminarArticuloInsumo
          show={deleteModalOpen}
          onHide={handleCloseDeleteModal}
          articuloInsumo={articuloToEdit}
          onDelete={handleDelete}
        />
        <ModalArticuloInsumo
          getArticulosInsumo={fetchArticulosInsumo}
          articuloToEdit={articuloToEdit !== null ? articuloToEdit : undefined}
        />
      </Container>
    </Box>
  );
};

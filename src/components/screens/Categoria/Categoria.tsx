import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import SearchBar from "../../ui/SearchBar/SearchBar";
import CategoriaService from "../../../services/CategoriaService";
import CategoriaLista from "./CategoriaLista";
import ModalCategoria from "../../ui/Modal/Categoria/ModalCategoria.tsx";
import ModalEliminarCategoria from "../../ui/Modal/Categoria/ModalEliminarCategoria.tsx";
import ICategoria from "../../../types/Categoria";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setCategoria } from "../../../redux/slices/Categoria";
import { handleSearch } from "../../../utils.ts/utils.ts";
import { CCol, CContainer, CRow } from "@coreui/react";
import Sidebar from "../../ui/Sider/SideBar.tsx";
import { BaseNavBar } from "../../ui/common/BaseNavBar.tsx";
import { useParams } from "react-router-dom";

const Categoria = () => {
  const url = import.meta.env.VITE_API_URL;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const categoriaService = new CategoriaService();
  const dispatch = useAppDispatch();
  const [filteredData, setFilterData] = useState<ICategoria[]>([]);
  const globalCategorias = useAppSelector((state) => state.categoria.data);
  const [selectedCategoria, setSelectedCategoria] = useState<ICategoria | null>(
    null
  );
  // const selectedSucursal = useAppSelector((state) => state.sucursales.selected);
  const { sucursalId } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [eliminarModalOpen, setEliminarModalOpen] = useState(false);

  const fetchCategorias = useCallback(async () => {
    try {
      const categorias = await categoriaService.getAll(url + "categoria");

      const categoriasNoEliminadas = categorias.filter(
        (categoria) => !categoria.eliminado
      );

      if (sucursalId) {
        const parsedSucursalId = parseInt(sucursalId, 10);

        const categoriasFiltradas = categoriasNoEliminadas.filter((categoria) =>
          categoria.sucursales.some(
            (sucursal) => sucursal.id === parsedSucursalId
          )
        );

        dispatch(setCategoria(categoriasFiltradas));
        setFilterData(categoriasFiltradas);
      } else {
        dispatch(setCategoria(categoriasNoEliminadas));
        setFilterData(categoriasNoEliminadas);
      }
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  }, [dispatch, categoriaService, url, sucursalId]);

  useEffect(() => {
    fetchCategorias();
    onSearch(""); // Llamada a onSearch para filtrar los datos iniciales
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditarCategoria = (categoria: ICategoria) => {
    setSelectedCategoria(categoria);
    setModalOpen(true);
  };

  const handleAgregarCategoria = () => {
    setSelectedCategoria(null);
    setModalOpen(true);
  };
  const handleAgregarSubCategoria = () => {
    setSelectedCategoria(null);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleEliminarCategoria = (categoria: ICategoria) => {
    setSelectedCategoria(categoria);
    setModalOpen(false);
    setEliminarModalOpen(true);
  };

  const handleEliminar = async () => {
    try {
      if (selectedCategoria && selectedCategoria.id) {
        await categoriaService.delete(
          url + "categoria",
          selectedCategoria.id.toString()
        );
        console.log("Se ha eliminado correctamente.");
        handleCloseModal(); // Cerramos el modal después de eliminar
      } else {
        console.error(
          "No se puede eliminar la categoría porque no se proporcionó un ID válido."
        );
      }
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
    }
  };

  const onSearch = (query: string) => {
    handleSearch(query, globalCategorias, setFilterData);
  };

  return (
    <React.Fragment>
      <BaseNavBar title="" />
      <CContainer fluid>
        <CRow>
          {/* Sidebar */}
          <CCol xs="auto" className="sidebar">
            <Sidebar />
          </CCol>
          <CCol>
            <Box component="main" sx={{ flexGrow: 1, my: 2 }}>
              <Container>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    my: 1,
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Categorías
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
                    onClick={handleAgregarCategoria}
                  >
                    Categoría
                  </Button>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <SearchBar onSearch={onSearch} />
                </Box>
                <CategoriaLista
                  categorias={filteredData}
                  onEditar={handleEditarCategoria}
                  onDelete={handleEliminarCategoria}
                  onAddSubCategoria={handleAgregarSubCategoria}
                  getCategories={() => fetchCategorias()}
                />
                <ModalCategoria
                  open={modalOpen}
                  onClose={handleCloseModal}
                  getCategories={() => fetchCategorias()}
                  categoryToEdit={selectedCategoria}
                />
                <ModalEliminarCategoria
                  show={eliminarModalOpen}
                  categoria={selectedCategoria}
                  onDelete={() => {
                    setEliminarModalOpen(false);
                    handleEliminar();
                  }}
                  onClose={() => setEliminarModalOpen(false)}
                />
              </Container>
            </Box>
          </CCol>
        </CRow>
      </CContainer>
    </React.Fragment>
  );
};

export default Categoria;

import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Button, Container, CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch } from "../../hooks/redux";
import TableComponent from "../Table/Table";
import SearchBar from "../SearchBar/SearchBar";
import UsuarioService from "../../services/UsuarioService";
import Usuario, { setUsuarios } from "../../redux/slices/Usuario";
import ModalUsuario from "../Modal/ModalUsuario";

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

export const ListaUsuarios = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const usuarioService = new UsuarioService();
  const [filterData, setFilterData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar la apertura y cierre del modal

  // Definiendo fetchUsuarios con useCallback
  const fetchUsuarios = useCallback(async () => {
    try {
      const usuarios = await usuarioService.getAll(url + 'usuarios');
      dispatch(setUsuarios(usuarios));
      setFilterData(usuarios);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      setLoading(false);
    }
  }, [dispatch, usuarioService, url]);

  useEffect(() => {
    // Llamando a fetchUsuarios dentro de useEffect
    fetchUsuarios();
  }, [fetchUsuarios]); // fetchUsuarios se pasa como dependencia

  const handleAddUsuario = () => {
    // Abre el modal al hacer clic en el botón Usuario
    setModalOpen(true);
  };

  const handleSearch = (query: string) => {
    const filtered = filterData.filter((item) =>
      item.nombre.toLowerCase().includes(query.toLowerCase())
    );
    setFilterData(filtered);
  };

  const handleCloseModal = () => {
    // Cierra el modal
    setModalOpen(false);
  };

  const columns: Column[] = [
    { id: "id", label: "Id", renderCell: (rowData) => <>{rowData.id || ""}</> },
    { id: "nombre", label: "Nombre", renderCell: (rowData) => <>{rowData.nombre || ""}</> },
    { id: "apellido", label: "Apellido", renderCell: (rowData) => <>{rowData.apellido || ""}</> },
    { id: "email", label: "Correo Electrónico", renderCell: (rowData) => <>{rowData.email || ""}</> },
    { id: "rol", label: "Rol", renderCell: (rowData) => <>{rowData.rol || ""}</> },
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
            mb: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Usuarios
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
            onClick={handleAddUsuario}
          >
            Usuario
          </Button>
        </Box>

        {/* Barra de búsqueda */}
        <Box sx={{ mb: 2 }}>
          <SearchBar onSearch={handleSearch} />
        </Box> 

        {/* Tabla de usuarios */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableComponent data={filterData} columns={columns} />
        )}

        {/* Modal de Usuario */}
        <ModalUsuario open={modalOpen} onClose={handleCloseModal} getUsuarios={fetchUsuarios} />
      </Container>
    </Box>
  );
}

export default ListaUsuarios;

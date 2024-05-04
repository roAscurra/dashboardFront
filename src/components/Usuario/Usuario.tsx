import React, { useEffect, useState } from "react";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import TableComponent from "../Table/Table";
import SearchBar from "../SearchBar/SearchBar";
import usuarioService from "../../services/UsuarioService";
import { setUsuarios } from "../../redux/slices/Usuario";

const Usuarios = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const globalUsuarios = useAppSelector((state) => state.usuarios.usuarios);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState(globalUsuarios);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const usuarios = await usuarioService.getAll(url + 'usuarios');
        dispatch(setUsuarios(usuarios));
        setFilteredData(usuarios);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener los usuarios:", error);
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, [dispatch]);

  const handleSearch = (query: string) => {
    const filtered = globalUsuarios.filter((usuario) =>
      usuario.nombre.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const columns = [
    { id: 'nombre', label: 'Nombre' },
    { id: 'apellido', label: 'Apellido' },
    { id: 'email', label: 'Correo Electrónico' },
    { id: 'rol', label: 'Rol' },
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
        <Typography variant="h5" gutterBottom>
          Usuarios
        </Typography>
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
          <TableComponent data={filteredData} columns={columns} />
        )}
      </Container>
    </Box>
  );
}

export default Usuarios;

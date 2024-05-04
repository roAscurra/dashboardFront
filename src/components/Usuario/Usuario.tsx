import React, { useState } from 'react';
import { IconButton, Box, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Usuarios: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Aquí iría la lógica para obtener y mostrar los usuarios en la tabla

  return (
    <div className="usuarios">
      <div className="contendor-titulo">
        <h2 className="titulo">Usuarios</h2>
      </div>
      <div className="busqueda">
        <TextField
          label="Buscar"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Apellido</th>
            <th scope="col">Correo electrónico</th>
            <th scope="col">Rol</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Aquí iría la lógica para mapear y mostrar los usuarios en la tabla */}
          <tr>
            <td>Juan</td>
            <td>Pérez</td>
            <td>juan@example.com</td>
            <td><span className="badge bg-primary rounded-pill">Administrador</span></td>
            <td>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton aria-label="editar">
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="eliminar">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </td>
          </tr>
          {/* Otros usuarios */}
        </tbody>
      </table>
      {/* Modales de Modificación y Eliminación */}
    </div>
  );
}

export default Usuarios;

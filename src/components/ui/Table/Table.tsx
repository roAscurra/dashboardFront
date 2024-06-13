import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell, TablePagination, IconButton, Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth0 } from '@auth0/auth0-react';
import Usuario from '../../../types/Usuario';
import UsuarioService from '../../../services/UsuarioService';
import PedidoService from '../../../services/PedidoService';
import { Estado } from '../../../types/enums/Estado';

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

interface Props {
  data: Row[];
  columns: Column[];
  handleOpenEditModal: (rowData: Row) => void;
  handleOpenDeleteModal: (rowData: Row) => void; // Nueva prop para manejar la apertura de la modal de eliminación
  isListaPedidos?: boolean;
}

const TableComponent: React.FC<Props> = ({ data, columns, handleOpenEditModal, handleOpenDeleteModal, isListaPedidos }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { user, isLoading, isAuthenticated } = useAuth0();
  const [usuario, setUsuario] = useState<Usuario>();
  const usuarioService = new UsuarioService();
  const [usuarioIsLoading, setUsuarioIsLoading] = useState<boolean>(true);
  const [rolUsuario, setRolUsuario] = useState<string | undefined>();
  const url = import.meta.env.VITE_API_URL;
  const { getAccessTokenSilently } = useAuth0();
  const [facturaCreada, setFacturaCreada] = useState(false);
  const pedidoService = new PedidoService();

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchUsuario = async () => {
    try {
      const usuario = await usuarioService.getByEmail(url + "usuarioCliente/role/" + user?.email, {
        headers: {
          Authorization: `Bearer ${await getAccessTokenSilently({})}`
        }
      });
      if (usuario) {
        setUsuario(usuario);
        setRolUsuario(usuario.rol);

      } else {
        // Manejar el caso en que usuario sea undefined
      }
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    } finally {
      setUsuarioIsLoading(false);
    }
  };

  const crearFactura = async (pedidoId: string) => {
    try {
      await pedidoService.crearFactura(url, pedidoId, await getAccessTokenSilently({}));
      setFacturaCreada(true);
      console.log(facturaCreada)
    } catch (error) {
      console.error('Error al crear la factura:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsuario();
      console.log(usuario);
    }
  }, [user]);

  if (isAuthenticated) {
    if (isLoading || usuarioIsLoading) {
      return (
        <div
          style={{ height: "calc(100vh - 88px)" }}
          className="d-flex flex-column justify-content-center align-items-center"
        >
          <div className="spinner-border" role="status"></div>
        </div>
      );
    }
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id}>{column.label}</TableCell>
            ))}
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.id}>
                  {column.renderCell ? column.renderCell(row) : row[column.id]}
                </TableCell>
              ))}
              <TableCell>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton aria-label="editar" onClick={() => handleOpenEditModal(row)}>
                    <EditIcon />
                  </IconButton>
                  {isListaPedidos && rolUsuario && (rolUsuario === 'ADMIN' || rolUsuario === 'CAJERO') && row.estado === Estado.FACTURADO && !row.factura && (
                  <Button
                  className="btn btn-primary"
                  onClick={() => crearFactura(row.id)}
                  style={{ backgroundColor: "#9c27b0", borderColor: "#9c27b0", color: "#fff" }}
                >
                  Generar Factura
                </Button>
                )}
                  {!isListaPedidos && (
                    <IconButton aria-label="eliminar" onClick={() => handleOpenDeleteModal(row)}>
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default TableComponent;

import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Button, Container, Tooltip, IconButton } from "@mui/material";
import { Add, AddCircle, Visibility } from "@mui/icons-material";
import { useAppDispatch } from "../../../hooks/redux";
import TableComponent from "../../ui/Table/Table";
import SearchBar from "../../ui/SearchBar/SearchBar";
import { setEmpresa } from "../../../redux/slices/Empresa";
import ModalEmpresa from "../../ui/Modal/Empresa/ModalEmpresa.tsx";
import { toggleModal } from "../../../redux/slices/Modal";
import EmpresaService from "../../../services/EmpresaService";
import Empresa from "../../../types/Empresa";
import ModalEliminarEmpresa from "../../ui/Modal/Empresa/ModalEliminarEmpresa.tsx";
import { Link } from "react-router-dom";
import ModalSucursal from "../../ui/Modal/Sucursal/ModalSucursal.tsx";

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

export const ListaEmpresa = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const empresaService = new EmpresaService();
  const [filteredData, setFilteredData] = useState<Empresa[]>([]);
  const [filterData, setFilterData] = useState<Row[]>([]);
  const [empresaToEdit, setEmpresaToEdit] = useState<Empresa | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchEmpresas = async () => {
    try {
      const empresas = await empresaService.getAll(url + '/empresas');
      dispatch(setEmpresa(empresas)); 
      setFilteredData(empresas); 
    } catch (error) {
      console.error("Error al obtener las empresas:", error);
    }
  }; 

  // Función para abrir la modal de eliminación
  const handleOpenDeleteModal = (rowData: Row) => {
    setEmpresaToEdit({
      id: rowData.id,
      nombre: rowData.nombre,
      razonSocial: rowData.razonSocial,
      cuil: rowData.cuil,
      sucursal: rowData.sucursal,
    });
    setDeleteModalOpen(true); // Utiliza el estado directamente para abrir la modal de eliminación
  };
  const handleDelete = async () => {
    try {
      if (empresaToEdit && empresaToEdit.id) {
        await empresaService.delete(url + 'empresa', empresaToEdit.id.toString());
        console.log('Se ha eliminado correctamente.');
        handleCloseDeleteModal(); 
        fetchEmpresa(); 
      } else {
        console.error('No se puede eliminar la empresa porque no se proporcionó un ID válido.');
      }
    } catch (error) {
      console.error('Error al eliminar la empresa:', error);
    }
  };
  
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false); // Utiliza el estado directamente para cerrar la modal de eliminación
  };

  
  const fetchEmpresa = useCallback(async () => {
    try {
      const empresa = await empresaService.getAll(url + 'empresas');
      dispatch(setEmpresa(empresa));
      setFilterData(empresa);

    } catch (error) {
      console.error("Error al obtener la empresa:", error);
    }
  }, [dispatch, empresaService, url]);

  useEffect(() => {
    
    fetchEmpresa();
  }, [fetchEmpresa]); 

  const handleAddEmpresa = () => {
    
    setEmpresaToEdit(null);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  

  // Función para abrir la modal de edición
// Definición de handleOpenEditModal
const handleOpenEditModal = (rowData: Row) => {
  setEmpresaToEdit({
    id: rowData.id,
    nombre: rowData.nombre,
    razonSocial: rowData.razonSocial,
    cuil: rowData.cuil,
    sucursal: rowData.sucursal,
  });
  dispatch(toggleModal({ modalName: 'modal' }));
};


  const handleSearch = (query: string) => {
    const filtered = filterData.filter((item) =>
      item.nombre.toLowerCase().includes(query.toLowerCase())
    );
    setFilterData(filtered);
  };

  const handleAddSucursal = () => {
    dispatch(toggleModal({ modalName: "modalSucursal" })); // Abre el modal de sucursales
  };

  const columns: Column[] = [
    { id: "id", label: "Id", renderCell: (rowData) => <>{rowData.id}</> },
    { id: "nombre", label: "Nombre", renderCell: (rowData) => <>{rowData.nombre}</> },
    { id: "razonSocial", label: "Razon Social", renderCell: (rowData) => <>{rowData.razonSocial}</> },
    { id: "cuil", label: "Cuil", renderCell: (rowData) => <>{rowData.cuil}</> },
    { id: "sucursales", label: "Sucursales", renderCell: (rowData) => (
        <>
        <Tooltip title="Ver Sucursales">
          {rowData?.sucursales?.length > 0 ? (
            <IconButton component={Link} to={`/empresas/${rowData.id}/sucursales`} aria-label="Ver Sucursales">
              <Visibility />
            </IconButton>
          ) : (
            <IconButton disabled aria-label="Ver Sucursales">
              <Visibility />
            </IconButton>
          )}
        </Tooltip>
        <Tooltip title="Agregar Sucursal">
            {/* Cambia el evento onClick para llamar a handleAddSucursal con el ID de la empresa */}
            <IconButton onClick={handleAddSucursal} aria-label="Agregar Sucursal">
              <AddCircle />
            </IconButton>
          </Tooltip>
        </>
      ), 
    }
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
            Empresas
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
            onClick={handleAddEmpresa}
          >
            Empresa
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
        <ModalEliminarEmpresa show={deleteModalOpen} onHide={handleCloseDeleteModal} empresa={empresaToEdit} onDelete={handleDelete} />

        <ModalSucursal modalName="modalSucursal" getSucursal={() => {}} sucursalToEdit={undefined} />
        <ModalEmpresa modalName="modal" getEmpresa={fetchEmpresa} empresaToEdit={empresaToEdit !== null ? empresaToEdit : undefined} />
      </Container>
    </Box>
  );
}


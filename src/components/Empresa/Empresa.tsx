import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch } from "../../hooks/redux";
import TableComponent from "../Table/Table";
import SearchBar from "../SearchBar/SearchBar";
import { setEmpresa } from "../../redux/slices/Empresa";
import ModalEmpresa from "../Modal/ModalEmpresa";
import { toggleModal } from "../../redux/slices/Modal";
import EmpresaService from "../../services/EmpresaService";
import Empresa from "../../types/Empresa";
import ModalEliminarEmpresa from "../Modal/ModalEliminarEmpresa";

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
  const [filterData, setFilterData] = useState<Row[]>([]);
  const [empresaToEdit, setEmpresaToEdit] = useState<Empresa | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Función para abrir la modal de eliminación
  const handleOpenDeleteModal = (rowData: Row) => {
    setEmpresaToEdit({
      id: rowData.id,
      nombre: rowData.nombre,
      razonSocial: rowData.razonSocial,
      cuil: rowData.cuil,
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
      const empresa = await empresaService.getAll(url + 'empresa');
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
  });
  dispatch(toggleModal({ modalName: 'modal' }));
};


  const handleSearch = (query: string) => {
    const filtered = filterData.filter((item) =>
      item.descripcion.toLowerCase().includes(query.toLowerCase())
    );
    setFilterData(filtered);
  };

  const columns: Column[] = [
    { id: "id", label: "Id", renderCell: (rowData) => <>{rowData.id}</> },
    { id: "nombre", label: "Nombre", renderCell: (rowData) => <>{rowData.nombre}</> },
    { id: "razonSocial", label: "Razon Social", renderCell: (rowData) => <>{rowData.razonSocial}</> },
    { id: "cuil", label: "Cuil", renderCell: (rowData) => <>{rowData.cuil}</> },
    
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

    
        <ModalEmpresa getEmpresa={fetchEmpresa} empresaToEdit={empresaToEdit !== null ? empresaToEdit : undefined} />
      </Container>
    </Box>
  );
}


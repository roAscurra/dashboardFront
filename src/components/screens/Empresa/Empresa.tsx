import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Button, Container, IconButton, Card, CardMedia, CardContent, CardActions, Grid } from "@mui/material";
import { Add } from "@mui/icons-material";
import {useAppDispatch, useAppSelector} from "../../../hooks/redux";
import SearchBar from "../../ui/SearchBar/SearchBar";
import { setEmpresa } from "../../../redux/slices/Empresa";
import ModalEmpresa from "../../ui/Modal/Empresa/ModalEmpresa.tsx";
import { toggleModal } from "../../../redux/slices/Modal";
import EmpresaService from "../../../services/EmpresaService";
import Empresa from "../../../types/Empresa";
import ModalEliminarEmpresa from "../../ui/Modal/Empresa/ModalEliminarEmpresa.tsx";
import { Link } from "react-router-dom";
import ModalSucursal from "../../ui/Modal/Sucursal/ModalSucursal.tsx";
import {handleSearch} from "../../../utils.ts/utils.ts";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


interface Row {
  [key: string]: any;
}

export const ListaEmpresa = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const empresaService = new EmpresaService();
  const [filterData, setFilterData] = useState<Row[]>([]);
  const [empresaToEdit, setEmpresaToEdit] = useState<Empresa | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const globalEmpresas = useAppSelector(
      (state) => state.empresas.data
  );

 
  // Función para abrir la modal de eliminación
  const handleOpenDeleteModal = (rowData: Row) => {
    setEmpresaToEdit({
      id: rowData.id,
      eliminado: rowData.eliminado,
      nombre: rowData.nombre,
      razonSocial: rowData.razonSocial,
      cuil: rowData.cuil,
    imagenes: rowData.imagenes[0]
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
    onSearch('');
  }, []);

  const handleAddEmpresa = () => {
    
    setEmpresaToEdit(null);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  

  // Función para abrir la modal de edición
// Definición de handleOpenEditModal
const handleOpenEditModal = (rowData: Row) => {
  setEmpresaToEdit({
    id: rowData.id,
    eliminado: rowData.eliminado,
    nombre: rowData.nombre,
    razonSocial: rowData.razonSocial,
    cuil: rowData.cuil,
    imagenes: rowData.imagenes[0]
  });
  dispatch(toggleModal({ modalName: 'modal' }));
};

  // const handleAddSucursal = () => {
  //   dispatch(toggleModal({ modalName: "modalSucursal" })); // Abre el modal de sucursales
  // };

  const onSearch = (query: string) => {
    handleSearch(query, globalEmpresas, setFilterData);
  };


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
          <SearchBar onSearch={onSearch} />
        </Box> 
      
        <Grid container spacing={4}
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
            style={{ minHeight: '80vh', paddingTop: '1rem' }}
        >
        {
          filterData.map((empresa) => {
            return <Grid item xs={3} sm={6} md={4} >
              <Link to={`/empresas/${empresa.id}/sucursales`}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    alt="green iguana"
                    height="140"
                    image= {empresa.imagen}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {empresa.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {empresa.denominacion}
                    </Typography>
                  </CardContent>
                  <CardActions> 
                    <IconButton onClick={()=>handleOpenDeleteModal(empresa)} aria-label="delete">
                      <DeleteIcon/>
                    </IconButton>
                    <IconButton onClick={()=>handleOpenEditModal(empresa)} aria-label="delete">
                      <EditIcon/>
                    </IconButton>
                  </CardActions>
                </Card>
              </Link>
            </Grid>
          })
        }
        </Grid>
        
        <ModalEliminarEmpresa show={deleteModalOpen} onHide={handleCloseDeleteModal} empresa={empresaToEdit} onDelete={handleDelete} />

        <ModalSucursal modalName="modalSucursal" getSucursal={() => {}} sucursalToEdit={undefined} />
        <ModalEmpresa modalName="modal" getEmpresa={fetchEmpresa} empresaToEdit={empresaToEdit !== null ? empresaToEdit : undefined} />
      </Container>
    </Box>
  );
}




import { useEffect, useState, useCallback } from "react";
import { Box, Typography, Container, Card, CardMedia, CardContent, Grid } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import ModalSucursal from "../../ui/Modal/Sucursal/ModalSucursal.tsx";
import { toggleModal } from "../../../redux/slices/Modal";
import SucursalService from "../../../services/SucursalService.ts";
import { setSucursal } from "../../../redux/slices/Sucursal.ts";
import { useAppDispatch } from "../../../hooks/redux.ts";
import Sucursal from "../../../types/Sucursal.ts";
import ModalEliminarSucursal from "../../ui/Modal/Sucursal/ModalEliminarSucursal.tsx";
import EmpresaService from "../../../services/EmpresaService.ts";

interface Row {
  [key: string]: any;
}

export const ListaSucursal = () => {
  const url = import.meta.env.VITE_API_URL;
  const { id } = useParams(); // Obtén el ID de la URL
  const dispatch = useAppDispatch();
  const sucursalService = new SucursalService();
  const empresaService = new EmpresaService();
  const [filterData, setFilterData] = useState<Row[]>([]);
  const [sucursalToEdit, setSucursalToEdit] = useState<Sucursal | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);


  const fetchEmpresa = useCallback(async () => {
    try {
      if(id){
        const empresa = await empresaService.get(url + 'empresa', id); // Utiliza el ID de la URL para obtener los detalles de la empresa
        console.log('Detalles de la empresa:', empresa);
      }
    } catch (error) {
      console.error("Error al obtener los detalles de la empresa:", error);
    }
  }, [empresaService, id, url]);

  const fetchImages = useCallback(async (sucursalId: string) => {
    try {
        const response = await sucursalService.get(url + 'sucursal/getAllImagesBySucursalId', sucursalId);
        
        if (Array.isArray(response) && response.length > 0) {
            return response[0].url; // Devuelve la URL de la primera imagen
        }
        // Si no se encuentra ninguna imagen, devuelve una imagen placeholder
        return 'https://via.placeholder.com/150';
    } catch (error) {
        // En caso de error, devuelve una imagen placeholder
        return 'https://via.placeholder.com/150';
    }
  }, [sucursalService, url]);

  const fetchSucursal = useCallback(async () => {
    try {
      const sucursales = await sucursalService.getAll(url + 'sucursal');
      const sucursalesConImagenes = await Promise.all(
        sucursales.map(async (sucursal) => {
          const imagenUrl = await fetchImages(sucursal.id.toString());
          return { ...sucursal, imagen: imagenUrl };
        })
      );
      dispatch(setSucursal(sucursalesConImagenes));
      setFilterData(sucursalesConImagenes);
    } catch (error) {
        console.error("Error al obtener las sucursales:", error);
    }
  }, [dispatch, sucursalService, url, fetchImages]);

  useEffect(() => {
    fetchSucursal();
    fetchEmpresa(); // Llama a la función para obtener los detalles de la empresa
  }, []);

  const handleDelete = async () => {
    try {
      if (sucursalToEdit && sucursalToEdit.id) {
        await sucursalService.delete(url + 'sucursal', sucursalToEdit.id.toString());
        console.log('Se ha eliminado correctamente.');
        handleCloseDeleteModal(); 
        fetchSucursal(); 
      } else {
        console.error('No se puede eliminar la sucursal porque no se proporcionó un ID válido.');
      }
    } catch (error) {
      console.error('Error al eliminar la sucursal:', error);
    }
  };
  
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleAddSucursal = () => {
    setSucursalToEdit(null);
    dispatch(toggleModal({ modalName: "modal" }));
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
        <Grid container spacing={4} direction="row" justifyContent="space-evenly" alignItems="center" style={{ minHeight: '80vh', paddingTop: '1rem' }}>
          {filterData.map((sucursal) => (
            <Grid item xs={3} sm={6} md={4}>
              <Link to={`/sucursal/${sucursal.id}`}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    alt={sucursal.nombre}
                    height="140"
                    image={sucursal.imagen}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {sucursal.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sucursal.nombre}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
          {/* Tarjeta vacía */}
          <Grid item xs={3} sm={6} md={4} onClick={handleAddSucursal}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                alt={"Crear sucursal"}
                height="140"
                image={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFJd8e-dfvZFuUNjVpjo0HSaGAuansjA2SI9lfEAbXcw&s"}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Agregar Sucursal
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <ModalEliminarSucursal show={deleteModalOpen} onHide={handleCloseDeleteModal} sucursal={sucursalToEdit} onDelete={handleDelete} />
        <ModalSucursal modalName="modal"  getSucursal={fetchSucursal} sucursalToEdit={undefined} />
      </Container>
    </Box>
  );
}

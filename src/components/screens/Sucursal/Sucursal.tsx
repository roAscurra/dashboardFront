import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  Grid,
  CardActions,
  Button,
} from "@mui/material";
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
  const { empresaId } = useParams(); // Obtén el ID de la URL
  const dispatch = useAppDispatch();
  const sucursalService = new SucursalService();
  const empresaService = new EmpresaService();
  const [filterData, setFilterData] = useState<Row[]>([]);
  const [sucursalToEdit, setSucursalToEdit] = useState<Sucursal | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchEmpresa = useCallback(async () => {
    try {
      if (empresaId) {
        const empresa = await empresaService.get(url + 'empresa', empresaId);
        console.log('Detalles de la empresa:', empresa);
      }
    } catch (error) {
      console.error("Error al obtener los detalles de la empresa:", error);
    }
  }, [empresaService, empresaId, url]);

  const fetchImages = useCallback(async (sucursalId: string) => {
    try {
      const response = await sucursalService.get(url + 'sucursal/getAllImagesBySucursalId', sucursalId);

      if (Array.isArray(response) && response.length > 0) {
        return response[0].url; // Devuelve la URL de la primera imagen
      }
      return 'https://via.placeholder.com/150';
    } catch (error) {
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

      const sucursalesFiltradas = sucursalesConImagenes.filter(sucursal => sucursal.empresa.id.toString() === empresaId);
      dispatch(setSucursal(sucursalesFiltradas));
      setFilterData(sucursalesFiltradas);
    } catch (error) {
      console.error("Error al obtener las sucursales:", error);
    }
  }, [dispatch, sucursalService, url, fetchImages, empresaId]);

  useEffect(() => {
    fetchSucursal();
    fetchEmpresa();
  }, [fetchSucursal, fetchEmpresa]);

  const handleOpenDeleteModal = (rowData: Sucursal) => {
    setSucursalToEdit({
      id: rowData.id,
      eliminado: rowData.eliminado,
      nombre: rowData.nombre,
      imagen: rowData.imagen,
      horarioApertura: rowData.horarioApertura,
      horarioCierre: rowData.horarioCierre,
      casaMatriz: rowData.casaMatriz,
      domicilio: rowData.domicilio,
      empresa: rowData.empresa
    });
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

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

  const handleOpenEditModal = (rowData: Sucursal) => {
    setSucursalToEdit({
      id: rowData.id,
      eliminado: rowData.eliminado,
      nombre: rowData.nombre,
      imagen: rowData.imagen,
      horarioApertura: rowData.horarioApertura,
      horarioCierre: rowData.horarioCierre,
      casaMatriz: rowData.casaMatriz,
      domicilio: rowData.domicilio,
      empresa: rowData.empresa
    });
    dispatch(toggleModal({ modalName: 'modal' }));
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
        <Grid
          container
          spacing={4}
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
          style={{ minHeight: "80vh", paddingTop: "1rem" }}
        >
          {filterData.map((sucursal) => (
            <Grid item xs={12} sm={6} md={4} key={sucursal.id}>
              <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                  component="img"
                  alt={sucursal.nombre}
                  height="140"
                  image={sucursal.imagen}
                  sx={{ objectFit: 'contain', borderRadius: '50%' }}
                />
                <CardContent>
                  <Link to={`/inicio/${sucursal.id}`}>
                    <Typography gutterBottom variant="h5" component="div">
                      {sucursal.nombre}
                    </Typography>
                  </Link>
                  <Typography variant="body2" color="text.secondary">
                    {sucursal.razonSocial}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => handleOpenDeleteModal(sucursal)}
                  >
                    Eliminar
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleOpenEditModal(sucursal)}
                  >
                    Editar
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
          <Grid item xs={12} sm={6} md={4} onClick={handleAddSucursal}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                alt={"Crear sucursal"}
                height="140"
                image={"https://objetivoligar.com/wp-content/uploads/2017/03/blank-profile-picture-973460_1280-768x768.jpg"}
                sx={{ objectFit: 'contain', borderRadius: '50%' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Agregar Sucursal
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <ModalEliminarSucursal
          show={deleteModalOpen}
          onHide={handleCloseDeleteModal}
          sucursal={sucursalToEdit}
          onDelete={handleDelete}
        />
        <ModalSucursal
          modalName="modal"
          getSucursal={fetchSucursal}
          sucursalToEdit={sucursalToEdit !== null ? sucursalToEdit : undefined}
        />
      </Container>
    </Box>
  );
};

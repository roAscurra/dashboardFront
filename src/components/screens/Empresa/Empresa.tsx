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
import { useAppDispatch } from "../../../hooks/redux";
import { setEmpresa } from "../../../redux/slices/Empresa";
import ModalEmpresa from "../../ui/Modal/Empresa/ModalEmpresa.tsx";
import { toggleModal } from "../../../redux/slices/Modal";
import EmpresaService from "../../../services/EmpresaService";
import Empresa from "../../../types/Empresa";
import ModalEliminarEmpresa from "../../ui/Modal/Empresa/ModalEliminarEmpresa.tsx";
import { Link } from "react-router-dom";
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

  const fetchImages = useCallback(
    async (empresaId: string) => {
      try {
        const response = await empresaService.get(
          url + "empresa/getAllImagesByEmpresaId",
          empresaId
        );

        if (Array.isArray(response) && response.length > 0) {
          return response[0].url;
        }
        return "https://via.placeholder.com/150";
      } catch (error) {
        return "https://via.placeholder.com/150";
      }
    },
    [empresaService, url]
  );

  const fetchEmpresa = useCallback(async () => {
    try {
      const empresas = await empresaService.getAll(url + "empresa");
      const empresasConImagenes = await Promise.all(
        empresas.map(async (empresa) => {
          const imagenUrl = await fetchImages(empresa.id.toString());
          return { ...empresa, imagen: imagenUrl };
        })
      );
      dispatch(setEmpresa(empresasConImagenes));
      setFilterData(empresasConImagenes);
    } catch (error) {
      console.error("Error al obtener las empresas:", error);
    }
  }, [dispatch, empresaService, url, fetchImages]);

  useEffect(() => {
    fetchEmpresa();
  }, []);

  const handleOpenDeleteModal = (rowData: Row) => {
    setEmpresaToEdit({
      id: rowData.id,
      eliminado: rowData.eliminado,
      nombre: rowData.nombre,
      razonSocial: rowData.razonSocial,
      cuil: rowData.cuil,
      imagen: rowData.imagen.url,
    });
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleAddEmpresa = () => {
    setEmpresaToEdit(null);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleOpenEditModal = (rowData: Row) => {
    setEmpresaToEdit({
      id: rowData.id,
      eliminado: rowData.eliminado,
      nombre: rowData.nombre,
      razonSocial: rowData.razonSocial,
      cuil: rowData.cuil,
      imagen: rowData.imagen,
    });
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
          {filterData.map((empresa) => {
            return (
              <Grid item xs={12} sm={6} md={4} key={empresa.id}>
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    alt={empresa.nombre}
                    height="140"
                    image={empresa.imagen}
                    sx={{ objectFit: "contain", borderRadius: "50%" }}
                  />
                  <CardContent>
                    <Link to={`/sucursal/${empresa.id}`}>
                      <Typography gutterBottom variant="h5" component="div">
                        {empresa.nombre}
                      </Typography>
                    </Link>
                    <Typography variant="body2" color="text.secondary">
                      {empresa.denominacion}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <div>
                      <Button
                        size="small"
                        onClick={() => handleOpenDeleteModal(empresa)}
                      >
                        Eliminar
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleOpenEditModal(empresa)}
                      >
                        Editar
                      </Button>
                    </div>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}

          <Grid item xs={12} sm={6} md={4} onClick={handleAddEmpresa}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                alt={"Crear empresa"}
                height="140"
                image={
                  "https://objetivoligar.com/wp-content/uploads/2017/03/blank-profile-picture-973460_1280-768x768.jpg"
                }
                sx={{ objectFit: "contain", borderRadius: "50%" }}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Agregar Empresa
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <ModalEliminarEmpresa
          show={deleteModalOpen}
          onHide={handleCloseDeleteModal}
          empresa={empresaToEdit}
          //onDelete={fetchEmpresa}
        />
        <ModalEmpresa
          modalName="modal"
          getEmpresa={fetchEmpresa}
          empresaToEdit={empresaToEdit !== null ? empresaToEdit : undefined}
        />
      </Container>
    </Box>
  );
};

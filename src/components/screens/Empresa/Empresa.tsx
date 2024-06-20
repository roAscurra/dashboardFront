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
import {Link, useNavigate} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {useAuth0} from "@auth0/auth0-react";
import UsuarioService from "../../../services/UsuarioService.ts";
import Usuario from "../../../types/Usuario.ts";
import {BaseNavBar} from "../../ui/common/BaseNavBar.tsx";
interface Row {
  [key: string]: any;
}

export const ListaEmpresa = () => {
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const empresaService = new EmpresaService();
  const usuarioService = new UsuarioService();
  const [filterData, setFilterData] = useState<Row[]>([]);
  const [empresaToEdit, setEmpresaToEdit] = useState<Empresa | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const { user, isLoading, isAuthenticated, getAccessTokenSilently, logout } = useAuth0();
  const [ usuario, setUsuario ] = useState<Usuario>();
  const [ usuarioIsLoading, setUsuarioIsLoading ] = useState<boolean>(true);

  const fetchImages = useCallback(
    async (empresaId: string) => {
      try {
        const response = await empresaService.get(
          url + "empresa/getAllImagesByEmpresaId",
          empresaId, await getAccessTokenSilently({})
        );

        if (Array.isArray(response) && response.length > 0) {
          return response[0].url;
        }
        return "";
      } catch (error) {
        return "";
      }
    },
    [empresaService, url]
  );

  const fetchEmpresa = useCallback(async () => {
    try {
      const empresas = await empresaService.getAll(url + "empresa", await getAccessTokenSilently({}));
      console.log(empresas)
      dispatch(setEmpresa(empresas));
      setFilterData(empresas);
    } catch (error) {
      console.error("Error al obtener las empresas:", error);
    }
  }, [dispatch, empresaService, url, fetchImages]);

    const fetchUsuario = async () => {
        try {
            const usuario = await usuarioService.getByEmail(url + "usuarioCliente/role/" + user?.email, {
                headers: {
                    Authorization: `Bearer ${await getAccessTokenSilently({})}`
                }
            });

            setUsuario(usuario);

            switch (usuario?.rol) {
              case 'COCINERO':
                  navigate(`pedidos/${usuario?.empleado?.sucursal?.id}`);
                  break;
              case 'CAJERO':
                  navigate(`pedidos/${usuario?.empleado?.sucursal?.id}`);
                  break;
              case 'ADMIN':
                  navigate(`/inicio/${usuario?.empleado?.sucursal?.id}`);
                  break;
          }
        } catch (error) {
            console.error("Error al obtener el usuario:", error);
        } finally {
            setUsuarioIsLoading(false)
        }
    }

  useEffect(() => {
      if(user) {
          fetchUsuario();
      }

    fetchEmpresa();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleOpenDeleteModal = (rowData: Row) => {
    setEmpresaToEdit({
      id: rowData.id,
      eliminado: rowData.eliminado,
      nombre: rowData.nombre,
      razonSocial: rowData.razonSocial,
      cuil: rowData.cuil,
      imagenes: rowData.imagenes,
    });
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    fetchEmpresa();
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
      imagenes: rowData.imagenes,
    });
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: "https://dashboard-front-five.vercel.app/"
        // returnTo: "http://localhost:5173/"
      }
    })
  }
  if(isAuthenticated) {
      if(isLoading || usuarioIsLoading) {
          return <div style={{height: "calc(100vh - 88px)"}} className="d-flex flex-column justify-content-center align-items-center">
              <div className="spinner-border" role="status"></div>
          </div>
      }
  }


if (!user) {
    return <div style={{height: "calc(100vh - 88px)"}}
                className={"d-flex flex-column justify-content-center align-items-center"}>
      <h1>Necesitas logearte para continuar</h1>
      <p>Prueba iniciar session!</p>
  </div>;
} else if(!usuario) {
    return (
      <>
        <div style={{height: "calc(100vh - 88px)"}} className={"d-flex flex-column justify-content-center align-items-center"}>
          <h1>No tienes permisos para usar este dashboard</h1>
          <p>Prueba pedir permisos!</p>
          <button className="btn btn-success text-light" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </>
    );
  }

  return (
      <>
          <BaseNavBar title="Empresas" />
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
                      {
                          ['ADMIN', 'SUPERADMIN'].includes(usuario?.rol)
                           ? <Grid item xs={12} sm={6} md={4} onClick={handleAddEmpresa}>
                          <Card
                              sx={{
                                  maxWidth: 345,
                                  boxShadow: 3,
                                  borderRadius: 16,
                                  cursor: "pointer",
                                  transition: "transform 0.3s",
                                  "&:hover": { transform: "scale(1.05)" },
                              }}
                          >
                              <CardContent
                                  sx={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      height: "100%",
                                      minHeight: 250,
                                  }}
                              >
                                  <AddIcon sx={{ fontSize: 48, marginBottom: 1 }} />
                                  <Typography
                                      gutterBottom
                                      variant="h6"
                                      component="div"
                                      sx={{
                                          fontWeight: "bold",
                                          textAlign: "center",
                                          color: "#333",
                                          marginTop: 1,
                                      }}
                                  >
                                      Agregar Empresa
                                  </Typography>
                              </CardContent>
                          </Card>
                      </Grid>
                              : ''
                      }
                      {filterData.map((empresa) => {
                          return (
                              <Grid item xs={12} sm={6} md={4} key={empresa.id}>
                                  <Card
                                      sx={{
                                          maxWidth: 345,
                                          boxShadow: 3,
                                          borderRadius: 16,
                                          cursor: "pointer",
                                          transition: "transform 0.3s",
                                          "&:hover": { transform: "scale(1.05)" },
                                      }}
                                  >
                                      {empresa.imagenes && empresa.imagenes.length > 0 && empresa.imagenes[0].url !== "" && (
                                          <CardMedia
                                              component="img"
                                              alt={empresa.nombre}
                                              height="140"
                                              image={empresa.imagenes[0].url}
                                              sx={{
                                                  objectFit: "cover",
                                                  borderRadius: "16px 16px 0 0",
                                                  maxHeight: 140,
                                              }}
                                          />
                                      )}

                                      <CardContent
                                          sx={
                                              (!empresa.imagenes || empresa.imagenes.length === 0 || empresa.imagenes[0].url === "") ? {
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                                  height: "100%",
                                                  minHeight: 200,
                                              }
                                              : {}
                                          }
                                      >
                                          <Link
                                              to={`/sucursal/${empresa.id}`}
                                              style={{ textDecoration: "none" }}
                                          >
                                              <Typography
                                                  gutterBottom
                                                  variant="h6"
                                                  component="div"
                                                  sx={{
                                                      fontWeight: "bold",
                                                      color: "#333",
                                                      textAlign: "center",
                                                  }}
                                              >
                                                  {empresa.nombre}
                                              </Typography>
                                          </Link>
                                          <Typography variant="body2" color="text.secondary">
                                              {empresa.denominacion}
                                          </Typography>
                                      </CardContent>
                                      <CardActions sx={{ justifyContent: "center" }}>
                                          <Button
                                              size="small"
                                              onClick={() => handleOpenDeleteModal(empresa)}
                                          >
                                              <DeleteIcon style={{ color: "red" }} />{" "}
                                          </Button>
                                          <Button
                                              size="small"
                                              onClick={() => handleOpenEditModal(empresa)}
                                          >
                                              <EditIcon style={{ color: "green" }} />{" "}
                                          </Button>
                                      </CardActions>
                                  </Card>
                              </Grid>
                          );
                      })}
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
      </>

  );
};

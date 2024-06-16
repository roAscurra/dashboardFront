import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Container, Button } from "@mui/material";
import { useAppDispatch } from "../../../hooks/redux";
import TableComponent from "../../ui/Table/Table.tsx";
import { CCol, CContainer, CRow } from "@coreui/react";
import SearchBar from "../../ui/SearchBar/SearchBar.tsx";
import { useParams } from "react-router-dom";
import PedidoService from "../../../services/PedidoService.ts";
import Pedido from "../../../types/Pedido.ts";
import { setPedido } from "../../../redux/slices/Pedido.ts";
import { BaseNavBar } from "../../ui/common/BaseNavBar.tsx";
import Sidebar from "../../ui/Sider/SideBar.tsx";
import ModalPedido from "../../ui/Modal/Pedido/ModalPedido.tsx";
import { useAuth0 } from "@auth0/auth0-react";
import Usuario from "../../../types/Usuario.ts";
import UsuarioService from "../../../services/UsuarioService.ts";
import ModalDetallePedido from "../../ui/Modal/Pedido/ModalDetallePedido.tsx";

interface Row {
  [key: string]: any;
}

interface Column {
  id: keyof Row;
  label: string;
  renderCell: (rowData: Row) => JSX.Element;
}

export const ListaPedidos = () => {
  const { getAccessTokenSilently } = useAuth0();
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const pedidoService = new PedidoService();
  const [filteredData, setFilterData] = useState<Row[]>([]);
  const [pedidoToEdit, setPedidoToEdit] = useState<Pedido | null>(null);
  const { sucursalId } = useParams();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { user, isLoading, isAuthenticated } = useAuth0();
  const [usuario, setUsuario] = useState<Usuario>();
  const usuarioService = new UsuarioService();
  const [usuarioIsLoading, setUsuarioIsLoading] = useState<boolean>(true);
  const [rolUsuario, setRolUsuario] = useState<string | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [currentDetallePedidos, setCurrentDetallePedidos] = useState([]);
  const [orderDate, setOrderDate] = useState("");
  const [cliente, setCliente] = useState<string | undefined>();
  const [originalData, setOriginalData] = useState<Row[]>([]);

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

  const fetchPedidos = useCallback(async () => {
    try {
      if (rolUsuario) { // Verificar si se ha obtenido el rol del usuario
        const pedidos = (await pedidoService.getPedidosFiltrados(url + 'pedido', rolUsuario, await getAccessTokenSilently({}))).filter((v) => !v.eliminado);
  
        let pedidosFiltrados = pedidos;
  
        if (sucursalId) {
          const sucursalIdNumber = parseInt(sucursalId);
          pedidosFiltrados = pedidos.filter(pedido =>
            pedido.sucursal &&
            pedido.sucursal.id === sucursalIdNumber
          );
        }
  
        // Actualizar el estado con los pedidos obtenidos o filtrados
        dispatch(setPedido(pedidosFiltrados));
        setFilterData(pedidosFiltrados);
        setOriginalData(pedidosFiltrados)
      }
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  }, [dispatch, pedidoService, url, sucursalId, getAccessTokenSilently, rolUsuario]);
  

  useEffect(() => {
    if (user) {
      fetchUsuario();
    }
  }, [user]);

  useEffect(() => {
    if (usuario) {
      fetchPedidos();
      onSearch("");
    }
  }, [usuario]);

  const onSearch = (query: string) => {
    console.log(query)
    // Verificamos si el campo de búsqueda está vacío o no
    const isQueryEmpty = query.trim() === "";
    // Si el campo de búsqueda está vacío o es "false", mostramos todos los resultados sin filtrar
    if (isQueryEmpty) {
      setFilterData(originalData);
      return;
    }
    console.log(originalData)
    // Aplicamos la búsqueda sobre los datos filtrados
    const filtered = originalData.filter(
      (row) =>
        // Verificamos si la propiedad es una cadena antes de llamar a toLowerCase()
        (typeof row.horaEstimadaFinalizacion === "string" &&
          row.horaEstimadaFinalizacion
            .toLowerCase()
            .includes(query.toLowerCase())) ||
        (typeof row.total === "string" &&
          row.total.toLowerCase().includes(query.toLowerCase())) ||
        (typeof row.estado === "string" &&
          row.estado.toLowerCase().includes(query.toLowerCase())) ||
        (typeof row.tipoEnvio === "string" &&
          row.tipoEnvio.toLowerCase().includes(query.toLowerCase())) ||
        (typeof row.formaPago === "string" &&
          row.formaPago.toLowerCase().includes(query.toLowerCase())) ||
        (typeof row.fechaPedido === "string" &&
          row.fechaPedido.toLowerCase().includes(query.toLowerCase())) || 
        (typeof row.cliente?.nombre === "string" &&
          row.cliente?.nombre.toLowerCase().includes(query.toLowerCase())) 
    );

    // Actualizamos los datos filtrados con los resultados de la búsqueda
    setFilterData(filtered);
  };

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

  const handleOpenEditModal = (rowData: Row) => {
    setPedidoToEdit({
      id: rowData.id,
      eliminado: rowData.eliminado,
      horaEstimadaFinalizacion: rowData.horaEstimadaFinalizacion,
      total: rowData.total,
      totalCosto: rowData.totalCosto,
      estado: rowData.estado,
      tipoEnvio: rowData.tipoEnvio,
      formaPago: rowData.formaPago,
      fechaPedido: rowData.fechaPedido,
      detallePedidos: rowData.detallePedidos,
      sucursal: rowData.sucursal,
      factura: rowData.factura,
      cliente: rowData.cliente
    });
    setEditModalOpen(true);
  };
  const handleShow = (detallePedidos: any, fechaPedido:any, cliente: any) => {
    setCurrentDetallePedidos(detallePedidos);
    setCliente(cliente)
    setOrderDate(new Date(fechaPedido).toLocaleDateString());
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentDetallePedidos([]);
    setCliente("")
    setOrderDate("");
    // window.location.reload();
    fetchPedidos();
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    fetchPedidos();
  };

  const handleSavePedido = async (pedido: Pedido) => {
    try {
      await pedidoService.cambiarEstado(url + 'pedido', pedido.id.toString(), pedido.estado, await getAccessTokenSilently({}) );
      setEditModalOpen(false);
      fetchPedidos();
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
    }
  };


  const columns: Column[] = [
    { id: "horaEstimadaFinalizacion", label: "Hora Estimada Finalizacion", renderCell: (rowData) => <>{rowData.horaEstimadaFinalizacion}</> },
    { id: "cliente", label: "Cliente", renderCell: (rowData) => <>{rowData.cliente?.nombre + " " + rowData.cliente?.apellido}</> },
    { id: "telefono", label: "Teléfono", renderCell: (rowData) => <>{rowData.cliente?.telefono}</> },
    { id: "total", label: "Total", renderCell: (rowData) => <>{rowData.total}</> },
    { id: "totalCosto", label: "Total Costo", renderCell: (rowData) => <>{rowData.totalCosto}</> },
    { id: "estado", label: "Estado", renderCell: (rowData) => <> {rowData.estado}</> },
    { id: "tipoEnvio", label: "Tipo Envio", renderCell: (rowData) => <>{rowData.tipoEnvio}</> },
    { id: "formaPago", label: "Forma Pago", renderCell: (rowData) => <>{rowData.formaPago}</> },
    { id: "fechaPedido", label: "Fecha Pedido", renderCell: (rowData) => <>{rowData.fechaPedido}</> },
    {
      id: "detallePedidos",
      label: "Detalle del Pedido",
      renderCell: (rowData) => (
        <div>
          <Button sx={{ bgcolor: "#9c27b0", "&:hover": { bgcolor: "#9c27b0" } }} variant="contained" onClick={() => handleShow(rowData.detallePedidos, rowData.fechaPedido, rowData.cliente)}>Ver</Button>
        </div>
      ),
    },
  ];

  // if (filteredData.length === 0 && originalData.length === 0) {
  //   return (
  //     <>
  //       <div style={{ height: "calc(100vh - 56px)" }} className={"d-flex flex-column justify-content-center align-items-center w-100"}>
  //         <div className="spinner-border" role="status">
  //         </div>
  //         <div>Cargando los pedidos</div>
  //       </div>
  //     </>
  //   );
  // }
  

  return (
    <React.Fragment>
      <BaseNavBar title="" />
      <CContainer fluid style={{ backgroundColor: "#fff" }}>
        <CRow>
          <CCol xs="auto" className="sidebar">
            <Sidebar />
          </CCol>
          <CCol>
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
                    Pedidos
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <SearchBar onSearch={onSearch} />
                </Box>

                <TableComponent data={filteredData} columns={columns} handleOpenDeleteModal={handleOpenEditModal} handleOpenEditModal={handleOpenEditModal} isListaPedidos={true} />
                <ModalDetallePedido
                  show={showModal}
                  handleClose={handleClose}
                  detallePedidos={currentDetallePedidos}
                  orderDate={orderDate}
                  cliente={cliente}
                />
              </Container>
            </Box>
          </CCol>
        </CRow>
      </CContainer>

      <ModalPedido
        open={editModalOpen}
        onClose={handleCloseEditModal}
        pedido={pedidoToEdit}
        onSave={handleSavePedido}
      />
    </React.Fragment>
  );
};

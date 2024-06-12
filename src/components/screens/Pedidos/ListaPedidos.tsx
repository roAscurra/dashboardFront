import React, { useCallback, useEffect, useState } from "react";
import { Box, Typography, Container, Select, MenuItem } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import TableComponent from "../../ui/Table/Table.tsx";
import { CCol, CContainer, CRow } from "@coreui/react";
import { handleSearch } from "../../../utils.ts/utils.ts";
import SearchBar from "../../ui/SearchBar/SearchBar.tsx";
import { useParams } from "react-router-dom";
import PedidoService from "../../../services/PedidoService.ts";
import Pedido from "../../../types/Pedido.ts";
import { setPedido } from "../../../redux/slices/Pedido.ts";
import { BaseNavBar } from "../../ui/common/BaseNavBar.tsx";
import Sidebar from "../../ui/Sider/SideBar.tsx";
import { Estado } from "../../../types/enums/Estado.ts";
import ModalPedido from "../../ui/Modal/Pedido/ModalPedido.tsx"; 
import { SelectChangeEvent } from '@mui/material';
import {useAuth0} from "@auth0/auth0-react";

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

  const globalArticuloManufacturado = useAppSelector(
    (state) => state.articuloManufacturado.data
  );

  const fetchPedidos = useCallback(async () => {
    try {

      if (sucursalId) {
        const sucursalIdNumber = parseInt(sucursalId);
        const pedidos = await pedidoService.pedidosSucursal(url, sucursalIdNumber, await getAccessTokenSilently({}));

        dispatch(setPedido(pedidos));
        setFilterData(pedidos);
      }
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  }, [dispatch, pedidoService, url, sucursalId]);

  useEffect(() => {
    fetchPedidos();
    onSearch('');
  }, []);

  const handleEstadoChange = (event: SelectChangeEvent<string>, rowData: Row) => {
    const updatedPedidos = filteredData.map((pedido) =>
      pedido.id === rowData.id ? { ...pedido, estado: event.target.value as Estado } : pedido
    );
    setFilterData(updatedPedidos);
  };

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
      sucursal: rowData.sucursal
    });
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    fetchPedidos();
  };

  const handleSavePedido = async (pedido: Pedido) => {
    try {
      await pedidoService.cambiarEstado(url + 'pedido', pedido.id.toString(), pedido.estado);
      setEditModalOpen(false);
      fetchPedidos();
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
    }
  };

  const onSearch = (query: string) => {
    handleSearch(query, globalArticuloManufacturado, setFilterData);
  };

  const columns: Column[] = [
    { id: "horaEstimadaFinalizacion", label: "Hora Estimada Finalizacion", renderCell: (rowData) => <>{rowData.horaEstimadaFinalizacion}</> },
    { id: "total", label: "Total", renderCell: (rowData) => <>{rowData.total}</> },
    { id: "totalCosto", label: "Total Costo", renderCell: (rowData) => <>{rowData.totalCosto}</> },
    { id: "estado", label: "Estado", renderCell: (rowData) => (
      <Select
        value={rowData.estado}
        onChange={(event) => handleEstadoChange(event, rowData)}
      >
        {Object.values(Estado).map((estado) => (
          <MenuItem key={estado} value={estado}>
            {estado}
          </MenuItem>
        ))}
      </Select>
    ) },
    { id: "tipoEnvio", label: "Tipo Envio", renderCell: (rowData) => <>{rowData.tipoEnvio}</> },
    { id: "formaPago", label: "Forma Pago", renderCell: (rowData) => <>{rowData.formaPago}</> },
    { id: "fechaPedido", label: "Fecha Pedido", renderCell: (rowData) => <>{rowData.fechaPedido}</> },
    {
      id: "detallePedidos",
      label: "Detalle del Pedido",
      renderCell: (rowData) => {
        const detalles = rowData.detallePedidos;
        return (
          <div>
            {detalles.map((detalle: any, index: number) => (
              <div key={index}>
                <p>Cantidad: {detalle.cantidad}</p>
                <p>Artículo: {detalle.articulo.denominacion}</p>
              </div>
            ))}
          </div>
        );
      }
    }
  ];

  if (filteredData.length === 0) {
    return (
      <>
        <div style={{ height: "calc(100vh - 56px)" }} className={"d-flex flex-column justify-content-center align-items-center w-100"}>
          <div className="spinner-border" role="status">
          </div>
          <div>Cargando los pedidos</div>
        </div>
      </>
    );
  }

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
                  <a
                    className="btn btn-primary"
                    href={`../productos/${sucursalId}`}
                    style={{ backgroundColor: "#9c27b0", border: "#9c27b0" }}
                  >
                    +
                    Pedido
                  </a>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <SearchBar onSearch={onSearch} />
                </Box>

                <TableComponent data={filteredData} columns={columns} handleOpenDeleteModal={handleOpenEditModal} handleOpenEditModal={handleOpenEditModal} />

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

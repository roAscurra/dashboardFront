import React, { useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { TablePagination } from "@mui/material";
import DetallePedido from "../../../../types/DetallePedido";

interface ModalInsumoProps {
  show: boolean;
  handleClose: () => void;
  detallePedidos: DetallePedido[]; // Add this line to accept detallePedidos as a prop
  orderDate: any;
  cliente: any
}

const ModalDetallePedido: React.FC<ModalInsumoProps> = ({
  show,
  handleClose,
  detallePedidos, // Destructure detallePedidos from props
  orderDate,
  cliente
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const paginatedDetallePedidos = detallePedidos.slice(
    currentPage * rowsPerPage,
    currentPage * rowsPerPage + rowsPerPage
  );

  return (
    <Modal
      id="modal"
      show={show}
      onHide={handleClose}
      size="lg"
      backdrop="static"
      keyboard={false}
      centered
      style={{ boxShadow: '0 0 20px rgba(0, 0, 2, 0.5)' }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Pedido - Cliente: {cliente?.nombre} {cliente?.apellido}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="cliente-info">
            <p><strong>Teléfono:</strong> {cliente?.telefono}</p>
            <p><strong>Fecha pedido:</strong> {orderDate} </p>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Artículo</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDetallePedidos.map((detalle, index) => (
              <tr key={index}>
                <td>{detalle.articulo.denominacion}</td>
                <td>{detalle.cantidad}</td>
                <td>{detalle.subTotal}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={detallePedidos.length}
          rowsPerPage={rowsPerPage}
          page={currentPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Modal.Body>
    </Modal>
  );
};

export default ModalDetallePedido;

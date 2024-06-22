import React, { useState, useEffect } from "react";
import { Modal, Button, FormControl } from "react-bootstrap";
import { TablePagination } from "@mui/material";
import PromocionDetalle from "../../../../types/PromocionDetalle";
import ArticuloDto from "../../../../types/dto/ArticuloDto";
import { useFormikContext } from "formik";

interface ModalPromocionDetalleProps {
  articulos: ArticuloDto[];
  show: boolean;
  handleClose: () => void;
  handleAddInsumo: (detalles: PromocionDetalle[]) => void;
  initialDetalles: PromocionDetalle[];
  customStyles?: React.CSSProperties;
}

const ModalPromocionDetalle: React.FC<ModalPromocionDetalleProps> = ({
  articulos,
  show,
  handleClose,
  handleAddInsumo,
  initialDetalles,
}) => {
  const [detalles, setDetalles] = useState<PromocionDetalle[]>(initialDetalles || []);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [filteredInsumos, setFilteredInsumos] = useState<ArticuloDto[]>(articulos);
  const [selectedInsumos, setSelectedInsumos] = useState<ArticuloDto[]>([]);
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    const updatedFilteredInsumos = articulos.filter((insumo) =>
      insumo.denominacion.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInsumos(updatedFilteredInsumos);
    setPage(0);  // Reset to first page on search query change
  }, [articulos, searchQuery]);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    insumo: ArticuloDto
  ) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedInsumos([...selectedInsumos, insumo]);
    } else {
      const updatedSelectedInsumos = selectedInsumos.filter(
        (selected) => selected.id !== insumo.id
      );
      setSelectedInsumos(updatedSelectedInsumos);
    }
  };

  const handleAgregarInsumos = () => {
    const existingInsumos = selectedInsumos.filter(insumo => detalles.some(detalle => detalle.articulo.id === insumo.id));
    
    if (existingInsumos.length > 0) {
      alert(`Los siguientes insumos ya están agregados: ${existingInsumos.map(insumo => insumo.denominacion).join(", ")}`);
    } else {
      const newDetalles = selectedInsumos.map((insumo) => ({
        cantidad: 1,
        eliminado: false,
        articulo: insumo,
        id: 0,
      }));
    
      setDetalles([...detalles, ...newDetalles]);
      setSelectedInsumos([]);
    }
  };

  const handleCantidadChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    detalleIndex: number
  ) => {
    const cantidad = parseInt(e.target.value, 10);
    const updatedDetalles = detalles.map((detalle, index) =>
      index === detalleIndex ? { ...detalle, cantidad } : detalle
    );
    setDetalles(updatedDetalles);
    setFieldValue('detalles', updatedDetalles);
  };

  const handleGuardarInsumo = () => {
    handleAddInsumo(detalles);
    handleClose();
    console.log(detalles);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const indexOfLastItem = (page + 1) * rowsPerPage;
  const indexOfFirstItem = page * rowsPerPage;
  const paginatedInsumos = filteredInsumos.slice(indexOfFirstItem, indexOfLastItem);

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);  // Reset to first page on rows per page change
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleEliminarInsumo = (detalleIndex: number) => {
    const updatedDetalles = detalles.filter((_, index) => index !== detalleIndex);
    setDetalles(updatedDetalles);
  };

  return (
    <Modal
      id={"modal"}
      show={show}
      onHide={handleClose}
      size={"lg"}
      backdrop="static"
      keyboard={false}
      centered
      style={{ boxShadow: "0 0 20px rgba(0, 0, 2, 0.5)" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <FormControl
            type="text"
            placeholder="Buscar producto por nombre"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {selectedInsumos.length > 1 && (
            <Button variant="primary" onClick={handleAgregarInsumos} className="col-md-4">
              Agregar productos
            </Button>
          )}
          {selectedInsumos.length === 1 && (
            <Button variant="primary" onClick={handleAgregarInsumos} className="col-md-4">
              Agregar producto
            </Button>
          )}
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Denominación</th>
              <th>Precio de Venta</th>
              <th>Categoria</th>
              <th>Unidad de Medida</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedInsumos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.denominacion}</td>
                <td>{producto.precioVenta}</td>
                <td>{producto.categoria.denominacion}</td>
                <td>{producto.unidadMedida.denominacion}</td>
                <td>
                  <input
                    type="checkbox"
                    id={`insumo-${producto.id}`}
                    checked={selectedInsumos.some(insumo => insumo.id === producto.id)}
                    onChange={(e) => handleCheckboxChange(e, producto)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredInsumos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {detalles && detalles.length > 0 && (
          <div>
            <h3>Artículos Agregados</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Denominación</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((detalle, index) => (
                  <tr key={index}>
                    <td>{detalle.articulo.denominacion}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={detalle.cantidad}
                        onChange={(e) => handleCantidadChange(e, index)}
                      />
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleEliminarInsumo(index)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleGuardarInsumo}>
          Guardar Productos
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPromocionDetalle;

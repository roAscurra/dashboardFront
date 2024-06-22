import React, { useState, useEffect } from "react";
import { Modal, Button, FormControl } from "react-bootstrap";
import { TablePagination } from "@mui/material";
import ArticuloInsumoShortDto from "../../../../types/dto/ArticuloInsumoShortDto.ts";
import ArticuloManufacturadoDetalle from "../../../../types/ArticuloManufacturadoDetalle.ts";
import { useFormikContext } from "formik";

interface ModalInsumoProps {
  insumos: ArticuloInsumoShortDto[];
  show: boolean;
  handleClose: () => void;
  handleAddInsumo: (detalles: ArticuloManufacturadoDetalle[]) => void;
  initialDetalles: ArticuloManufacturadoDetalle[];
  customStyles?: React.CSSProperties;
}

const ModalInsumo: React.FC<ModalInsumoProps> = ({
  insumos,
  show,
  handleClose,
  handleAddInsumo,
  initialDetalles,
}) => {
  const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>(
    initialDetalles
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0); // Empezar desde la página 0
  const itemsPerPage = 5;
  const [filteredInsumos, setFilteredInsumos] = useState<ArticuloInsumoShortDto[]>(insumos);
  const [selectedInsumos, setSelectedInsumos] = useState<ArticuloInsumoShortDto[]>([]);
  const { setFieldValue } = useFormikContext();

  useEffect(() => {
    const updatedFilteredInsumos = insumos.filter((insumo) =>
      insumo.denominacion.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInsumos(updatedFilteredInsumos);
    setCurrentPage(0); // Reiniciar a la primera página cuando se filtra
  }, [insumos, searchQuery]);

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    insumo: ArticuloInsumoShortDto
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
    const existingInsumos = selectedInsumos.filter(insumo => detalles.some(detalle => detalle.articuloInsumo.id === insumo.id));
    
    if (existingInsumos.length > 0) {
      alert(`Los siguientes insumos ya están agregados: ${existingInsumos.map(insumo => insumo.denominacion).join(", ")}`);
    } else {
      const newDetalles = selectedInsumos.map((insumo) => ({
        cantidad: 1,
        eliminado: false,
        articuloInsumo: insumo,
        id: 0,
      }));
    
      setDetalles([...detalles, ...newDetalles]);
      setSelectedInsumos([]);
    }
  };

  const handleCantidadChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    insumo: ArticuloInsumoShortDto
  ) => {
    const cantidad = parseInt(e.target.value, 10);
    const updatedDetalles = detalles.map((detalle) =>
      detalle.articuloInsumo.id === insumo.id
        ? { ...detalle, cantidad }
        : detalle
    );
    console.log(cantidad)
    setDetalles(updatedDetalles);
    setFieldValue('detalles', updatedDetalles);
  };

  const handleGuardarInsumo = () => {
    handleAddInsumo(detalles);
    handleClose();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // setRowsPerPage();
    parseInt(event.target.value, 10)
    setCurrentPage(0); // Reiniciar a la primera página al cambiar el número de filas por página
  };

  const handleEliminarInsumo = (insumo: ArticuloInsumoShortDto) => {
    const updatedDetalles = detalles.filter(
      (detalle) => detalle.articuloInsumo.id !== insumo.id
    );
    setDetalles(updatedDetalles);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedInsumos = filteredInsumos.slice(indexOfFirstItem, indexOfLastItem);

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
        <Modal.Title>Agregar Insumo</Modal.Title>
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
            placeholder="Buscar insumo por nombre"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {selectedInsumos.length > 1 && (
            <Button variant="primary" onClick={handleAgregarInsumos} className="col-md-4">
              Agregar insumos
            </Button>
          )}
          {selectedInsumos.length === 1 && (
            <Button variant="primary" onClick={handleAgregarInsumos} className="col-md-4">
              Agregar insumo
            </Button>
          )}
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Denominación</th>
              <th>Precio de Venta</th>
              <th>Stock Actual</th>
              <th>Categoria</th>
              <th>Unidad de Medida</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paginatedInsumos.map((insumo, index) => (
              <tr key={index}>
                <td>{insumo.denominacion}</td>
                <td>{insumo.precioVenta}</td>
                <td>{insumo.stockActual}</td>
                <td>{insumo.categoria.denominacion}</td>
                <td>{insumo.unidadMedida.denominacion}</td>
                <td>
                  <input
                    type="checkbox"
                    id={`insumo-${index}`}
                    onChange={(e) => handleCheckboxChange(e, insumo)}
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
          rowsPerPage={itemsPerPage}
          page={currentPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        {detalles.length > 0 && (
          <div>
            <h3>Artículos Insumos Agregados</h3>
            <table className="table">
              <thead>
                <tr>
                  <th>Denominación</th>
                  <th>Cantidad</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {detalles.map((detalle, index) => (
                  <tr key={index}>
                    <td>{detalle.articuloInsumo.denominacion}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={detalle.cantidad}
                        onChange={(e) =>
                          handleCantidadChange(e, detalle.articuloInsumo)
                        }
                      />
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleEliminarInsumo(detalle.articuloInsumo)}
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
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleGuardarInsumo}>
          Guardar Insumo
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalInsumo;

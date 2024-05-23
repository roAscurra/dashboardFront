import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ArticuloInsumoType from '../../../../types/ArticuloInsumoType.ts';
import ArticuloManufacturadoDetalle from '../../../../types/ArticuloManufacturadoDetalle.ts';

interface ModalInsumoProps {
    insumos: ArticuloInsumoType[];
    show: boolean;
    handleClose: () => void;
    handleAddInsumo: (detalles: ArticuloManufacturadoDetalle[]) => void;
    initialDetalles: ArticuloManufacturadoDetalle[];
}

const ModalInsumo: React.FC<ModalInsumoProps> = ({ insumos, show, handleClose, handleAddInsumo, initialDetalles }) => {

    const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>(initialDetalles);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, insumo: ArticuloInsumoType) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            const newDetalle: ArticuloManufacturadoDetalle = {
                cantidad: 1,
                articuloInsumo: insumo,
                id:0
            };
            setDetalles([...detalles, newDetalle]);
        } else {
            const updatedDetalles = detalles.filter((detalle) => detalle.articuloInsumo.id !== insumo.id);
            setDetalles(updatedDetalles);
        }
    };

    const handleCantidadChange = (e: React.ChangeEvent<HTMLInputElement>, insumo: ArticuloInsumoType) => {
        const cantidad = parseInt(e.target.value, 10);
        const updatedDetalles = detalles.map((detalle) =>
            detalle.articuloInsumo.id === insumo.id ? { ...detalle, cantidad } : detalle
        );
        setDetalles(updatedDetalles);
    };

    const findCantidad = (insumo: ArticuloInsumoType) => {
        const detalle = detalles.find((d) => d.articuloInsumo.id === insumo.id);
        return detalle ? detalle.cantidad : 0;
    };

    const handleGuardarInsumo = () => {
        handleAddInsumo(detalles);
        handleClose();
        console.log(detalles)
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Agregar Insumo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Selecciona los insumos y la cantidad:</h5>
                {insumos.map((insumo, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            id={`insumo-${index}`}
                            onChange={(e) => handleCheckboxChange(e, insumo)}
                        />
                        <label htmlFor={`insumo-${index}`}>{insumo.denominacion}</label>
                        <input
                            type="number"
                            min="1"
                            value={findCantidad(insumo)}
                            onChange={(e) => handleCantidadChange(e, insumo)}
                        />
                    </div>
                ))}
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

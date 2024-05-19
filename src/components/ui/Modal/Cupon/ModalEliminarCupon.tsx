// ModalEliminarCupon.tsx

import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import Cupones from '../../../../types/Cupones';
import CuponesService from '../../../../services/CuponesService';

interface ModalEliminarCuponProps {
  show: boolean;
  onHide: () => void;
  cupon: Cupones | null;
  onDelete: () => void;
}

const ModalEliminarCupon: React.FC<ModalEliminarCuponProps> = ({ show, onHide, cupon }) => {
    const cuponesService = new CuponesService();
    const url = import.meta.env.VITE_API_URL;
  
    const handleDelete = async () => {
      try {
        if (cupon && cupon.id) {
          await cuponesService.delete(url + 'cupones', cupon.id.toString());
          console.log('Se ha eliminado correctamente.');
          onHide(); // Cerramos el modal
        } else {
          console.error('No se puede eliminar el cupón porque no se proporcionó un ID válido.');
        }
      } catch (error) {
        console.error('Error al eliminar el cupón:', error);
      }
    };
  
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Cupón</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar el cupón "{cupon?.denominacion}"?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  

export default ModalEliminarCupon;

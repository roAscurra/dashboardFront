import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Promocion from '../../../../types/Promocion';
import PromocionService from '../../../../services/PromocionService';
import {useAuth0} from "@auth0/auth0-react";

interface ModalEliminarPromocionProps {
    show: boolean;
    onHide: () => void;
    promocion: Promocion | null;
    onDelete: () => void;
  }
  
  const ModalEliminarPromocion: React.FC<ModalEliminarPromocionProps> = ({ show, onHide, promocion }) => {
    const promocionService = new PromocionService();
    const url = import.meta.env.VITE_API_URL;
    const { getAccessTokenSilently } = useAuth0();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = async () => {
      setIsDeleting(true);
      try {
        await handleDelete();
      } finally {
        setIsDeleting(false);
      }
    };
    const handleDelete = async () => {
      try {
        if (promocion && promocion.id) {
          await promocionService.delete(url + 'promocion', promocion.id.toString(), await getAccessTokenSilently({}));
          console.log(promocion.id.toString())
          console.log('Se ha eliminado correctamente.');
          onHide(); // Cerramos el modal
        } else {
          console.error('No se puede eliminar la promocion porque no se proporcionó un ID válido.');
        }
      } catch (error) {
        console.error('Error al eliminar la promocion:', error);
      }
    };

    return (
        <Modal show={show} onHide={onHide}>
          <Modal.Header closeButton>
            <Modal.Title>Eliminar Promocion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>¿Estás seguro de que deseas eliminar la promocion "{promocion?.denominacion}"?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              Cancelar
            </Button>
            <Button className='text-light' variant="danger" onClick={handleDeleteClick} disabled={isDeleting}>
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </Modal.Footer>
        </Modal>
      );
    };
    
  
  export default ModalEliminarPromocion;
  
  
  
  
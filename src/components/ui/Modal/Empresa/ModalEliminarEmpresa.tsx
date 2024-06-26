import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Empresa from '../../../../types/Empresa';
import EmpresaService from '../../../../services/EmpresaService';
import {useAuth0} from "@auth0/auth0-react";

interface ModalEliminarEmpresaProps {
  show: boolean;
  onHide: () => void;
  empresa: Empresa | null;
}

const ModalEliminarEmpresa: React.FC<ModalEliminarEmpresaProps> = ({ show, onHide, empresa }) => {
    const empresaService = new EmpresaService();
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
        if (empresa && empresa.id) {
          await empresaService.delete(url + 'empresa',empresa.id.toString(), await getAccessTokenSilently({}));
          console.log('Se ha eliminado correctamente.');
          onHide(); // Cerramos el modal
        } else {
          console.error('No se puede eliminar la empresa porque no se proporcionó un ID válido.');
        }
      } catch (error) {
        console.error('Error al eliminar la empresa:', error);
        onHide();
      }
    };
  
    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Empresa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar la empresa "{empresa?.nombre}"?</p>
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
  

export default ModalEliminarEmpresa;

import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import Categoria from '../../../../types/Categoria';
import CategoriaService from '../../../../services/CategoriaService';

interface ModalEliminarCategoriaProps {
    show: boolean;
    categoria: Categoria | null;
    onDelete: () => void;
    onClose: () => void;
}

const ModalEliminarCategoria: React.FC<ModalEliminarCategoriaProps> = ({ show, categoria, onClose }) => {
    const categoriaService = new CategoriaService();
    const url = import.meta.env.VITE_API_URL;

    const handleEliminar = async () => {
        try {
            if (categoria && categoria.id) {
                await categoriaService.delete(url + 'categorias', categoria.id.toString());
                console.log('Se ha eliminado correctamente.');
                onClose(); // Cerramos el modal después de eliminar
            } else {
                console.error('No se puede eliminar la categoría porque no se proporcionó un ID válido.');
            }
        } catch (error) {
            console.error('Error al eliminar la categoría:', error);
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Categoría</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                ¿Estás seguro de que deseas eliminar la categoría "{categoria?.denominacion}"?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleEliminar}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalEliminarCategoria;

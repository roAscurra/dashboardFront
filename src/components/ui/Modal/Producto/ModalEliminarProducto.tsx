import { Button, Modal } from 'react-bootstrap';
import ArticuloManufacturadoService from '../../../../services/ArticuloManufacturadoService';
import ArticuloManufacturado from '../../../../types/ArticuloManufacturado';
import {useAuth0} from "@auth0/auth0-react";
import { useState } from 'react';

interface ModalDeleteProductsProps {
    show: boolean;
    onHide: () => void;
    product: ArticuloManufacturado | null;
    onDelete: () => void;
}

const ModalEliminarProducto: React.FC<ModalDeleteProductsProps> = ({ show, onHide, product, onDelete }) => {
    const productService = new ArticuloManufacturadoService();
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
            if (product && product.id) {
                const deleteUrl = `${url}articuloManufacturado`;
                console.log(`Eliminando producto con URL: ${deleteUrl}`);
                await productService.delete(deleteUrl, product.id.toString(), await getAccessTokenSilently({}));
                console.log('Se ha eliminado correctamente.');
                onDelete(); // Llama a la función onDelete
                onHide(); // Cerramos el modal
            } else {
                console.error('No se puede eliminar el producto porque no se proporcionó un ID válido.');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            onDelete(); // Llama a la función onDelete
            onHide(); // Cerramos el modal
        }
    }

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>¿Estás seguro de que deseas eliminar el producto "{product?.denominacion}"?</p>
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
}

export default ModalEliminarProducto;

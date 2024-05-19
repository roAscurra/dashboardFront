import { Button, Modal } from 'react-bootstrap';
import ArticuloManufacturadoService from '../../../../services/ArticuloManufacturadoService.ts';
import ArticuloManufacturado from '../../../../types/ArticuloManufacturado';

interface ModalDeleteProductsProps {
    show: boolean;
    onHide: () => void;
    product: ArticuloManufacturado | null;
    onDelete: () => void;
}

const ModalEliminarProducto: React.FC<ModalDeleteProductsProps> = ({ show, onHide, product }) => {
    const productService = new ArticuloManufacturadoService();
    const url = import.meta.env.VITE_API_URL;

    const handleDelete = async () => {
        try {
            if (product && product.id) {
                await productService.delete(url + 'articulosManufacturados', product.id.toString());
                console.log('Se ha eliminado correctamente.');
                onHide(); // Cerramos el modal
            } else {
                console.error('No se puede eliminar el producto porque no se proporcionó un ID válido.');
            }
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
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
                <Button variant="danger" onClick={handleDelete}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalEliminarProducto;
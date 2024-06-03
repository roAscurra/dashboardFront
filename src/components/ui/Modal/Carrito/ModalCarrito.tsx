import { Button, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { toggleModal } from "../../../../redux/slices/Modal";
import { useCarrito } from "../../../../hooks/useCarrito";
import { RemoveShoppingCart } from "@mui/icons-material";

interface ModalCarritoProps {
  modalName: string;
}

const ModalCarrito: React.FC<ModalCarritoProps> = ({ modalName }) => {
  const modal = useAppSelector((state) => state.modal[modalName]);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(toggleModal({ modalName }));
  };
  const {removeCarrito, addCarrito, limpiarCarrito, totalPedido } = useCarrito()


  return (
    <Modal
      id={"modal"}
      show={modal}
      onHide={handleClose}
      size={"lg"}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Carrito de productos:</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <p>No hay productos agregados...</p>
        {/* Aquí puedes agregar cualquier contenido adicional si lo necesitas */}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-secondary"
          onClick={handleClose}
          className="custom-button"
        >
          Cerrar
        </Button>
        <Button onClick={limpiarCarrito} variant="danger">
                  <span style={{fontSize: '15px', width: "20px", height: "20px", color: "white"}} className={"material-symbols-outlined"}><RemoveShoppingCart></RemoveShoppingCart> </span>
                </Button>
      </Modal.Footer>
    </Modal>
    
  );
};

export default ModalCarrito;

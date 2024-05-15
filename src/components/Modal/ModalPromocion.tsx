import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Promocion from "../../types/Promocion";
import PromocionService from "../../services/PromocionService";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { toggleModal } from "../../redux/slices/Modal";

interface ModalPromocionProps {
  getPromocion: () => void;
  promocionToEdit?: Promocion;
}

const ModalPromocion: React.FC<ModalPromocionProps> = ({ getPromocion, promocionToEdit }) => {
  const promocionService = new PromocionService();
  const url = import.meta.env.VITE_API_URL;
  const today = new Date();

  const initialValues: Promocion = promocionToEdit
    ? promocionToEdit
    : {
        id: 0,
        denominacion: "",
        fechaDesde: today,
        fechaHasta: today,
        descripcionDescuento: "",
        precioPromocional: ""
      };

  const modal = useAppSelector((state) => state.modal.modal);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(toggleModal({ modalName: "modal" }));
  };

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
        <Modal.Title>{promocionToEdit ? "Editar Promoción" : "Agregar Promoción"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
            fechaDesde: Yup.date().required("Campo requerido"),
            fechaHasta: Yup.date().required("Campo requerido"),
            descripcionDescuento: Yup.string().required("Campo requerido"),
            precioPromocional:Yup.number().required("Campo requerido")
            
          })}
          initialValues={initialValues}
          onSubmit={async (values: Promocion) => {
            try {
              if (promocionToEdit) {
                // Lógica para editar la promoción existente
                await promocionService.put(url + "promociones", values.id.toString(), values);
                console.log("Se ha actualizado correctamente.");
              } else {
                // Lógica para agregar una nueva promoción
                await promocionService.post(url + "promociones", values);
                console.log("Se ha agregado correctamente.");
              }
              getPromocion(); 
              handleClose(); 
            } catch (error) {
              console.error("Error al realizar la operación:", error);
            }
          }}
        >
          {() => (
            <>
              <Form autoComplete="off">
                <div className="mb-4">
                  <label htmlFor="Denominacion">Denominación:</label>
                  <Field
                    name="denominacion"
                    type="text"
                    placeholder="Denominación"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="denominacion"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="fechaDesde">Fecha Desde:</label>
                  <Field
                    name="fechaDesde"
                    type="date"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="fechaDesde"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="fechaHasta">Fecha Hasta:</label>
                  <Field
                    name="fechaHasta"
                    type="date"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="fechaHasta"
                    className="error-message"
                    component="div"
                  />
                  </div>
                <div className="mb-4">
                  <label htmlFor="DescripcionDescuento">Descripción Descuento:</label>
                  <Field
                    name="descripcionDescuento"
                    type="text"
                    placeholder="Descripción descuento"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="DescripcionDescuento"
                    className="error-message"
                    component="div"
                  />
                 </div>
                <div className="mb-4">
                  <label htmlFor="PrecioPromocional">Precio Promocional:</label>
                  <Field
                    name="precioPromocional"
                    type="text"
                    placeholder="Precio promocional"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="precio promocional"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="outline-success"
                    type="submit"
                    className="custom-button"
                  >
                    Enviar
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalPromocion;
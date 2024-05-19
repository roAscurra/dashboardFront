import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Cupones from "../../../../types/Cupones";
import CuponesService from "../../../../services/CuponesService";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { toggleModal } from "../../../../redux/slices/Modal";

interface ModalCuponProps {
  getCupones: () => void;
  cuponToEdit?: Cupones;
}

const ModalCupon: React.FC<ModalCuponProps> = ({ getCupones, cuponToEdit }) => {
  const cuponesService = new CuponesService();
  const url = import.meta.env.VITE_API_URL;
  const today = new Date();

  const initialValues: Cupones = cuponToEdit
    ? cuponToEdit
    : {
        id: 0,
        denominacion: "",
        fechaDesde: today,
        fechaHasta: today,
        descripcion: ""
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
        <Modal.Title>{cuponToEdit ? "Editar Cupón" : "Agregar Cupón"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
            descripcion: Yup.string().required("Campo requerido"),
            fechaDesde: Yup.date().required("Campo requerido"),
            fechaHasta: Yup.date().required("Campo requerido"),
          })}
          initialValues={initialValues}
          onSubmit={async (values: Cupones) => {
            try {
              if (cuponToEdit) {
                // Lógica para editar el cupón existente
                await cuponesService.put(url + "cupones", values.id.toString(), values);
                console.log("Se ha actualizado correctamente.");
              } else {
                // Lógica para agregar un nuevo cupón
                await cuponesService.post(url + "cupones", values);
                console.log("Se ha agregado correctamente.");
              }
              getCupones(); 
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
                  <label htmlFor="denominacion">Denominación:</label>
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
                  <label htmlFor="descripcion">Descripcion:</label>
                  <Field
                    name="descripcion"
                    type="text"
                    placeholder="Descripcion"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="descripcion"
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
                  <label htmlFor="fechaDesde">Fecha Hasta:</label>
                  <Field
                    name="fechaHasta"
                    type="date"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="fechaDesde"
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

export default ModalCupon;

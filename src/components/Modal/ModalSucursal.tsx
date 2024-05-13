import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { toggleModal } from "../../redux/slices/Modal";
import SucursalService from "../../services/SucursalService";
import Sucursal from "../../types/Sucursal";

interface ModalSucursalProps {
  getSucursal: () => void;
  sucursalToEdit?: Sucursal;
}

const ModalSucursal: React.FC<ModalSucursalProps> = ({ getSucursal, sucursalToEdit }) => {
  const sucursalService = new SucursalService();
  const url = import.meta.env.VITE_API_URL;
  const today = new Date();

  
  const initialValues: Sucursal = sucursalToEdit
    ? sucursalToEdit
    : {
      id: 0,
      denominacion: "",
      horarioApertura: today,
      horarioCierre: today,
      sucursal: "",
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
        <Modal.Title>{sucursalToEdit ? "Editar sucursal" : "Agregar sucursal"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
            horarioApertura: Yup.date().required("Campo requerido"),
            horarioCierre: Yup.date().required("Campo requerido"),
            sucursal: Yup.string().required("Campo requerido"),
            
          })}
          initialValues={initialValues}
          onSubmit={async (values: Sucursal) => {
            try {
              if (sucursalToEdit) {
                // Lógica para editar la sucursal existente
                await sucursalService.put(url + "sucursales", values.id.toString(), values);
                console.log("Se ha actualizado correctamente.");
              } else {
                // Lógica para agregar una nueva sucursal
                await sucursalService.post(url + "sucursales", values);
                console.log("Se ha agregado correctamente.");
              }
              getSucursal(); 
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
                  <label htmlFor="Denominacion">Denominacion:</label>
                  <Field
                    name="denominacion"
                    type="text"
                    placeholder="Denominacion"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="denominacion"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="horarioApertura">Horario apertura:</label>
                  <Field
                    name="horarioApertura"
                    type="number"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="horarioApertura"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="horarioCierre">Horario cierre:</label>
                  <Field
                    name="horarioCierre"
                    type="number"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="horarioCierre"
                    className="error-message"
                    component="div"
                  />
                  </div>
                <div className="mb-4">
                  <label htmlFor="Sucursal">Sucursal:</label>
                  <Field
                    name="sucursal"
                    type="text"
                    placeholder="Sucursal"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="Sucursal"
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

export default ModalSucursal;
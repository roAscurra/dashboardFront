import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { toggleModal } from "../../redux/slices/Modal";
import EmpresaService from "../../services/EmpresaService";
import Empresa from "../../types/Empresa";

interface ModalEmpresaProps {
  getEmpresa: () => void;
  empresaToEdit?: Empresa;
  modalName: string;
}

const ModalEmpresa: React.FC<ModalEmpresaProps> = ({ modalName, getEmpresa, empresaToEdit }) => {
  const empresaService = new EmpresaService();
  const url = import.meta.env.VITE_API_URL;


  const initialValues: Empresa = empresaToEdit
    ? empresaToEdit
    : {
        id: 0,
        nombre: "",
        razonSocial: "",
        cuil: 0, 
        sucursal: ","
      };

  const modal = useAppSelector((state) => state.modal[modalName]);
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
        <Modal.Title>{empresaToEdit ? "Editar Empresa" : "Agregar Empresa"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={Yup.object({
            nombre: Yup.string().required("Campo requerido"),
            razonSocial: Yup.string().required("Campo requerido"),
            cuil: Yup.number().required("Campo requerido"),
            sucursal: Yup.string().required("Campo requerido"),
          })}
          initialValues={initialValues}
          onSubmit={async (values: Empresa) => {
            try {
              if (empresaToEdit) {
        
                await empresaService.put(url + "empresas", values.id.toString(), values);
                console.log("Se ha actualizado correctamente.");
              } else {
                
                await empresaService.post(url + "empresas", values);
                console.log("Se ha agregado correctamente.");
              }
              getEmpresa(); 
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
                  <label htmlFor="nombre">Nombre:</label>
                  <Field
                    name="nombre"
                    type="text"
                    placeholder="Nombre"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="nombre"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="razonSocial">Razon social:</label>
                  <Field
                    name="razonSocial"
                    type="text"
                    placeholder="Razon social"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="razonSocial"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="cuil">Cuil:</label>
                  <Field
                    name="cuil"
                    type="number"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="cuil"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="sucursal">Sucursal:</label>
                  <Field
                    name="sucusarl"
                    type="number"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="sucursal"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="d-flex justify-content-end">
                <Button
                    variant="outline-secondary"
                    type="submit"
                    className="custom-button"
                    
                  >
                    Cerrar
                  </Button>
                  <Button
                    variant="outline-success"
                    type="submit"
                    className="custom-button"
                  >
                    Añadir
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

export default ModalEmpresa;

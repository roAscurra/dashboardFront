import React from "react";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import UsuarioService from "../../services/UsuarioService";
import Usuario from "../../types/UsuarioTypes";

interface ModalUsuarioProps {
  open: boolean;
  onClose: () => void; // Asegúrate de incluir esta propiedad
  getUsuarios: () => void;
  usuarioToEdit?: Usuario;
}

const ModalUsuario: React.FC<ModalUsuarioProps> = ({ open, onClose, getUsuarios, usuarioToEdit }) => {
  const usuarioService = new UsuarioService();
  const url = import.meta.env.VITE_API_URL;

  // Definir las reglas de validación para el formulario usando Yup
  const validationSchema = Yup.object({
    nombre: Yup.string().required("Campo requerido"),
    apellido: Yup.string().required("Campo requerido"),
    email: Yup.string().email("Email inválido").required("Campo requerido"),
    rol: Yup.string().required("Campo requerido"),
  });

  // Valores iniciales del formulario, si hay un usuario para editar, se usan esos valores
  const initialValues: Usuario = usuarioToEdit
    ? usuarioToEdit
    : {
        id: 0,
        nombre: "",
        apellido: "",
        email: "",
        rol: "",
      };

  const modal = useAppSelector((state) => state.modal.modal);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    onClose(); // Llama a la función onClose proporcionada por props
  };

  return (
    <Modal
      id={"modal"}
      show={open}
      onHide={handleClose}
      size={"lg"}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{usuarioToEdit ? "Editar Usuario" : "Agregar Usuario"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={async (values: Usuario) => {
            try {
              if (usuarioToEdit) {
                // Lógica para editar el usuario existente
                await usuarioService.put(url + "usuarios", values.id.toString(), values);
                console.log("Se ha actualizado correctamente.");
              } else {
                // Lógica para agregar un nuevo usuario
                await usuarioService.post(url + "usuarios", values);
                console.log("Se ha agregado correctamente.");
              }
              getUsuarios();
              handleClose();
            } catch (error) {
              console.error("Error al realizar la operación:", error);
            }
          }}
        >
          {() => (
            <Form autoComplete="off">
              <div className="mb-4">
                <label htmlFor="nombre">Nombre:</label>
                <Field name="nombre" type="text" className="form-control mt-2" />
                <ErrorMessage name="nombre" className="error-message" component="div" />
              </div>
              <div className="mb-4">
                <label htmlFor="apellido">Apellido:</label>
                <Field name="apellido" type="text" className="form-control mt-2" />
                <ErrorMessage name="apellido" className="error-message" component="div" />
              </div>
              <div className="mb-4">
                <label htmlFor="email">Email:</label>
                <Field name="email" type="email" className="form-control mt-2" />
                <ErrorMessage name="email" className="error-message" component="div" />
              </div>
              <div className="mb-4">
                <label htmlFor="rol">Rol:</label>
                <Field name="rol" type="text" className="form-control mt-2" />
                <ErrorMessage name="rol" className="error-message" component="div" />
              </div>
              <div className="d-flex justify-content-end">
                <Button variant="outline-success" type="submit" className="custom-button">
                  Enviar
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalUsuario;

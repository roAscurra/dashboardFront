import React from "react";
import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import UsuarioService from "../../../../services/UsuarioService";
import Usuario from "../../../../types/Usuario.ts";
import { toggleModal } from "../../../../redux/slices/Modal";
import {useAuth0} from "@auth0/auth0-react";

interface ModalUsuarioProps {
  getUsuarios: () => void;
  usuarioToEdit?: Usuario;
  surcursalId: number;
}

const ModalUsuario: React.FC<ModalUsuarioProps> = ({ getUsuarios, surcursalId, usuarioToEdit }) => {
  const usuarioService = new UsuarioService();
  const url = import.meta.env.VITE_API_URL;
  const { getAccessTokenSilently } = useAuth0();

  // Definir las reglas de validación para el formulario usando Yup
  const validationSchema = Yup.object({
    username: Yup.string().required("Campo requerido"),
    email: Yup.string().required("Campo requerido"),
    rol: Yup.string().required("Campo requerido"),
  });

  // Valores iniciales del formulario, si hay un usuario para editar, se usan esos valores
  const initialValues: Usuario = usuarioToEdit
    ? usuarioToEdit
    : {
      id: 0,
      eliminado: false,
      username: "",
      email: "",
      rol: "",
      empleado: {
        tipoEmpleado: "",
        sucursal: {
          id: 0
        }
      }
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
        <Modal.Title>{usuarioToEdit ? "Editar Usuario" : "Agregar Usuario"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={async (values: Usuario) => {

            values.empleado = {
              tipoEmpleado: values.rol,
              sucursal: {
                id: surcursalId
              }
            }

            console.log(values)

            try {
              if (usuarioToEdit) {
                // Lógica para editar el usuario existente
                await usuarioService.put(url + "usuarioCliente", values.id.toString(), values, await getAccessTokenSilently({}));
                console.log("Se ha actualizado correctamente.");
              } else {
                // Lógica para agregar un nuevo usuario
                await usuarioService.post(url + "usuarioCliente", values, await getAccessTokenSilently({}));
                console.log("Se ha agregado correctamente.");
              }
              getUsuarios();
              handleClose();
            } catch (error) {
              console.error("Error al realizar la operación:", error);
            }
          }}
        >
          {({isSubmitting}) => (
              <Form autoComplete="off">
                <div className="mb-4">
                  <label htmlFor="username">Usuario:</label>
                  <Field name="username" type="text" className="form-control mt-2"/>
                  <ErrorMessage name="username" className="error-message" component="div"/>
                </div>
                <div className="mb-4">
                  <label htmlFor="email">Email:</label>
                  <Field name="email" type="text" className="form-control mt-2"/>
                  <ErrorMessage name="email" className="error-message" component="div"/>
                </div>
                <div className="mb-4">
                  <label htmlFor="rol">Rol:</label>
                  <Field name="rol" as="select" className="form-control mt-2">
                    <option value="CAJERO">Cajero</option>
                    <option value="COCINERO">Cocinero</option>
                    <option value="DELIVERY">Delivery</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPERADMIN">Super admin</option>
                  </Field>
                  <ErrorMessage name="rol" className="error-message" component="div"/>
                </div>
                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                    className="me-2"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Guardando..." : "Guardar"}
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

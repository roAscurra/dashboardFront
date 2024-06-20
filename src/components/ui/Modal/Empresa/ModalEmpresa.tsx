import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Empresa from "../../../../types/Empresa";
import EmpresaService from "../../../../services/EmpresaService";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { toggleModal } from "../../../../redux/slices/Modal";
import { useState, ChangeEvent } from 'react';
import {useAuth0} from "@auth0/auth0-react";
import ImageSlider from "../../ImagesSlicer/ImageSlider";
import Imagen from "../../../../types/Imagen";

interface ModalEmpresaProps {
  getEmpresa: () => void;
  empresaToEdit?: Empresa;
  modalName: string;
}

const ModalEmpresa: React.FC<ModalEmpresaProps> = ({ modalName, getEmpresa, empresaToEdit }) => {
  const empresaService = new EmpresaService();
  const url = import.meta.env.VITE_API_URL;
  const { getAccessTokenSilently } = useAuth0();
  const [file, setFile] = useState<File | null>(null);
console.log(empresaToEdit)

  const initialValues: Empresa = {
    id: empresaToEdit ? empresaToEdit.id : 0,
    eliminado: empresaToEdit ? empresaToEdit.eliminado : false,
    nombre: empresaToEdit ? empresaToEdit.nombre : "",
    razonSocial: empresaToEdit ? empresaToEdit.razonSocial : "",
    cuil: empresaToEdit ? empresaToEdit.cuil : 0,
    imagenes: empresaToEdit ? empresaToEdit.imagenes.map(
      (imagen: any) =>
        ({
          id: imagen.id,
          eliminado: imagen.eliminado,
          url: imagen.url,
          name: "image",
        } as Imagen)
    )
    : [],
  };

  const modal = useAppSelector((state) => state.modal[modalName]);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(toggleModal({ modalName: "modal" }));
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
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
            cuil: Yup.number().required("Campo requerido")
          })}
          initialValues={initialValues}
          onSubmit={async (values: Empresa) => {
            console.log(values)
            try {
              let newCompanyId: string | null = null; // Cambiado de const a let

              if (empresaToEdit) {
                await empresaService.put(url + "empresa", values.id.toString(), values, await getAccessTokenSilently({}));
                console.log("Se ha actualizado correctamente.");
                newCompanyId = values.id.toString();
              } else {
                const response = await empresaService.post(url + "empresa", values, await getAccessTokenSilently({}));
                console.log("Se ha agregado correctamente.");
          
                // Obtener el id de la nueva empresa desde la respuesta
                newCompanyId = response.id.toString(); // Convertir a string
              }
          
              // Verificar si hay un archivo seleccionado para cargar
              if (file && newCompanyId) {
                const response = await empresaService.uploadFile(url + 'empresa/uploads', file, newCompanyId, await getAccessTokenSilently({}));
                console.log('Upload successful:', response);
              }
          
              getEmpresa(); 
              handleClose(); 
            } catch (error) {
              console.error("Error al realizar la operación:", error);
            }
          }}
          
        >
          {({values}) => (
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
                  <label htmlFor="logo">Logo:</label>
                  <br />
                  <input
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
                {values.imagenes.length > 0 && (
                  <div className="mb-4">
                    <ImageSlider images={values.imagenes} urlParteVariable="empresa" />
                  </div>
                )}
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

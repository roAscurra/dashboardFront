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
  const [files, setFiles] = useState<File[]>([]);

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
    setFiles([])
    dispatch(toggleModal({ modalName: "modal" }));
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFieldValue: any, existingImages: Imagen[]) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFilesArray = Array.from(e.target.files).map((file) => ({
        file: file,
        name: file.name, // Agregar el nombre del archivo
        preview: URL.createObjectURL(file),
      }));
  
      // Combinar imágenes existentes con las nuevas imágenes seleccionadas
      const combinedImages = [...existingImages, ...newFilesArray];
      setFieldValue("imagenes", combinedImages);
      setFiles(Array.from(e.target.files));
    }
  };
  const handleUpload = async (articuloId: string) => {
    if (files.length > 0 && articuloId) {
      try {
        const accessToken = await getAccessTokenSilently({});
        const uploadPromises = files.map(file =>
          empresaService.uploadFile(
            `${url}empresa/uploads`,
            file,
            articuloId,
            accessToken
          )
        );
        const responses = await Promise.all(uploadPromises);
        console.log("Upload successful:", responses);
      } catch (error) {
        console.error("Error uploading files:", error);
      }
      getEmpresa(); 
    } else {
      console.log("No files or articuloId not set.");
    }
  };
  const handleDeleteImage = async (images: any[], setFieldValue: any) => {
    try {
      console.log(images);
      // Lógica para eliminar la imagen, por ejemplo, llamando a un servicio
      console.log('Eliminar imagen con publicId');
      // Actualizar values.imagenes eliminando la imagen correspondiente
      // Llamar a setFieldValue para actualizar el estado con las imágenes actualizadas
      setFieldValue("imagenes", images);
      console.log(images)
      getEmpresa(); 
      console.log('Imagen eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
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
            cuil: Yup.number().required("Campo requerido"),
            imagenes: Yup.array().min(1, "Debe agregar al menos una imagen").required("Campo requerido")
          })}
          initialValues={initialValues}
          onSubmit={async (values: Empresa) => {
            console.log(values)
            try {
              let newCompanyId: string | null = null; // Cambiado de const a let

              if (empresaToEdit) {
                // Actualizar empresa 
                await empresaService.put(
                  url + "empresa",
                  values.id.toString(),
                  values, await getAccessTokenSilently({})
                );
                newCompanyId = empresaToEdit.id.toString();
                if (files.length > 0 && newCompanyId) {
                  handleUpload(newCompanyId);
                } 
              } else {
                
                values.imagenes = [];
                const response = await empresaService.post(
                  url + "empresa",
                  values, await getAccessTokenSilently({})
                );

                newCompanyId = response.id.toString();
                if (files.length > 0 && newCompanyId) {
                  handleUpload(newCompanyId);
                } 
              }
          
              getEmpresa(); 
              handleClose(); 
            } catch (error) {
              console.error("Error al realizar la operación:", error);
            }
          }}
          
        >
          {({values, setFieldValue, isSubmitting}) => (
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
                    className="error-message text-danger"
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
                    className="error-message text-danger"
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
                    className="error-message text-danger"
                    component="div"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="imagenes">Logo:</label>
                  <br />
                  <input
                    name="imagenes"
                    type="file"
                    className="form-control my-2"
                    onChange={(event) => handleFileChange(event, setFieldValue, values.imagenes)}
                    multiple
                  />
                   <ErrorMessage
                    name="imagenes"
                    className="error-message text-danger"
                    component="div"
                  />
                </div>
                {values.imagenes.length > 0 && (
                  <div className="mb-4">
                    <ImageSlider images={values.imagenes} urlParteVariable="empresa" 
                    onDeleteImage={(images) => handleDeleteImage(images, setFieldValue)}
                    />
                  </div>
                )}
                <div className="d-flex justify-content-end">
                  <Button
                    variant="secondary"
                    onClick={handleClose}
                    className="me-2"
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Guardando..." : "Guardar"}
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

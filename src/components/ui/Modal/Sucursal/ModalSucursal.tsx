import { Button, Col, Modal, Row } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { toggleModal } from "../../../../redux/slices/Modal";
import SucursalService from "../../../../services/SucursalService";
import Sucursal from "../../../../types/Sucursal";
import LocalidaService from "../../../../services/LocalidadService";
import { ChangeEvent, useEffect, useState } from "react";
import Localidad from "../../../../types/Localidad";
import { useParams } from "react-router-dom";
import EmpresaService from "../../../../services/EmpresaService";
import DomicilioService from "../../../../services/DomicilioService";
import ProvinciaService from "../../../../services/ProvinciaService";
import Provincia from "../../../../types/Provincia";
import PaisService from "../../../../services/PaisService";
import Pais from "../../../../types/Pais";
import {useAuth0} from "@auth0/auth0-react";
import Imagen from "../../../../types/Imagen";
import ImageSlider from "../../ImagesSlicer/ImageSlider";

interface ModalSucursalProps {
  getSucursal: () => void;
  sucursalToEdit?: Sucursal | null;
  modalName: string;
  empresaTieneCasaMatriz: boolean; // Agrega la prop aquí
}

const ModalSucursal: React.FC<ModalSucursalProps> = ({
  modalName,
  getSucursal,
  sucursalToEdit,
  empresaTieneCasaMatriz,
}) => {
  const sucursalService = new SucursalService();
  const url = import.meta.env.VITE_API_URL;
  const { getAccessTokenSilently } = useAuth0();

  const localidadService = new LocalidaService();
  const empresaService = new EmpresaService();
  const domicilioService = new DomicilioService();
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const { empresaId } = useParams();
  const paisService = new PaisService();
  const [paises, setPaises] = useState<Pais[]>([]);
  const provinviaService = new ProvinciaService();
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [selectedPais, setSelectedPais] = useState<number | null>(null);
  const [selectedProvincia, setSelectedProvincia] = useState<number | null>(
    null
  );
  const [selectedLocalidad, setSelectedLocalidad] = useState<number | null>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const initialValues: Sucursal = {
    id: sucursalToEdit ? sucursalToEdit.id : 0,
    eliminado: sucursalToEdit ? sucursalToEdit.eliminado : false,
    nombre: sucursalToEdit ? sucursalToEdit.nombre : "",
    horarioApertura: sucursalToEdit ? sucursalToEdit.horarioApertura : formatTime(new Date()),
    horarioCierre: sucursalToEdit ? sucursalToEdit.horarioCierre : formatTime(new Date()),
    esCasaMatriz: sucursalToEdit ? sucursalToEdit.esCasaMatriz : false,
    imagenes: sucursalToEdit ? (sucursalToEdit.imagenes.map(
      (imagen: any): Imagen => ({
        id: imagen.id,
        eliminado: imagen.eliminado,
        url: imagen.url,
        name: "image",
      })
    ) || []) : [],
    domicilio: {
      id: sucursalToEdit ? sucursalToEdit.domicilio.id : 0,
      eliminado: sucursalToEdit ? sucursalToEdit.domicilio.eliminado : false,
      calle: sucursalToEdit ? sucursalToEdit.domicilio.calle : "",
      numero: sucursalToEdit ? sucursalToEdit.domicilio.numero : 0,
      cp: sucursalToEdit ? sucursalToEdit.domicilio.cp : 0,
      piso: sucursalToEdit ? sucursalToEdit.domicilio.piso : 0,
      nroDpto: sucursalToEdit ? sucursalToEdit.domicilio.nroDpto : 0,
      localidad: {
        id: sucursalToEdit ? sucursalToEdit.domicilio.localidad.id : 0,
        eliminado: sucursalToEdit ? sucursalToEdit.domicilio.localidad.eliminado : false,
        nombre: sucursalToEdit ? sucursalToEdit.domicilio.localidad.nombre : "",
        provincia: {
          id: sucursalToEdit ? sucursalToEdit.domicilio.localidad.provincia.id : 0,
          eliminado: sucursalToEdit ? sucursalToEdit.domicilio.localidad.provincia.eliminado : false,
          nombre: sucursalToEdit ? sucursalToEdit.domicilio.localidad.provincia.nombre : "",
          pais: {
            id: sucursalToEdit ? sucursalToEdit.domicilio.localidad.provincia.pais.id : 0,
            eliminado: sucursalToEdit ? sucursalToEdit.domicilio.localidad.provincia.pais.eliminado : false,
            nombre: sucursalToEdit ? sucursalToEdit.domicilio.localidad.provincia.pais.nombre : "",
          },
        },
      },
    },
    empresa: {
      id: sucursalToEdit ? sucursalToEdit.empresa.id : 0,
      eliminado: sucursalToEdit ? sucursalToEdit.empresa.eliminado : false,
      nombre: sucursalToEdit ? sucursalToEdit.empresa.nombre : "",
      razonSocial: sucursalToEdit ? sucursalToEdit.empresa.razonSocial : "",
      cuil: sucursalToEdit ? sucursalToEdit.empresa.cuil : 0,
      imagenes: sucursalToEdit ? (sucursalToEdit.empresa.imagenes.map(
        (imagen: any): Imagen => ({
          id: imagen.id,
          eliminado: imagen.eliminado,
          url: imagen.url,
          name: "image",
        })
      ) || []) : [],
    },
  };
  
  

  const modal = useAppSelector((state: any) => state.modal[modalName]);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setFiles([]);
    dispatch(toggleModal({ modalName }));
  };

  const fetchPais = async () => {
    try {
      const paisesData = await paisService.getAll(url + "pais", await getAccessTokenSilently({}));
      setPaises(paisesData);
    } catch (error) {
      console.error("Error al obtener los paises: ", error);
      setPaises([]);
    }
  };

  const fetchProvinciasData = async (paisId: number | null) => {
    try {
      const todasProvincias = await provinviaService.getAll(url + "provincia", await getAccessTokenSilently({}));
      if (paisId) {
        const provinciaPais = todasProvincias.filter(
          (provincia: any) => provincia.pais.id === paisId
        );
        setProvincias(provinciaPais);
      } else {
        setProvincias(todasProvincias);
      }
    } catch (error) {
      console.error("Error al obtener las provincias: ", error);
      setProvincias([]);
    }
  };

  const fetchLocalidadesData = async (provinciaId: number | null) => {
    try {
      const todasLocalidades = await localidadService.getAll(url + "localidad", await getAccessTokenSilently({}));
      if (provinciaId) {
        const localidadProvincia = todasLocalidades.filter(
          (localidad: any) => localidad.provincia.id === provinciaId
        );
        setLocalidades(localidadProvincia);
      } else {
        setLocalidades(todasLocalidades);
      }
    } catch (error) {
      console.error("Error al obtener las localidades:", error);
      setLocalidades([]);
    }
  };

  useEffect(() => {
    fetchPais();
    if (sucursalToEdit) {
      const { domicilio } = sucursalToEdit;
      setSelectedPais(domicilio.localidad.provincia.pais.id);
      setSelectedProvincia(domicilio.localidad.provincia.id);
    } else {
      setSelectedPais(null);
      setSelectedProvincia(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sucursalToEdit]);

  useEffect(() => {
    if (selectedPais) {
      fetchProvinciasData(selectedPais);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPais]);

  useEffect(() => {
    if (selectedProvincia) {
      fetchLocalidadesData(selectedProvincia);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvincia]);

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
            `${url}sucursal/uploads`,
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
      getSucursal(); 
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
      getSucursal(); 
      console.log(images)
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
        <Modal.Title>
          {sucursalToEdit ? "Editar sucursal" : "Agregar sucursal"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={Yup.object({
            nombre: Yup.string().required("Campo requerido"),
            horarioApertura: Yup.string().required("Campo requerido"),
            horarioCierre: Yup.string().required("Campo requerido"),
            domicilio: Yup.object().shape({calle: Yup.string().required('Campo requerido')}),
            imagenes: Yup.array().min(1, "Debe agregar al menos una imagen").required("Campo requerido")
          })}
          initialValues={initialValues}
          onSubmit={async (values: Sucursal, { setSubmitting }) => {
            try {
              console.log(values)
              let newCompanyId: string | null = null;

              if (sucursalToEdit) {
                const localidad = await localidadService.get(
                  url + "localidad",
                  values.domicilio.localidad.id.toString(), await getAccessTokenSilently({})
                );
                values.domicilio.localidad = localidad;
                // Update address (domicilio)
                const domicilio = await domicilioService.put(
                  url + "domicilio",
                  values.domicilio.id.toString(),
                  values.domicilio, await getAccessTokenSilently({})
                );
                values.domicilio = domicilio;
                console.log(values.imagenes);
                // Update branch details
                const response = await sucursalService.put(
                    url + "sucursal",
                    values.id.toString(),
                    values,
                    await getAccessTokenSilently({})
                );
                console.log(response); // Imprimir la respuesta en la consola

                newCompanyId = values.id.toString(); //asigno el id de la sucursal
                if (files.length > 0 && newCompanyId) {
                  handleUpload(newCompanyId);
                } 
              } else {
                if (empresaId) {
                  const empresa = await empresaService.get(
                    url + "empresa",
                    empresaId, await getAccessTokenSilently({})
                  );
                  values.empresa = empresa;

                  const localidad = await localidadService.get(
                    url + "localidad",
                    values.domicilio.localidad.id.toString(), await getAccessTokenSilently({})
                  );
                  values.domicilio.localidad = localidad;

                  const domicilio = await domicilioService.post(
                    url + "domicilio",
                    values.domicilio, await getAccessTokenSilently({})
                  );
                  values.domicilio = domicilio;

                  // Verificar si la empresa ya tiene una sucursal que es casa matriz
                  if (values.esCasaMatriz && empresaTieneCasaMatriz) {
                    alert("La empresa ya tiene una sucursal que es casa matriz. No se puede crear otra.");
                    return;
                  }
                  values.imagenes = [];
                  const response = await sucursalService.post(
                    url + "sucursal",
                    values, await getAccessTokenSilently({})
                  );
                  newCompanyId = response.id.toString();
                  if (files.length > 0 && newCompanyId) {
                    handleUpload(newCompanyId);
                  } 
                }
              }
              getSucursal();
              handleClose();
            } catch (error) {
              console.error("Error al realizar la operación:", error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form autoComplete="off">
              <Row>
                {/* Primera columna */}
                <Col md={4} className="mb-4">
                  <label htmlFor="nombre">Nombre:</label>
                  <Field
                    name="nombre"
                    type="text"
                    placeholder="nombre"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="nombre"
                    className="error-message text-danger"
                    component="div"
                  />
                </Col>
                {/* Séptima columna */}
                <Col md={4} className="mb-4">
                  <label htmlFor="horarioApertura">Horario apertura:</label>
                  <Field
                    name="horarioApertura"
                    type="time"
                    step="1"
                    className="form-control mt-2"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setFieldValue("horarioApertura", value);
                    }}
                  />
                  <ErrorMessage
                    name="horarioApertura"
                    className="error-message text-danger"
                    component="div"
                  />
                </Col>
                {/* Octava columna */}
                <Col md={4} className="mb-4">
                  <label htmlFor="horarioCierre">Horario cierre:</label>
                  <Field
                    name="horarioCierre"
                    type="time"
                    step="1"
                    className="form-control mt-2"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setFieldValue("horarioCierre", value);
                    }}
                  />
                  <ErrorMessage
                    name="horarioCierre"
                    className="error-message text-danger"
                    component="div"
                  />
                </Col>
              </Row>
              <Row>
                {/* Segunda columna */}
                <Col md={4} className="mb-4">
                  <label htmlFor="pais">País:</label>
                  <Field
                    name="pais"
                    as="select"
                    className="form-control mt-2"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const value = Number(e.target.value);
                      setSelectedPais(value);
                      setFieldValue("pais", value);
                      setFieldValue("provincia", ""); // Resetea el campo de provincia
                      setFieldValue("localidad", ""); // Resetea el campo de localidad
                    }}
                    value={
                      selectedPais ||
                      initialValues.domicilio.localidad.provincia.pais.id
                    } // Agrega este valor
                  >
                    <option value="">
                      Seleccione un país
                    </option>
                    {paises.map((pais, index) => (
                      <option key={index} value={pais.id}>
                        {pais.nombre}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="pais"
                    className="error-message text-danger"
                    component="div"
                  />
                </Col>
                {/* Tercera columna */}
                <Col md={4} className="mb-4">
                  <label htmlFor="provincia">Provincia:</label>
                  <Field
                    name="provincia"
                    as="select"
                    className="form-control mt-2"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const value = Number(e.target.value);
                      setSelectedProvincia(value);
                      setFieldValue("provincia", value);
                      setFieldValue("localidad", ""); // Resetea el campo de localidad
                    }}
                    disabled={!selectedPais}
                    value={
                      selectedProvincia ||
                      initialValues.domicilio.localidad.provincia.id
                    } // Agrega este valor
                  >
                    <option value="">
                      Seleccione una provincia
                    </option>
                    {provincias.map((provincia, index) => (
                      <option key={index} value={provincia.id}>
                        {provincia.nombre}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="provincia"
                    className="error-message text-danger"
                    component="div"
                  />
                </Col>
                {/* Cuarta columna */}
                <Col md={4} className="mb-4">
                  <label htmlFor="localidad">Localidad:</label>
                  <Field
                    name="localidad"
                    as="select"
                    className="form-control mt-2"
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const value = Number(e.target.value);
                      setSelectedLocalidad(value);
                      setFieldValue("localidad", value);
                    }}
                    disabled={!selectedProvincia || !selectedPais} // Deshabilita el selector si no se ha seleccionado una provincia
                    value={
                      selectedLocalidad ||
                      initialValues.domicilio.localidad.id
                    }
                  >
                    <option value="">
                      Seleccione una localidad
                    </option>
                    {localidades.map((localidad, index) => (
                      <option key={index} value={localidad.id}>
                        {localidad.nombre}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="localidad"
                    className="error-message text-danger"
                    component="div"
                  />
                </Col>
              </Row>
              <Row>
                {/* Quinta columna */}
                <Col md={4} className="mb-4">
                  <label htmlFor="domicilio.calle">Calle:</label>
                  <Field
                    name="domicilio.calle"
                    type="text"
                    placeholder="calle"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="domicilio.calle"
                    className="error-message text-danger"
                    component="div"
                  />
                </Col>
                {/* Sexta columna */}
                <Col md={4} className="mb-4">
                  <label htmlFor="domicilio.cp">Código Postal:</label>
                  <Field
                    name="domicilio.cp"
                    type="number"
                    placeholder="cp"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="domicilio.cp"
                    className="error-message text-danger"
                    component="div"
                  />
                </Col>
                <Col md={4} className="mb-4">
                  <label htmlFor="casaMatriz">Casa Matriz:</label>
                  <Field
                    name="esCasaMatriz"
                    as="select"
                    className="form-control mt-2"
                    disabled={empresaTieneCasaMatriz && !sucursalToEdit?.esCasaMatriz}
                    defaultValue={sucursalToEdit?.esCasaMatriz ? "true" : "false"}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                      const value = e.target.value === "true";
                      setFieldValue("esCasaMatriz", value);
                    }}
                  >
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </Field>
                  {(empresaTieneCasaMatriz && !sucursalToEdit?.esCasaMatriz) && ( // Muestra el mensaje solo si empresaTieneCasaMatriz es true
                    <div className="error-message text-danger">
                      La empresa ya posee casa matriz
                    </div>
                  )}
                </Col>
              </Row>
              <Row>
                {/* Novena columna */}
                <Col md={4} className="mb-4">
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
                </Col>
                {values.imagenes.length > 0 && (
                  <div className="col-md-6 mb-4">
                    <ImageSlider images={values.imagenes} urlParteVariable="sucursal" 
                      onDeleteImage={(images) => handleDeleteImage(images, setFieldValue)}
                    />
                  </div>
                )}
              </Row>

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
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalSucursal;

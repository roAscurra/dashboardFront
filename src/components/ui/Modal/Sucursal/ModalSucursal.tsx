import { Button, Modal } from "react-bootstrap";
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

interface ModalSucursalProps {
  getSucursal: () => void;
  sucursalToEdit?: Sucursal | null;
  modalName: string;
}

const ModalSucursal: React.FC<ModalSucursalProps> = ({ modalName, getSucursal, sucursalToEdit }) => {
  const sucursalService = new SucursalService();
  const url = import.meta.env.VITE_API_URL;

  const localidadService = new LocalidaService(); 
  const empresaService = new EmpresaService();
  const domicilioService = new DomicilioService();
  const [localidades, setLocalidades] = useState<Localidad[]>([]); 
  const [file, setFile] = useState<File | null>(null);
  const { empresaId } = useParams();
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const initialValues: Sucursal = sucursalToEdit
    ? sucursalToEdit
    : {
        id: 0,
        eliminado: false,
        nombre: "",
        horarioApertura: formatTime(new Date()),
        horarioCierre: formatTime(new Date()),
        casaMatriz: false,
        localidadId: 0,
        imagen: {
          name: "",
          url: "",
          id: 0
        },
        domicilio: {
          id: 0,
          eliminado: false,
          calle: "",
          numero: 0,
          cp: 0,
          piso: 0,
          nroDpto: 0,
          localidad: {
            id: 0,
            eliminado: false,
            nombre: "",
            provincia: {
              id: 0,
              eliminado: false,
              nombre: "",
              pais: {
                id: 0,
                eliminado: false,
                nombre: ""
              }
            }
          }
        },
        empresa: {
          id: 0,
          eliminado: false,
          nombre: "",
          razonSocial: "",
          cuil: 0,
          imagen: {
            name: "",
            url: "",
            id: 0  // Asegúrate de proporcionar un valor para 'id'
          }
        }
      };
  const modal = useAppSelector((state) => state.modal[modalName]);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(toggleModal({ modalName }));
  };

  const fetchLocalidad = async () => {
    try {
      const localidadesData = await localidadService.getAll(url + 'localidad');
      const localidadesNames = localidadesData.map((localidad: any) => localidad);
      setLocalidades(localidadesNames); 
    } catch (error) {
      console.error("Error al obtener las localidades:", error);
      setLocalidades([]);
    }
  };

  useEffect(() => {
    fetchLocalidad(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <Modal.Title>{sucursalToEdit ? "Editar sucursal" : "Agregar sucursal"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={Yup.object({
            nombre: Yup.string().required("Campo requerido"),
            horarioApertura: Yup.string().required("Campo requerido"),
            horarioCierre: Yup.string().required("Campo requerido"),
          })}
          initialValues={initialValues}
          onSubmit={async (values: Sucursal, { setSubmitting }) => {
            console.log(values)
            try {
              let newCompanyId: string | null = null;

              if (sucursalToEdit) {
                await sucursalService.put(url + "sucursal", values.id.toString(), values);
                console.log("Se ha actualizado correctamente.");
              } else {
                if (empresaId) {
                  // bussco la empresa por el id
                  const empresa = await empresaService.get(url + 'empresa', empresaId);
                  values.empresa = empresa;

                  const localidad = await localidadService.get(url + 'localidad', values.localidadId);
                  console.log(localidad)
                  values.domicilio.localidad = localidad;

                  const domicilio = await domicilioService.post(url + 'domicilio', values.domicilio)
                  values.domicilio = domicilio;

                  const response = await sucursalService.post(url + "sucursal", values);
                  console.log("Se ha agregado correctamente.");
                  newCompanyId = response.id.toString();
                }
              }

              if (file && newCompanyId) {
                const response = await sucursalService.uploadFile(url + 'sucursal/uploads', file, newCompanyId);
                console.log('Upload successful:', response);
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
          {({ setFieldValue, isSubmitting }) => (
            <Form autoComplete="off">
              <div className="mb-4">
                <label htmlFor="nombre">Nombre:</label>
                <Field
                  name="nombre"
                  type="text"
                  placeholder="nombre"
                  className="form-control mt-2"
                />
                <ErrorMessage
                  name="nombre"
                  className="error-message"
                  component="div"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="localidadId">Localidad:</label>
                <Field
                  name="localidadId"
                  as="select"
                  className="form-control mt-2"
                >
                  <option value="">Seleccione una localidad</option>
                  {localidades.map((localidad, index) => (
                    <option key={index} value={localidad.id}>{localidad.nombre}</option>
                  ))}
                </Field>
              </div>
              <div className="mb-4">
                <label htmlFor="domicilio.calle">Calle:</label>
                <Field
                  name="domicilio.calle"
                  type="text"
                  placeholder="calle"
                  className="form-control mt-2"
                />
                <ErrorMessage
                  name="domicilio.calle"
                  className="error-message"
                  component="div"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="cp">Codigo Postal:</label>
                <Field
                  name="domicilio.cp"
                  type="number"
                  placeholder="cp"
                  className="form-control mt-2"
                />
                <ErrorMessage
                  name="cp"
                  className="error-message"
                  component="div"
                />
              </div>
              <div className="mb-4">
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
                  className="error-message"
                  component="div"
                />
              </div>
              <div className="mb-4">
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
                  multiple
                />
              </div>
              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-success"
                  type="submit"
                  className="custom-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar"}
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

import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Promocion from "../../../../types/Promocion";
import PromocionService from "../../../../services/PromocionService";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { toggleModal } from "../../../../redux/slices/Modal";
import Imagen from "../../../../types/Imagen";
import { ChangeEvent, useEffect, useState } from "react";
import PromocionDetalle from "../../../../types/PromocionDetalle";
import PromocionDetalleService from "../../../../services/PromocionDetalleService";
import SucursalService from "../../../../services/SucursalService";
import Sucursal from "../../../../types/Sucursal";
import ModalPromocionDetalle from "./ModalPromocionDetalle";
import ArticuloManufacturadoShorDto from "../../../../types/dto/ArticuloManufacturadoShorDto";
import ArticuloManufacturadoShorDtoService from "../../../../services/dtos/ArticuloManufacturadoShorDtoService";

interface ModalPromocionProps {
  getPromocion: () => void;
  promocionToEdit?: Promocion;
}

const ModalPromocion: React.FC<ModalPromocionProps> = ({
  getPromocion,
  promocionToEdit,
}) => {
  const promocionService = new PromocionService();
  const [showInsumoModal, setShowInsumoModal] = useState(false);
  const [modalColor, setModalColor] = useState<string>(""); // Estado para controlar el color de fondo de la modal
  const [articulosManufacturados, setArticulosManufacturados] = useState<ArticuloManufacturadoShorDto[]>([]);
  const articuloManufacturadoService = new ArticuloManufacturadoShorDtoService();
  const [promocionDetalles, setPromocionDetalles] = useState<PromocionDetalle[]>(promocionToEdit?.promocionDetalle || []);

  const [detalles, setDetalles] = useState<PromocionDetalle[]>([]);
  const url = import.meta.env.VITE_API_URL;
  const today = new Date();
  const promocionDetalleService = new PromocionDetalleService();
  const sucursalService = new SucursalService();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const modal = useAppSelector((state) => state.modal.modal);
  const dispatch = useAppDispatch();
  const initialValues: Promocion = {
    id: promocionToEdit ? promocionToEdit.id : 0,
    eliminado: promocionToEdit ? promocionToEdit.eliminado : false,
    denominacion: promocionToEdit ? promocionToEdit.denominacion : "",
    fechaDesde: promocionToEdit ? promocionToEdit.fechaDesde : today,
    fechaHasta: promocionToEdit ? promocionToEdit.fechaHasta : today,
    horaDesde: promocionToEdit ? promocionToEdit.horaDesde : "",
    horaHasta: promocionToEdit ? promocionToEdit.horaHasta : "",
    descripcionDescuento: promocionToEdit
      ? promocionToEdit.descripcionDescuento
      : "",
    precioPromocional: promocionToEdit ? promocionToEdit.precioPromocional : 0,
    tipoPromocion: promocionToEdit ? promocionToEdit.tipoPromocion : "",
    sucursales: promocionToEdit
    ? promocionToEdit.sucursales.map((sucursal: any) => ({
        id: sucursal.id,
        nombre: sucursal.nombre,
        horarioApertura: sucursal.horarioApertura,
        horarioCierre: sucursal.horarioCierre,
        casaMatriz: sucursal.casaMatriz,
        imagen: sucursal.imagen,
        domicilio: sucursal.domicilio,
        empresa: sucursal.empresa,
        eliminado: sucursal.eliminado || false,
      }))
    : [],
    promocionDetalle: promocionToEdit?.promocionDetalle
        ? promocionToEdit.promocionDetalle.map((detalle: any) => ({
            id: 0,
            cantidad: detalle.cantidad,
            eliminado: detalle.eliminado || false, 
            articuloManufacturado: 
                {
                    id: detalle.articuloManufacturado.id,
                    eliminado: detalle.articuloManufacturado.eliminado,
                    denominacion: detalle.articuloManufacturado.denominacion,
                    precioVenta: detalle.articuloManufacturado.precioVenta,
                    descripcion: detalle.descripcion,
                    tiempoEstimadoMinutos: detalle.tiempoEstimadoMinutos,
                    unidadMedida: detalle.unidadMedida,
                    categoria: detalle.categoria
                    ? {
                      id: detalle.articuloInsumo.categoria.id,
                      eliminado: detalle.articuloInsumo.categoria.eliminado,
                      denominacion: detalle.articuloInsumo.categoria.denominacion,
                      esInsumo: detalle.articuloInsumo.categoria.esInsumo,
                  }: {
                      id: 0,
                      eliminado: false,
                      denominacion: '',
                      esInsumo: false,
                  },
                    preparacion: detalle.articuloManufacturado.preparacion, 
                }
        }))
        : [],
    imagenes: promocionToEdit
      ? promocionToEdit.imagenes?.map(
          (imagen: any) =>
            ({
              url: imagen.url,
              name: "image",
            } as Imagen)
        )
      : [],
  };
  const handleClose = () => {
    dispatch(toggleModal({ modalName: "modal" }));
  };
  const fetchArticulosManufacturados = async () => {
    try {
      const articulosManufacturados = await articuloManufacturadoService.getAll(
        `${url}articuloManufacturado`
      );
      setArticulosManufacturados(articulosManufacturados);
      console.log(articulosManufacturados);
    } catch (error) {
      console.error("Error al obtener los insumos:", error);
    }
  };
  const fetchSucursales = async () => {
    try {
      const sucursales = await sucursalService.getAll(url + "sucursal");
      setSucursales(sucursales);
    } catch (error) {
      console.log("Error al obtener las sucursales", error);
    }
  };
  useEffect(() => {
    fetchArticulosManufacturados();
    fetchSucursales();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // Si la modal de insumos está abierta, establecer el color de fondo de la modal de producto
    if (showInsumoModal) {
      setModalColor("#f0f0f0");
    } else {
      setModalColor(""); // Si no, dejar el color de fondo predeterminado
    }
  }, [showInsumoModal]);
  const handelAddArticulosManufacturados = (detalles: PromocionDetalle[]) => {
    console.log("Detalles a guardar:", detalles);
    setPromocionDetalles(detalles);
    setDetalles(detalles); // Guardar los detalles en el estado
  };
  useEffect(() => {
    setDetalles(promocionToEdit?.promocionDetalle || []);
}, [promocionToEdit]);
  return (
    <Modal
      id="modal"
      show={modal}
      onHide={handleClose}
      size="lg"
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton style={{ backgroundColor: modalColor }}>
        <Modal.Title>
          {promocionToEdit ? "Editar Promoción" : "Agregar Promoción"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: modalColor }}>
        <Formik
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
            fechaDesde: Yup.date().required("Campo requerido"),
            fechaHasta: Yup.date().required("Campo requerido"),
            descripcionDescuento: Yup.string().required("Campo requerido"),
            precioPromocional: Yup.number().required("Campo requerido"),
          })}
          initialValues={initialValues}
          onSubmit={async (values) => {
            try {
              if (promocionToEdit) {
                const respuestas = await Promise.all(
                  detalles.map(async (detalle) => {
                    try {
                      // Verificar si el detalle ya existe
                      if (detalle.id) {
                        // Si el detalle tiene un ID, intenta actualizarlo
                        const respuesta2 = await promocionDetalleService.put(
                          url + "promocionDetalle",
                          detalle.id.toString(),
                          detalle
                        );
                        console.log("Detalle actualizado:", respuesta2);
                        return respuesta2; // Devolver la respuesta para procesamiento adicional
                      } else {
                        // Si el detalle no tiene un ID, insertarlo como nuevo
                        const respuesta2 = await promocionDetalleService.post(
                          url + "promocionDetalle",
                          detalle
                        );
                        console.log("Nuevo detalle insertado:", respuesta2);
                        return respuesta2; // Devolver la respuesta para procesamiento adicional
                      }
                    } catch (error) {
                      console.error("Error en articuloDetalleService:", error);
                      throw error; // Volver a lanzar el error para asegurar que Promise.all() falle
                    }
                  })
                );
                values.promocionDetalle = respuestas;

                await promocionService.put(
                  url + "promocion",
                  values.id.toString(),
                  values
                );
                console.log("Se ha actualizado correctamente.");
              } else {
                console.log(detalles);
                // Realizar todas las solicitudes 'post' de manera concurrente y recolectar sus respuestas
                const respuestas = await Promise.all(
                  detalles.map(async (detalle) => {
                    try {
                      console.log(detalle);
                      // Realizar la solicitud 'post' para cada detalle
                      const respuesta2 = await promocionDetalleService.post(url + "promocionDetalle", detalle);
                      console.log("Respuesta:", respuesta2);
                      return respuesta2; // Devolver la respuesta para procesamiento adicional
                    } catch (error) {
                      console.error(
                        "Error en promocionDetalleService.post():",
                        error
                      );
                      throw error; // Volver a lanzar el error para asegurar que Promise.all() falle
                    }
                  })
                );
                const respuesta3 = await sucursalService.get(url + "sucursal", "1");
                console.log("Respuesta:", respuesta3);
                values.sucursales.push(respuesta3);
                // Una vez que se recolectan todas las respuestas, actualizar el objeto 'values'
                values.promocionDetalle = respuestas;
                console.log('Valores actualizados:', values);

                await promocionService.post(url + "promocion", values);
                console.log("Se ha agregado correctamente.");
              }
              getPromocion();
              handleClose();
            } catch (error) {
              console.error("Error al realizar la operación:", error);
            }
          }}
        >
          {({ setFieldValue, isSubmitting }) => (
            <Form autoComplete="off">
              <div className="row">
                <div className="col-md-4 mb-4">
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
                <div className="col-md-4 mb-4">
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
                <div className="col-md-4 mb-4">
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
                <div className="col-md-4 mb-4">
                  <label htmlFor="horaDesde">Hora Desde:</label>
                  <Field
                    name="horaDesde"
                    type="time"
                    step="1"
                    placeholder="Hora Desde"
                    className="form-control mt-2"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setFieldValue("horaDesde", value);
                    }}
                  />
                  <ErrorMessage
                    name="horaDesde"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="col-md-4 mb-4">
                  <label htmlFor="horaHasta">Hora Hasta:</label>
                  <Field
                    name="horaHasta"
                    type="time"
                    step="1"
                    placeholder="Hora Hasta"
                    className="form-control mt-2"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const value = e.target.value;
                      setFieldValue("horaHasta", value);
                    }}
                  />
                  <ErrorMessage
                    name="horaHasta"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="col-md-4 mb-4">
                  <label htmlFor="descripcionDescuento">
                    Descripción Descuento:
                  </label>
                  <Field
                    name="descripcionDescuento"
                    type="text"
                    placeholder="Descripción descuento"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="descripcionDescuento"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="col-md-4 mb-4">
                  <label htmlFor="precioPromocional">Precio Promocional:</label>
                  <Field
                    name="precioPromocional"
                    type="text"
                    placeholder="Precio promocional"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="precioPromocional"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="col-md-4 mb-4">
                  <label htmlFor="tipoPromocion">Tipo Promoción:</label>
                  <Field
                    name="tipoPromocion"
                    type="text"
                    placeholder="Tipo Promoción"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="tipoPromocion"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="col-md-4 mb-4">
                  <label htmlFor="sucursales">Sucursales:</label>
                  <Field name="sucursales" as="select" multiple className="custom-select">
                    {sucursales.map((sucursal) => (
                      <option key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                      </option>
                    ))}
                  </Field>

                  <ErrorMessage
                    name="sucursales"
                    className="error-message"
                    component="div"
                  />
                </div>

                <div className="col-md-4 mb-4">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setShowInsumoModal(true)}
                  >
                    {promocionToEdit ? "Editar productos" : "Agregar productos"}
                  </Button>
                </div>
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
              <ModalPromocionDetalle
                articulosManufacturados={articulosManufacturados}
                show={showInsumoModal}
                handleClose={() => setShowInsumoModal(false)}
                handleAddInsumo={handelAddArticulosManufacturados}
                initialDetalles={promocionToEdit ? promocionToEdit.promocionDetalle : promocionDetalles || []}
              />
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalPromocion;

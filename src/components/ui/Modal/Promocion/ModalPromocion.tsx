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
import ModalPromocionDetalle from "./ModalPromocionDetalle";
import SucursalShortDtoService from "../../../../services/dtos/SucursalShortDtoService";
import SucursalShorDto from "../../../../types/dto/SucursalShortDto";
import { useParams } from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import ImageSlider from "../../ImagesSlicer/ImageSlider";
import ArticuloManufacturadoService from "../../../../services/ArticuloManufacturadoService";
import ArticuloInsumoService from "../../../../services/ArticuloInsumoService";
import ArticuloDto from "../../../../types/dto/ArticuloDto";
import CategoriaShorDto from "../../../../types/dto/CategoriaShorDto";
import { TipoPromocion } from "../../../../types/enums/TipoPromocion";

interface ModalPromocionProps {
  getPromocion: () => void;
  promocionToEdit?: Promocion;
}

const ModalPromocion: React.FC<ModalPromocionProps> = ({
  getPromocion,
  promocionToEdit,
}) => {
  const promocionService = new PromocionService();
  const [files, setFiles] = useState<File[]>([]);
  const [showInsumoModal, setShowInsumoModal] = useState(false);
  const [modalColor, setModalColor] = useState<string>(""); // Estado para controlar el color de fondo de la modal
  // const [articulosManufacturados, setArticulosManufacturados] = useState<ArticuloManufacturadoShorDto[]>([]);
  // const articuloManufacturadoService = new ArticuloManufacturadoShorDtoService();
  const [detalles, setDetalles] = useState<PromocionDetalle[]>([]);
  const url = import.meta.env.VITE_API_URL;
  const { getAccessTokenSilently } = useAuth0();
  const today = new Date();
  const { sucursalId } = useParams();
  const sucursalService = new SucursalShortDtoService();
  const [sucursales, setSucursales] = useState<SucursalShorDto[]>([]);
  const modal = useAppSelector((state: any) => state.modal.modal);
  const dispatch = useAppDispatch();
  const [totalPrecioPromocional, setTotalPrecioPromocional] = useState<number>(0);
  const productoService = new ArticuloManufacturadoService();
  const articuloInsumoService = new ArticuloInsumoService();
  // const [articuloInsumo, setArticuloInsumo] = useState<IArticuloInsumo[]>([]);
  // const [articuloManufacturado, setArticuloManufacturado] = useState<IArticuloManufacturado[]>([]);
  const [productos, setProductos] = useState<ArticuloDto[]>([]);
  console.log(promocionToEdit)
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
    tipoPromocion: promocionToEdit ? promocionToEdit.tipoPromocion : TipoPromocion.PROMOCION,
    sucursales: promocionToEdit
      ? promocionToEdit.sucursales.map((sucursal: any) => ({
          id: sucursal.id,
          nombre: sucursal.nombre,
          horarioApertura: sucursal.horarioApertura,
          horarioCierre: sucursal.horarioCierre,
          esCasaMatriz: sucursal.esCasaMatriz,
          imagen: sucursal.imagen,
          domicilio: sucursal.domicilio,
          empresa: sucursal.empresa,
          eliminado: sucursal.eliminado || false,
        }))
      : [],
      promocionDetalle: promocionToEdit?.promocionDetalle
      ? promocionToEdit.promocionDetalle.map((detalle: PromocionDetalle) => ({
          id: detalle.id,
          cantidad: detalle.cantidad,
          eliminado: detalle.eliminado || false,
          articulo: {
            id: detalle.articulo.id,
            eliminado: detalle.articulo.eliminado,
            denominacion: detalle.articulo.denominacion,
            precioVenta: detalle.articulo.precioVenta,
            tiempoEstimadoMinutos: detalle.tiempoEstimadoMinutos || 0,
            unidadMedida: detalle.unidadMedida || {
              id: 0,
              nombre: "",
              abreviatura: ""
            },
            precioCompra: detalle.precioCompra || 0,
            stockActual: detalle.stockActual || 0,
            stockMaximo: detalle.stockMaximo || 0,
            imagen: detalle.imagen || {
              id: 0,
              url: "",
              descripcion: ""
            },
            categoria: detalle.categoria
              ? {
                  denominacion: detalle.categoria.denominacion,
                  esInsumo: detalle.categoria.esInsumo,
                }
              : {
                  denominacion: "",
                  esInsumo: false,
                } as CategoriaShorDto,
          } as ArticuloDto,
        }))
      : [],
    imagenes: promocionToEdit
      ? promocionToEdit.imagenes?.map(
          (imagen: any) =>
            ({
              url: imagen.url,
              name: "image",
              id: imagen.id
            } as Imagen)
        )
      : [],
  };
  const handleClose = () => {
    dispatch(toggleModal({ modalName: "modal" }));
  };

  useEffect(() => {
    const fetchData = async () => {
      if(sucursalId){
        const sucursalIdNumber = parseInt(sucursalId); // Convertir sucursalId a número si es una cadena

        const productData = await productoService.manufacturados(
          url, sucursalIdNumber, await getAccessTokenSilently({})
        );
        const insumData = await articuloInsumoService.insumos(
          url, sucursalIdNumber, await getAccessTokenSilently({})
        );
        // Filtrar los productos manufacturados y los insumos
        const insumos = insumData.filter((insumo) => !insumo.esParaElaborar);
        // setArticuloManufacturado(productData);
        // setArticuloInsumo(insumos);
        // Combinar los productos manufacturados y los insumos en un solo array
  
        const combinedData = [...productData, ...insumos];

        const mergedProducts = combinedData.map((value) => ({
          id: value.id,
          categoria: value.categoria,
          denominacion: value.denominacion,
          precioVenta: value.precioVenta,
          eliminado: value.eliminado,
          imagen: value.imagenes[0] || undefined,
          precioCompra: 0,
          stockActual: 0,
          stockMaximo: 0,
          tiempoEstimadoMinutos: value.tiempoEstimadoMinutos || 0,
          unidadMedida: value.unidadMedida,
        }));
        console.log(mergedProducts)
        setProductos(mergedProducts);
      }
    };
    fetchData();
  }, []);
  const fetchSucursales = async () => {
    try {
      if (sucursalId) {
        const sucursalSeleccionada = await sucursalService.get(
          url + "sucursal",
          sucursalId, await getAccessTokenSilently({})
        );
        const empresaId = sucursalSeleccionada.empresa.id;

        const sucursalesEmpresa = await sucursalService.sucursalEmpresa(url, empresaId, await getAccessTokenSilently({}));
        setSucursales(sucursalesEmpresa);
      }
    } catch (error) {
      console.log("Error al obtener las sucursales", error);
    }
  };
  useEffect(() => {
    // fetchArticulosManufacturados();
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
    // setPromocionDetalles(detalles);

    setDetalles(detalles); // Guardar los detalles en el estado
    const sumaPrecios = detalles.map((detalle: any) =>
      detalle.cantidad * detalle.articulo.precioVenta
    ).reduce((total: number, precioPromocional: number) => total + precioPromocional, 0);    
    setTotalPrecioPromocional(sumaPrecios);
    console.log(totalPrecioPromocional)
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      console.log(files);
    }
  };
  
  useEffect(() => {
    setDetalles(promocionToEdit?.promocionDetalle || []);
  }, [promocionToEdit]);

  const handleUpload = async (articuloId: string) => {
    if (files.length > 0 && articuloId) {
      try {
        const accessToken = await getAccessTokenSilently({});
        const uploadPromises = files.map(file =>
          promocionService.uploadFile(
            `${url}promocion/uploads`,
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
    } else {
      console.log("No files or articuloId not set.");
    }
  };
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
            // imagenes: Yup.array().min(1, "Debe agregar al menos una imagen").required("Campo requerido")
          })}
          initialValues={initialValues}
          onSubmit={async (values) => {
            try {
              let promocion = undefined;
              console.log(values)
              if (promocionToEdit) {
                // const respuestas = await Promise.all(
                //   detalles.map(async (detalle) => {
                //     try {
                //       // Verificar si el detalle ya existe
                //       if (detalle.id) {
                //         // Si el detalle tiene un ID, intenta actualizarlo
                //         const respuesta2 = await promocionDetalleService.put(
                //           url + "promocionDetalle",
                //           detalle.id.toString(),
                //           detalle, await getAccessTokenSilently({})
                //         );
                //         console.log("Detalle actualizado:", respuesta2);
                //         return respuesta2; // Devolver la respuesta para procesamiento adicional
                //       } else {
                //         // Si el detalle no tiene un ID, insertarlo como nuevo
                //         const respuesta2 = await promocionDetalleService.post(
                //           url + "promocionDetalle",
                //           detalle, await getAccessTokenSilently({})
                //         );
                //         console.log("Nuevo detalle insertado:", respuesta2);
                //         return respuesta2; // Devolver la respuesta para procesamiento adicional
                //       }
                //     } catch (error) {
                //       console.error("Error en articuloDetalleService:", error);
                //       throw error; // Volver a lanzar el error para asegurar que Promise.all() falle
                //     }
                //   })
                // );
                // values.promocionDetalle = respuestas;
                
                const sucursalesSeleccionadas = values.sucursales;
                values.promocionDetalle = detalles;
                // añadimos todas las sucursales seleccionadas al array de sucursales en values
                values.sucursales = sucursalesSeleccionadas;
                promocion = await promocionService.put(
                  url + "promocion",
                  values.id.toString(),
                  values, await getAccessTokenSilently({})
                );

                const promocionId = promocion.id.toString();
                if (files.length > 0 && promocionId) {
                  handleUpload(promocionId);
                }
              } else {
                console.log(files)
                console.log(values.imagenes)
                // Realizar todas las solicitudes 'post' de manera concurrente y recolectar sus respuestas
                const sucursalesSeleccionadas = values.sucursales;
                // Ahora, en lugar de agregar una sola sucursal (como la de ID 1),
                // añadimos todas las sucursales seleccionadas al array de sucursales en values
                values.sucursales = sucursalesSeleccionadas;
                // Una vez que se recolectan todas las respuestas, actualizar el objeto 'values'
                values.promocionDetalle = detalles;
                console.log("Valores actualizados:", values);

                promocion = await promocionService.post(url + "promocion", values, await getAccessTokenSilently({}));

                const promocionId = promocion.id.toString();
                if (files.length > 0 && promocionId) {
                  handleUpload(promocionId);
                }
              }

              getPromocion();
              handleClose();
            } catch (error) {
              console.error("Error al realizar la operación:", error);
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting  }) => (
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
                    className="error-message text-danger"
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
                    className="error-message text-danger"
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
                    className="error-message text-danger"
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
                    className="error-message text-danger"
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
                    className="error-message text-danger"
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
                    className="error-message text-danger"
                    component="div"
                  />
                </div>
                <div className="col-md-4 mb-4">
                  <label htmlFor="precioPromocional">Precio Promocional:</label>
                  <Field
                    name="precioPromocional"
                    type="number"
                    placeholder="Precio promocional"
                    className="form-control mt-2"
                    />
                  <ErrorMessage
                    name="precioPromocional"
                    className="error-message text-danger"
                    component="div"
                  />
                </div>
                <div className="col-md-4 mb-4">
                  <label htmlFor="tipoPromocion">Tipo Promoción:</label>
                  <Field
                    name="tipoPromocion"
                    as="select" // Render as a select input
                    className="form-control mt-2"
                  >
                    <option value={TipoPromocion.HAPPY_HOUR}>HAPPY_HOUR</option>
                    <option value={TipoPromocion.PROMOCION}>PROMOCIóN</option>
                  </Field>
                  <ErrorMessage
                    name="tipoPromocion"
                    className="error-message text-danger"
                    component="div"
                  />
                </div>
                <div className="col-md-4 mb-4">
                  <label htmlFor="imagenes">Imágenes:</label>
                  <input
                    name="imagen"
                    type="file"
                    className="form-control my-2"
                    onChange={handleFileChange}
                    multiple
                  />
                   <ErrorMessage
                    name="imagenes"
                    className="error-message text-danger"
                    component="div"
                  />
                </div>
               
                <div className="mb-4">
                  <label>Sucursales:</label>
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                    {sucursales.map((sucursal) => (
                      <div key={sucursal.id} className="col mb-2">
                        <div className="form-check">
                          <Field
                            name="sucursales"
                            type="checkbox"
                            value={sucursal.id}
                            checked={values.sucursales.some(
                              (s) => s.id === sucursal.id
                            )}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              if (e.target.checked) {
                                setFieldValue("sucursales", [
                                  ...values.sucursales,
                                  sucursal,
                                ]);
                              } else {
                                setFieldValue(
                                  "sucursales",
                                  values.sucursales.filter(
                                    (s) => s.id !== sucursal.id
                                  )
                                );
                              }
                            }}
                            className="form-check-input"
                            id={`sucursal-${sucursal.id}`}
                          />
                          <label
                            className="form-check-label ml-2"
                            htmlFor={`sucursal-${sucursal.id}`}
                          >
                            {sucursal.nombre}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
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
                {values.imagenes.length > 0 && (
                  <div className="col-md-4 mb-4">
                    <ImageSlider images={values.imagenes} urlParteVariable="promocion" />
                  </div>
                )}
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
                articulos={productos}
                show={showInsumoModal}
                handleClose={() => setShowInsumoModal(false)}
                handleAddInsumo={handelAddArticulosManufacturados}
                initialDetalles={
                  promocionToEdit
                    ? promocionToEdit.promocionDetalle
                    : []
                }
              />
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalPromocion;

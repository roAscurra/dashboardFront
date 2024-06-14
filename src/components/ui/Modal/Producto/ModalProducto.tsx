import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, Modal, Row, Col } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ArticuloManufacturadoService from "../../../../services/ArticuloManufacturadoService.ts";
import UnidadMedidaService from "../../../../services/UnidadMedidaService.ts";
import CategoriaService from "../../../../services/CategoriaService.ts";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts";
import { toggleModal } from "../../../../redux/slices/Modal.ts";
import ArticuloManufacturado from "../../../../types/ArticuloManufacturado.ts";
import UnidadMedida from "../../../../types/UnidadMedida.ts";
import Categoria from "../../../../types/Categoria.ts";
import ModalInsumo from "./ModalInsumo.tsx";
import ArticuloManufacturadoDetalle from "../../../../types/ArticuloManufacturadoDetalle.ts";
import ArticuloInsumoShortDto from "../../../../types/dto/ArticuloInsumoShortDto.ts";
import ArticuloInsumoShortService from "../../../../services/dtos/ArticuloInsumoShortService.ts";
// import ArticuloManufacturadoDetalleService from "../../../../services/ArticuloManufacturadoDetalleService.ts";
import { useParams } from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";

interface ModalProductProps {
  getProducts: () => void;
  productToEdit?: ArticuloManufacturado;
}

const ModalProducto: React.FC<ModalProductProps> = ({
  getProducts,
  productToEdit,
}) => {
  const productoService = new ArticuloManufacturadoService();
  const unidadService = new UnidadMedidaService();
  const insumoService = new ArticuloInsumoShortService();
  const { sucursalId } = useParams();
  const categoriaService = new CategoriaService();
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [insumos, setInsumos] = useState<ArticuloInsumoShortDto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [showInsumoModal, setShowInsumoModal] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [articuloManufacturadoDetalles, setArticuloManufacturadoDetalles] =
    useState<ArticuloManufacturadoDetalle[]>(
      productToEdit?.articuloManufacturadoDetalles || []
    );
  const url = import.meta.env.VITE_API_URL;
  const { getAccessTokenSilently } = useAuth0();
  const [modalColor, setModalColor] = useState<string>(""); // Estado para controlar el color de fondo de la modal
  const [detalles, setDetalles] = useState<ArticuloManufacturadoDetalle[]>([]);

  const initialValues: ArticuloManufacturado = {
    id: productToEdit ? productToEdit.id : 0,
    eliminado: productToEdit ? productToEdit.eliminado : false,
    denominacion: productToEdit?.denominacion || "",
    precioVenta: productToEdit?.precioVenta || 0,
    imagenes: productToEdit?.imagenes?.map((imagen: any) => imagen.denominacion) || [],
    unidadMedida: productToEdit?.unidadMedida ? { ...productToEdit.unidadMedida } : {
      id: 0,
      eliminado: false,
      denominacion: "",
    },
    descripcion: productToEdit?.descripcion || "",
    tiempoEstimadoMinutos: productToEdit?.tiempoEstimadoMinutos || 0,
    preparacion: productToEdit?.preparacion || "",
    articuloManufacturadoDetalles: productToEdit?.articuloManufacturadoDetalles ? productToEdit.articuloManufacturadoDetalles.map((detalle: any) => {
      const articuloInsumo = detalle.articuloInsumo || {};
      const categoria = articuloInsumo.categoria || {};
      const sucursal = articuloInsumo.sucursal || { id: 0 };
  
      return {
        id: detalle.id,
        cantidad: detalle.cantidad,
        eliminado: detalle.eliminado,
        articuloInsumo: {
          id: articuloInsumo.id || 0,
          eliminado: detalle.eliminado,
          denominacion: articuloInsumo.denominacion || "",
          precioVenta: articuloInsumo.precioVenta || 0,
          unidadMedida: detalle.unidadMedida || "",
          precioCompra: detalle.precioCompra || 0,
          stockActual: detalle.stockActual || 0,
          stockMaximo: detalle.stockMaximo || 0,
          stockMinimo: detalle.stockMinimo || 0,
          esParaElaborar: detalle.esParaElaborar || false,
          categoria: {
            id: categoria.id || 0,
            eliminado: categoria.eliminado || false,
            denominacion: categoria.denominacion || "",
            esInsumo: categoria.esInsumo || false,
          },
          sucursal: sucursal.id,
        },
      };
    }) : [],
    categoria: productToEdit?.categoria ? { ...productToEdit.categoria } : {
      id: 0,
      eliminado: false,
      denominacion: "",
      esInsumo: false,
      subCategorias: [],
      sucursales: [],
    },
    sucursal: productToEdit?.sucursal ? { ...productToEdit.sucursal } : {
      id: 0,
      eliminado: false,
      nombre: "",
      domicilio: {
        id: 0,
        eliminado: false,
        calle: "",
        numero: 0,
        cp: 0,
        piso: 0,
        nroDpto: 0,
      },
    },
  };
  

  const modal = useAppSelector((state: any) => state.modal.modal);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(toggleModal({ modalName: "modal" }));
    setInsumos([])
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const fetchArticuloInsumo = async () => {
    try {
      // Asegúrate de que sucursalId esté definido y conviértelo a un número
      if (sucursalId) {
        const sucursalIdNumber = parseInt(sucursalId); // Convertir sucursalId a número si es una cadena

        // Filtrar los insumos por sucursal y categoría
        const articulosInsumos = await insumoService.insumosParaElaborar(
          `${url}`, sucursalIdNumber, await getAccessTokenSilently({})
        );
  
        setInsumos(articulosInsumos);
      }
    } catch (error) {
      console.error("Error al obtener los insumos:", error);
    }
  };

  const fetchUnidadesMedida = async () => {
    try {
      const unidades = await unidadService.getAll(`${url}unidadMedida`, await getAccessTokenSilently({}));
      setUnidadesMedida(unidades);
    } catch (error) {
      console.error("Error al obtener las unidades de medida:", error);
    }
  };

  const fetchCategorias = async () => {
    try {
      if (sucursalId) {
        const parsedSucursalId = parseInt(sucursalId, 10);
        const categorias = await categoriaService.categoriaSucursal(url, parsedSucursalId, await getAccessTokenSilently({}));
        setCategorias(categorias);
      }
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };
  useEffect(() => {
    fetchArticuloInsumo();
    fetchUnidadesMedida();
    fetchCategorias();
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

  const handleAddInsumo = (detalles: ArticuloManufacturadoDetalle[]) => {
    setArticuloManufacturadoDetalles(detalles);
    setDetalles(detalles); // Guardar los detalles en el estado
  };
  useEffect(() => {
    setDetalles(productToEdit?.articuloManufacturadoDetalles || []);
  }, [productToEdit]);
  console.log(insumos)
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
      <Modal.Header closeButton style={{ backgroundColor: modalColor }}>
        <Modal.Title>
          {productToEdit ? "Editar Producto" : "Agregar Producto"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: modalColor }}>
        <Formik
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
            precioVenta: Yup.number().required("Campo requerido"),
            descripcion: Yup.string().required("Campo requerido"),
            preparacion: Yup.string().required("Campo requerido"),
            // categoria: Yup.number().required('Campo requerido'), // Agregar validación para la categoría
            // unidadMedida: Yup.string().required('Campo requerido'), // Agregar validación para la unidad de medida
            tiempoEstimadoMinutos: Yup.number().required("Campo requerido"),
          })}
          initialValues={initialValues}
          onSubmit={async (values: ArticuloManufacturado) => {
            try {
              let productoId: string | null = null;

              if (productToEdit) {

                values.articuloManufacturadoDetalles = detalles;
                // Actualizar el producto 
                await productoService.put(
                  url + "articuloManufacturado",
                  values.id.toString(),
                  values, await getAccessTokenSilently({})
                );
                productoId = productToEdit.id.toString();
              } else {
                values.articuloManufacturadoDetalles = detalles;
                if(sucursalId){
                  const sucursalIdNumber = parseInt(sucursalId);
                  values.sucursal.id = sucursalIdNumber;
                }
                const response = await productoService.post(
                  url + "articuloManufacturado",
                  values, await getAccessTokenSilently({})
                );

                productoId = response.id.toString();
              }

              if (file && productoId) {
                const response = await productoService.uploadFile(
                  url + "articuloManufacturado/uploads",
                  file,
                  productoId, await getAccessTokenSilently({})
                );
                console.log("Upload successful:", response);
              }

              getProducts();
              handleClose();
            } catch (error) {
              console.error("Error al realizar la operación:", error);
              console.log(JSON.stringify(values));
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form autoComplete="off">
              <Row>
                <Col>
                  <label htmlFor="denominacion">Nombre:</label>
                  <Field
                    name="denominacion"
                    type="text"
                    placeholder="Nombre del Producto"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="denominacion"
                    className="error-message"
                    component="div"
                  />

                  <label htmlFor="precioVenta">Precio de Venta:</label>
                  <Field
                    name="precioVenta"
                    type="number"
                    placeholder="Precio de Venta"
                    className="form-control my-2"
                  />
                  <ErrorMessage
                    name="precioVenta"
                    className="error-message"
                    component="div"
                  />

                  <label htmlFor="preparacion">Preparación:</label>
                  <Field
                    name="preparacion"
                    type="text"
                    placeholder="Preparación"
                    className="form-control my-2"
                  />
                  <ErrorMessage
                    name="preparacion"
                    className="error-message"
                    component="div"
                  />

                  <label htmlFor="categoria">Categoria:</label>
                  <Field
                    name="categoria"
                    as="select"
                    className="form-control"
                    onChange={(event: { target: { value: string } }) => {
                      const categoriaSelect = parseInt(event.target.value);
                      const selectedCategoria = categorias.find(
                        (categoria) => categoria.id === categoriaSelect
                      );

                      if (selectedCategoria) {
                        setFieldValue("categoria", selectedCategoria);
                      } else {
                        console.error(
                          "No se encontró la categoria seleccionada"
                        );
                      }
                    }}
                    value={values.categoria ? values.categoria.id : ""}
                  >
                    <option value="">Seleccionar categoria</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.denominacion}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="categoria"
                    className="error-message"
                    component="div"
                  />
                </Col>
                <Col>
                  <label htmlFor="tiempoEstimadoMinutos">
                    Tiempo Estimado (en minutos):
                  </label>
                  <Field
                    name="tiempoEstimadoMinutos"
                    type="number"
                    placeholder="Tiempo Estimado"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="tiempoEstimadoMinutos"
                    className="error-message"
                    component="div"
                  />

                  <label htmlFor="descripcion">Descripción:</label>
                  <Field
                    name="descripcion"
                    type="text"
                    placeholder="Descripción"
                    className="form-control my-2"
                  />
                  <ErrorMessage
                    name="descripcion"
                    className="error-message"
                    component="div"
                  />

                  <label htmlFor="unidadMedida">Unidad de Medida:</label>
                  <Field
                    name="unidadMedida"
                    as="select"
                    className="form-control"
                    onChange={(event: { target: { value: string } }) => {
                      const selectedUnitId = parseInt(event.target.value);
                      const selectedUnidad = unidadesMedida.find(
                        (unidad) => unidad.id === selectedUnitId
                      );

                      if (selectedUnidad) {
                        setFieldValue("unidadMedida", selectedUnidad);
                      } else {
                        console.error("No se encontró la unidad seleccionada");
                      }
                    }}
                    value={values.unidadMedida ? values.unidadMedida.id : ""}
                  >
                    <option value="">Seleccionar Unidad de Medida</option>
                    {unidadesMedida.map((unidad) => (
                      <option key={unidad.id} value={unidad.id}>
                        {unidad.denominacion}
                      </option>
                    ))}
                  </Field>

                  <ErrorMessage
                    name="unidadMedida"
                    className="error-message"
                    component="div"
                  />

                  <label htmlFor="imagen">Imagen:</label>
                  <input
                    name="imagen"
                    type="file"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                      const files = event.target.files;
                      if (files && files.length > 0) {
                        // Si se selecciona una imagen nueva, maneja el cambio de archivo
                        handleFileChange(event);
                      } else {
                        
                        // Si no se selecciona ninguna imagen nueva, no hagas nada para mantener las imágenes existentes
                      }
                    }}
                    className="form-control my-2"
                  />
                  <ErrorMessage
                    name="imagen"
                    className="error-message"
                    component="div"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setShowInsumoModal(true)}
                  >
                    {productToEdit ? "Editar Insumos" : "Agregar insumos"}
                  </Button>
                </Col>
              </Row>
              <ModalInsumo
                insumos={insumos}
                show={showInsumoModal}
                handleClose={() => setShowInsumoModal(false)}
                handleAddInsumo={handleAddInsumo}
                initialDetalles={
                  productToEdit
                    ? productToEdit.articuloManufacturadoDetalles
                    : articuloManufacturadoDetalles || []
                }
              />
              <Button type="submit" className="btn btn-primary mt-3">
                {productToEdit ? "Guardar Cambios" : "Agregar Producto"}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalProducto;

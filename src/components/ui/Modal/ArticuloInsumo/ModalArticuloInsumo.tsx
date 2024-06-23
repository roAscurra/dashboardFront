import { Button, Col, Modal, Row } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ArticuloInsumoService from "../../../../services/ArticuloInsumoService";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import IUnidadMedida from "../../../../types/UnidadMedida";
import { toggleModal } from "../../../../redux/slices/Modal";
import ArticuloInsumo from "../../../../types/ArticuloInsumoType";
import UnidadMedidaService from "../../../../services/UnidadMedidaService";
import { useEffect, useState, ChangeEvent } from "react";
import CategoriaService from "../../../../services/CategoriaService";
import Categoria from "../../../../types/Categoria";
import ImagenArticulo from "../../../../types/ImagenArticulo";
import { useParams } from "react-router-dom";
import {useAuth0} from "@auth0/auth0-react";
import ImageSlider from "../../ImagesSlicer/ImageSlider";
// import ImagenArticuloService from "../../../../services/ImagenArticuloService";

interface ModalArticuloInsumoProps {
  getArticulosInsumo: () => void;
  articuloToEdit?: ArticuloInsumo;
}

const ModalArticuloInsumo: React.FC<ModalArticuloInsumoProps> = ({
  getArticulosInsumo,
  articuloToEdit,
}) => {
  const { getAccessTokenSilently } = useAuth0();
  const articuloInsumoService = new ArticuloInsumoService();
  const unidadService = new UnidadMedidaService();
  const categoriaService = new CategoriaService();
  // const imagenService = new ImagenArticuloService();
  // const [images, setImages] = useState<ImagenArticulo[]>([]);
  const [unidadesMedida, setUnidadesMedida] = useState<IUnidadMedida[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const url = import.meta.env.VITE_API_URL;

  const initialValues: ArticuloInsumo = {
    id: articuloToEdit ? articuloToEdit.id : 0,
    eliminado: articuloToEdit ? articuloToEdit.eliminado : false,
    denominacion: articuloToEdit ? articuloToEdit.denominacion : "",
    precioVenta: articuloToEdit ? articuloToEdit.precioVenta : 0,
    precioCompra: articuloToEdit ? articuloToEdit.precioCompra : 0,
    stockActual: articuloToEdit ? articuloToEdit.stockActual : 0,
    stockMaximo: articuloToEdit ? articuloToEdit.stockMaximo : 0,
    stockMinimo: articuloToEdit ? articuloToEdit.stockMinimo : 0,
    esParaElaborar: articuloToEdit ? articuloToEdit.esParaElaborar : false,
    imagenes: articuloToEdit ? articuloToEdit.imagenes.map(
        (imagen: any) =>
          ({
            url: imagen.url,
            name: "image",
            id: imagen.id
          } as ImagenArticulo)
      )
    : [],
    unidadMedida:
      articuloToEdit && articuloToEdit.unidadMedida
        ? { ...articuloToEdit.unidadMedida }
        : {
            id: 0,
            eliminado: false,
            denominacion: "",
          },
    categoria:
      articuloToEdit && articuloToEdit.categoria
        ? articuloToEdit.categoria
        : {
            id: 0,
            eliminado: false,
            denominacion: "",
            esInsumo: false,
            subCategorias: [],
            sucursales: [],
          },
    sucursal: articuloToEdit?.sucursal
    ? { ...articuloToEdit.sucursal }
    : {
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
          nroDpto: 0
        },
      },
  };
  const { sucursalId } = useParams();
  const modal = useAppSelector((state: any) => state.modal.modal);
  const dispatch = useAppDispatch();

  const handleClose = () => {
    setFiles([])
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFieldValue: any, existingImages: ImagenArticulo[]) => {
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
  
  
  const fetchCategorias = async () => {
    try {
      if (sucursalId) {
        const parsedSucursalId = parseInt(sucursalId, 10); 
        const categorias = await categoriaService.categoriaInsumoSucursal(url, parsedSucursalId, await getAccessTokenSilently({}));
        setCategorias(categorias);
      }
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const fetchUnidadesMedida = async () => {
    try {
      const unidades = await unidadService.getAll(url + "unidadMedida", await getAccessTokenSilently({}));
      setUnidadesMedida(unidades);
    } catch (error) {
      console.error("Error al obtener las unidades de medida:", error);
    }
  };

  useEffect(() => {
    fetchUnidadesMedida();
    fetchCategorias();
  }, []);
  const handleUpload = async (articuloId: string) => {
    if (files.length > 0 && articuloId) {
      try {
        const accessToken = await getAccessTokenSilently({});
        const uploadPromises = files.map(file =>
          articuloInsumoService.uploadFile(
            `${url}articuloInsumo/uploads`,
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
      getArticulosInsumo(); 
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
      getArticulosInsumo(); 
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
          {articuloToEdit
            ? "Editar Artículo de Insumo"
            : "Agregar Artículo de Insumo"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
            precioVenta: Yup.number().required("Campo requerido"),
            precioCompra: Yup.number().required("Campo requerido"),
            stockActual: Yup.number().required("Campo requerido"),
            stockMaximo: Yup.number().required("Campo requerido"),
            esParaElaborar: Yup.boolean().required("Campo requerido"),
            imagenes: Yup.array().min(1, "Debe agregar al menos una imagen").required("Campo requerido")
          })}
          initialValues={initialValues}
          onSubmit={async (values: ArticuloInsumo) => {
            console.log(values)
            try {
              let articuloId: string | null = null;
              
              if (articuloToEdit) {
                if (files.length === 0 && values.imagenes.length === 0) {
                  // Si no hay archivos adjuntos (imágenes) nuevos y el artículo no tiene imágenes existentes, mostrar un mensaje de error
                  alert("Debe agregar al menos una imagen.");
                  return; // Salir de la función onSubmit sin continuar
                }else{
                  // Guardar el ID del artículo actualizado si es necesario
                  articuloId = values.id.toString();     
                  if (files.length > 0 && articuloId) {
                    handleUpload(articuloId);
                  } 
                  console.log(values)
                  // Llamar al servicio put y capturar la respuesta
                  await articuloInsumoService.put(
                    url + "articuloInsumo",
                    values.id.toString(),
                    values,
                    await getAccessTokenSilently({})
                  );  
                }
                 
              } else {
                if(sucursalId){
                  const sucursalIdNumber = parseInt(sucursalId);
                  values.sucursal.id = sucursalIdNumber;
                }
                values.imagenes = [];
                const response = await articuloInsumoService.post(
                  url + "articuloInsumo",
                  values, await getAccessTokenSilently({})
                );
                console.log(values)
                console.log(response)
                articuloId = response.id.toString();
                if (files.length > 0 && articuloId) {
                  handleUpload(articuloId);
                }
              }

              getArticulosInsumo(); 
              handleClose();

            } catch (error) {
              console.error("Error al realizar la operación:", error);
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form autoComplete="off">
              <Row>
                <Col>
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

                  <label htmlFor="precioVenta">Precio de Venta:</label>
                  <Field
                    name="precioVenta"
                    type="number"
                    placeholder="Precio de Venta"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="precioVenta"
                    className="error-message text-danger"
                    component="div"
                  />

                  <label htmlFor="precioCompra">Precio de Compra:</label>
                  <Field
                    name="precioCompra"
                    type="number"
                    placeholder="Precio de Compra"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="precioCompra"
                    className="error-message text-danger"
                    component="div"
                  />
                  <label htmlFor="esParaElaborar">Es para elaborar:</label>
                  <Field
                    name="esParaElaborar"
                    as="select" // Utiliza "as" para especificar que este campo es un select
                    className="form-control"
                  >
                    <option value="true">Sí</option> 
                    <option value="false">No</option>
                  </Field>
                  <ErrorMessage
                    name="esParaElaborar"
                    className="error-message text-danger"
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
                        console.error("No se encontró la categoria seleccionada");
                      }
                    }}
                    value={values.categoria ? values.categoria.id : ""}
                  >
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.denominacion}
                      </option>
                    ))}
                  </Field>
                </Col>
                <Col>
                  <label htmlFor="stockActual">Stock Actual:</label>
                  <Field
                    name="stockActual"
                    type="number"
                    placeholder="Stock Actual"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="stockActual"
                    className="error-message"
                    component="div"
                  />
                  <label htmlFor="stockMaximo">Stock Máximo:</label>
                  <Field
                    name="stockMaximo"
                    type="number"
                    placeholder="Stock Máximo"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="stockMaximo"
                    className="error-message text-danger"
                    component="div"
                  />
                  <label htmlFor="stockMinimo">Stock Minimo:</label>
                  <Field
                    name="stockMinimo"
                    type="number"
                    placeholder="Stock Minimo"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="stockMinimo"
                    className="error-message text-danger"
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
                    {unidadesMedida.map((unidad) => (
                      <option key={unidad.id} value={unidad.id}>
                        {unidad.denominacion}
                      </option>
                    ))}
                  </Field>
                  <label htmlFor="imagenes">Imágenes:</label>
                  <input
                    name="imagen"
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
              </Row>
              {values.imagenes.length > 0 && (
                <Row>
                  <ImageSlider images={values.imagenes} urlParteVariable="articuloInsumo" 
                  onDeleteImage={(images) => handleDeleteImage(images, setFieldValue)}
                  />
                </Row>
              )}
              <Row className="mt-4">
                <Col className="text-end">
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
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default ModalArticuloInsumo;

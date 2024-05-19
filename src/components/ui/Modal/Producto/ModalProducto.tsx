import React, { useEffect, useState } from 'react';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
// import ArticuloManufacturadoDetalleService from "../../../../services/ArticuloManufacturadoDetalleService.ts";
import ArticuloManufacturadoService from "../../../../services/ArticuloManufacturadoService.ts";
import UnidadMedidaService from "../../../../services/UnidadMedidaService.ts";
import ArticuloManufacturado from "../../../../types/ArticuloManufacturado.ts";
import ArticuloInsumoService from "../../../../services/ArticuloInsumoService.ts";
import CategoriaService from "../../../../services/CategoriaService.ts";
import ImagenArticuloService from "../../../../services/ImagenArticuloService.ts";
import UnidadMedida from "../../../../types/UnidadMedida.ts";
import ArticuloInsumoType from "../../../../types/ArticuloInsumoType.ts";
import Categoria from "../../../../types/Categoria.ts";
import {useAppDispatch, useAppSelector} from "../../../../hooks/redux.ts";
import {toggleModal} from "../../../../redux/slices/Modal.ts";

interface ModalProductProps {
    getProducts: () => void;
    productToEdit?: ArticuloManufacturado;
}

const ModalProducto: React.FC<ModalProductProps> = ({ getProducts, productToEdit }) => {
    const productoService = new ArticuloManufacturadoService();
    const unidadService = new UnidadMedidaService();
    const insumoService = new ArticuloInsumoService();
    const categoriaService = new CategoriaService();
    const imagenArticuloService = new ImagenArticuloService();
    // const articuloManufacturadoDetalles = new ArticuloManufacturadoDetalleService();
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
    const [insumos, setInsumos] = useState<ArticuloInsumoType[]>([]);
    const [categorias, setCategoria] = useState<Categoria[]>([]);
    const [selectedInsumo, setSelectedInsumo] = useState<number | null>(null);
    const url = import.meta.env.VITE_API_TRAZA;

    const initialValues: ArticuloManufacturado = {
        id: productToEdit ? productToEdit.id : 0,
        eliminado: productToEdit ? productToEdit.eliminado : false,
        denominacion: productToEdit ? productToEdit.denominacion : '',
        precioVenta: productToEdit ? productToEdit.precioVenta : 0,
        imagenes: productToEdit ? productToEdit.imagenes.map((imagen: any) => imagen.denominacion) : [],
        unidadMedida: productToEdit && productToEdit.unidadMedida
            ? { ...productToEdit.unidadMedida }
            : {
                id: 0,
                eliminado: false,
                denominacion: '',
            },
        descripcion: productToEdit ? productToEdit.descripcion : '',
        tiempoEstimadoMinutos: productToEdit ? productToEdit.tiempoEstimadoMinutos : 0,
        preparacion: productToEdit ? productToEdit.preparacion : '',
        articuloManufacturadoDetalles: productToEdit && productToEdit.articuloManufacturadoDetalles
            ? productToEdit.articuloManufacturadoDetalles.map((detalle: any) => ({...detalle}))
            : [],
        nuevaImagen: productToEdit ? productToEdit.imagenes[0].url : '',

    };


    const modal = useAppSelector((state) => state.modal.modal);
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(toggleModal({ modalName: 'modal' }));
    };

    const fetchArticuloInsumo = async () => {
        try {
            const articulosInsumos = await insumoService.getAll(url + '/articuloInsumo');
            setInsumos(articulosInsumos);
        } catch (error) {
            console.error("Error al obtener los insumos:", error);
        }
    };

    const fetchUnidadesMedida = async () => {
        try {
            const unidades = await unidadService.getAll(url + '/unidadMedida');
            setUnidadesMedida(unidades);
        } catch (error) {
            console.error('Error al obtener las unidades de medida:', error);
        }
    };

    const fetchCategorias = async () => {
        try {
            const categorias = await categoriaService.getAll(url + '/categoria');
            setCategoria(categorias);
        } catch (error) {
            console.error('Error al obtener las categorias:', error);
        }
    };

    useEffect(() => {
        fetchArticuloInsumo();
        fetchUnidadesMedida();
        fetchCategorias();
    }, []);

    // Función para obtener el último ID de los detalles
    // const getLastId = (detalles: IArticuloManufacturadoDetalle[]): number => {
    //     return detalles.reduce((maxId, detalle) => Math.max(maxId, detalle.id), 0);
    // };

    // Función para manejar la adición de un insumo
    const handleAddInsumo = async (arrayHelpers: any, values: ArticuloManufacturado) => {
        console.log("handleAddInsumo called with selectedInsumo:", selectedInsumo);
        console.log("Current articuloManufacturadoDetalles:", values.articuloManufacturadoDetalles);

        if (selectedInsumo !== null) {
            const insumo = insumos.find(insumo => insumo.id === selectedInsumo);
            console.log("Found insumo:", insumo);

            if (insumo) {
                try {
                    // const nuevaCantidad = values.articuloManufacturadoDetalles.find(detalle => detalle.articuloInsumo.id === selectedInsumo)?.cantidad || 0;

                    // // Crear el nuevo detalle mediante el servicio
                    // const nuevoDetalle = await articuloManufacturadoDetalles.post(url + 'api/articuloManufacturadoDetalle', {
                    //     id: 0, // Este ID será ignorado por el backend y se generará uno nuevo
                    //     eliminado: false,
                    //     cantidad: nuevaCantidad, // Utiliza la cantidad ingresada por el usuario
                    //     articuloInsumo: insumo,
                    //     articuloManufacturadoId: values.id, // Asume que el ID del artículo manufacturado está disponible
                    // });

                    // console.log("Nuevo detalle creado:", nuevoDetalle);

                    // // Agregar el detalle creado a la lista de detalles
                    // arrayHelpers.push(nuevoDetalle);
                    // console.log("Detalle agregado. Nuevos detalles:", values.articuloManufacturadoDetalles);

                    setSelectedInsumo(null); // Resetea el insumo seleccionado
                } catch (error) {
                    console.error("Error al crear el detalle:", error);
                }
            }
        }
    };

    return (
        <Modal
            id={'modal'}
            show={modal}
            onHide={handleClose}
            size={'lg'}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{productToEdit ? 'Editar Producto' : 'Agregar Producto'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    validationSchema={Yup.object({
                        denominacion: Yup.string().required('Campo requerido'),
                        precioVenta: Yup.number().required('Campo requerido'),
                        descripcion: Yup.string().required('Campo requerido'),
                        tiempoEstimadoMinutos: Yup.number().required('Campo requerido'),
                    })}
                    initialValues={initialValues}
                    onSubmit={async (values: ArticuloManufacturado) => {
                        try {

                            values.articuloManufacturadoDetalles.map((insumo) =>(
                                console.log(insumo.cantidad)
                                // Crear el nuevo detalle mediante el servicio
                                // const nuevoDetalle = await articuloManufacturadoDetalles.post(url + 'api/articuloManufacturadoDetalle', {
                                //     id: 0, // Este ID será ignorado por el backend y se generará uno nuevo
                                //     eliminado: false,
                                //     cantidad: nuevaCantidad, // Utiliza la cantidad ingresada por el usuario
                                //     articuloInsumo: insumo,
                                //     articuloManufacturadoId: values.id, // Asume que el ID del artículo manufacturado está disponible
                                // });

                                // console.log("Nuevo detalle creado:", nuevoDetalle);

                                // // Agregar el detalle creado a la lista de detalles
                                // console.log("Detalle agregado. Nuevos detalles:", values.articuloManufacturadoDetalles);
                            ));

                            console.log(values.nuevaImagen)
                            // Crear una nueva imagen con la URL proporcionada
                            const nuevaImagen = await imagenArticuloService.post(url + '/imagenArticulo', {
                                id: 0, // Este ID será ignorado por el backend y se generará uno nuevo
                                eliminado: false,
                                denominacion: values.nuevaImagen, // Utiliza la URL proporcionada
                            });
                            // Agregar la nueva imagen al array de imágenes del artículo manufacturado
                            values.imagenes.push(nuevaImagen);

                            // Guardar el artículo manufacturado con la nueva imagen
                            if (productToEdit) {
                                await productoService.put(
                                    url + 'api/producto',
                                    values.id.toString(),
                                    values
                                );
                                console.log('Se ha actualizado correctamente.');
                            } else {
                                await productoService.post(url + 'api/producto', values);
                                console.log('Se ha agregado correctamente.');
                                console.log(values)
                            }
                            getProducts();
                            handleClose();
                        } catch (error) {
                            console.error('Error al realizar la operación:', error);
                            console.log(JSON.stringify(values))
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
                                    <label htmlFor="preparacion">Preparacion:</label>
                                    <Field
                                        name="preparacion"
                                        type="text"
                                        placeholder="Preparacion"
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
                                        onChange={(e: { target: { value: string; }; }) => {
                                            const categoriaId = parseInt(e.target.value);
                                            setFieldValue('categoria', categoriaId);
                                        }}
                                    >
                                        <option value="">Seleccionar Categoria</option>
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
                                    <label htmlFor="descripcion">Descripción:</label>
                                    <Field
                                        name="descripcion"
                                        type="text"
                                        placeholder="Descripción"
                                        className="form-control mt-2"
                                    />
                                    <ErrorMessage
                                        name="descripcion"
                                        className="error-message"
                                        component="div"
                                    />
                                    <label htmlFor="tiempoEstimadoMinutos">Tiempo estimado en minutos:</label>
                                    <Field
                                        name="tiempoEstimadoMinutos"
                                        type="number"
                                        placeholder="Tiempo estimado en minutos"
                                        className="form-control my-2"
                                    />
                                    <ErrorMessage
                                        name="tiempoEstimadoMinutos"
                                        className="error-message"
                                        component="div"
                                    />
                                    <FieldArray
                                        name="articuloManufacturadoDetalles"
                                        render={arrayHelpers => (
                                            <div>
                                                <label htmlFor="articuloInsumo">Articulo Insumo:</label>
                                                <div className="d-flex">
                                                    <Field
                                                        as="select"
                                                        name="selectedInsumo"
                                                        className="form-control"
                                                        value={selectedInsumo || ''}
                                                        onChange={(e: { target: { value: any; }; }) => setSelectedInsumo(Number(e.target.value))}
                                                    >
                                                        <option value="">Seleccionar Articulo Insumo</option>
                                                        {insumos
                                                            .filter(insumo => !values.articuloManufacturadoDetalles.some(detalle => detalle.id === insumo.id))
                                                            .map(insumo => (
                                                                <option key={insumo.id} value={insumo.id}>
                                                                    {insumo.denominacion}
                                                                </option>
                                                            ))
                                                        }
                                                    </Field>
                                                    <Button
                                                        variant="outline-primary"
                                                        onClick={() => handleAddInsumo(arrayHelpers, values)}
                                                        className="ml-2"
                                                    >
                                                        Agregar
                                                    </Button>
                                                </div>
                                                <div className="mt-2">
                                                    {values.articuloManufacturadoDetalles.map((detalle, index) => (
                                                        <div key={index} className="d-flex justify-content-between align-items-center mt-2">
                                                            <span>{detalle.articuloInsumo.denominacion}</span>
                                                            <Field
                                                                name={`articuloManufacturadoDetalles.${index}.cantidad`}
                                                                type="number"
                                                                placeholder="Cantidad"
                                                                className="form-control ml-2"
                                                                style={{ width: '100px' }}
                                                                value={values.articuloManufacturadoDetalles[index].cantidad}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                    const newCantidad = parseInt(e.target.value);
                                                                    const newDetalles = [...values.articuloManufacturadoDetalles];
                                                                    newDetalles[index].cantidad = newCantidad;
                                                                    setFieldValue('articuloManufacturadoDetalles', newDetalles);
                                                                }}
                                                            />
                                                            <Button
                                                                variant="outline-danger"
                                                                onClick={() => arrayHelpers.remove(index)}
                                                                className="ml-2"
                                                            >
                                                                Eliminar
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    />

                                </Col>
                                <Col>
                                    <label htmlFor="nuevaImagen">Imagen:</label>
                                    <Field
                                        name="nuevaImagen"
                                        type="text"
                                        placeholder="URL de la imagen"
                                        className="form-control my-2"
                                        value={values.nuevaImagen}
                                    />
                                    <ErrorMessage
                                        name="nuevaImagen"
                                        className="error-message"
                                        component="div"
                                    />



                                    <label htmlFor="unidadMedida">Unidad de Medida:</label>
                                    <Field
                                        name="unidadMedida"
                                        as="select"
                                        className="form-control"
                                        onChange={(event: { target: { value: string; }; }) => {
                                            const selectedUnitId = parseInt(event.target.value);
                                            const selectedUnidad = unidadesMedida.find((unidad) => unidad.id === selectedUnitId);

                                            if (selectedUnidad) {
                                                setFieldValue('unidadMedida', selectedUnidad);
                                            } else {
                                                console.error("No se encontró la unidad seleccionada");
                                            }
                                        }}
                                        value={values.unidadMedida ? values.unidadMedida.id : ''}
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
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-end">
                                <Button
                                    variant="outline-success"
                                    type="submit"
                                    className="custom-button"
                                >
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

export default ModalProducto;

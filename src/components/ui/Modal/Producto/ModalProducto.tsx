import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import ArticuloManufacturadoDetalleService from "../../../../services/ArticuloManufacturadoDetalleService.ts";
import ArticuloManufacturadoService from "../../../../services/ArticuloManufacturadoService.ts";
import UnidadMedidaService from "../../../../services/UnidadMedidaService.ts";
import ArticuloInsumoService from "../../../../services/ArticuloInsumoService.ts";
import CategoriaService from "../../../../services/CategoriaService.ts";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux.ts";
import { toggleModal } from "../../../../redux/slices/Modal.ts";
import ArticuloManufacturado from "../../../../types/ArticuloManufacturado.ts";
import UnidadMedida from "../../../../types/UnidadMedida.ts";
import ArticuloInsumoType from "../../../../types/ArticuloInsumoType.ts";
import Categoria from "../../../../types/Categoria.ts";

interface ModalProductProps {
    getProducts: () => void;
    productToEdit?: ArticuloManufacturado;
}

const ModalProducto: React.FC<ModalProductProps> = ({ getProducts, productToEdit }) => {
    const productoService = new ArticuloManufacturadoService();
    const unidadService = new UnidadMedidaService();
    const insumoService = new ArticuloInsumoService();
    const categoriaService = new CategoriaService();
    const articuloManufacturadoDetalles = new ArticuloManufacturadoDetalleService();
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
    const [insumos, setInsumos] = useState<ArticuloInsumoType[]>([]);
    const [categorias, setCategoria] = useState<Categoria[]>([]);
    const [selectedInsumo, setSelectedInsumo] = useState<number | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const url = import.meta.env.VITE_API_URL;

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
        ? productToEdit.articuloManufacturadoDetalles.map((detalle: any) => ({ ...detalle }))
        : [],
    };

    const modal = useAppSelector((state) => state.modal.modal);
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(toggleModal({ modalName: 'modal' }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const fetchArticuloInsumo = async () => {
        try {
            const articulosInsumos = await insumoService.getAll(`${url}articuloInsumo`);
            setInsumos(articulosInsumos);
            console.log(articulosInsumos);
        } catch (error) {
            console.error("Error al obtener los insumos:", error);
        }
    };

    const fetchUnidadesMedida = async () => {
        try {
            const unidades = await unidadService.getAll(`${url}unidadMedida`);
            setUnidadesMedida(unidades);
            console.log(unidades);
        } catch (error) {
            console.error('Error al obtener las unidades de medida:', error);
        }
    };

    const fetchCategorias = async () => {
        try {
            const categorias = await categoriaService.getAll(`${url}categoria`);
            setCategoria(categorias);
            console.log(categorias);
        } catch (error) {
            console.error('Error al obtener las categorias:', error);
        }
    };

    useEffect(() => {
        fetchArticuloInsumo();
        fetchUnidadesMedida();
        fetchCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddInsumo = async (arrayHelpers: any, values: ArticuloManufacturado) => {
        if (selectedInsumo !== null) {
            const insumo = insumos.find(insumo => insumo.id === selectedInsumo);

            if (insumo) {
                try {
                    // Obtener la cantidad ingresada por el usuario
                    const nuevaCantidad = parseInt(prompt('Ingrese la cantidad del insumo') || '0');

                    if (isNaN(nuevaCantidad)) {
                        throw new Error('La cantidad ingresada no es válida.');
                    }

                    // Crear el nuevo detalle mediante el servicio
                    const nuevoDetalle = await articuloManufacturadoDetalles.post(url + 'articuloManufacturadoDetalle', {
                        id: 0, // Este ID será ignorado por el backend y se generará uno nuevo
                        eliminado: false,
                        cantidad: nuevaCantidad, // Utiliza la cantidad ingresada por el usuario
                        articuloInsumo: insumo,
                        articuloManufacturadoId: values.id, // Asume que el ID del artículo manufacturado está disponible
                    });

                    console.log("Nuevo detalle creado:", nuevoDetalle);

                    // Agregar el detalle creado a la lista de detalles
                    arrayHelpers.push(nuevoDetalle);
                    console.log("Detalle agregado. Nuevos detalles:", values.articuloManufacturadoDetalles);

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

                            let productoId: string | null = null;

                            if (productToEdit) {
                                await productoService.put(url + "articuloManufacturado", values.id.toString(), values);
                                console.log('Producto actualizado correctamente.');
                            } else {
                                const response = await productoService.post(url + "articuloManufacturado", values);
                                console.log('Producto agregado correctamente.', values);

                                productoId = response.id.toString();
                            }

                            if (file && productoId) {
                                const response = await productoService.uploadFile(url + 'articuloManufacturado/uploads', file, productoId);
                                console.log('Upload successful:', response);
                            }

                            getProducts();
                            handleClose();
                        } catch (error) {
                            console.error('Error al realizar la operación:', error);
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
                                    <ErrorMessage name="denominacion" className="error-message" component="div" />

                                    <label htmlFor="precioVenta">Precio de Venta:</label>
                                    <Field
                                        name="precioVenta"
                                        type="number"
                                        placeholder="Precio de Venta"
                                        className="form-control my-2"
                                    />
                                    <ErrorMessage name="precioVenta" className="error-message" component="div" />

                                    <label htmlFor="preparacion">Preparacion:</label>
                                    <Field
                                        name="preparacion"
                                        type="text"
                                        placeholder="Preparacion"
                                        className="form-control my-2"
                                    />
                                    <ErrorMessage name="preparacion" className="error-message" component="div" />

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
                                </Col>
                                <Col>
                                    <label htmlFor="tiempoEstimadoMinutos">Tiempo Estimado (en minutos):</label>
                                    <Field
                                        name="tiempoEstimadoMinutos"
                                        type="number"
                                        placeholder="Tiempo Estimado"
                                        className="form-control mt-2"
                                    />
                                    <ErrorMessage name="tiempoEstimadoMinutos" className="error-message" component="div" />

                                    <label htmlFor="descripcion">Descripcion:</label>
                                    <Field
                                        name="descripcion"
                                        type="text"
                                        placeholder="Descripcion"
                                        className="form-control my-2"
                                    />
                                    <ErrorMessage name="descripcion" className="error-message" component="div" />

                                    <label htmlFor="unidadMedida">Unidad de Medida:</label>
                                    <Field
                                        name="unidadMedida.id"
                                        as="select"
                                        className="form-control"
                                        onChange={(e: { target: { value: string; }; }) => {
                                            const unidadMedidaId = parseInt(e.target.value);
                                            const unidad = unidadesMedida.find(
                                                (unidad) => unidad.id === unidadMedidaId
                                            );
                                            setFieldValue('unidadMedida', unidad);
                                        }}
                                    >
                                        <option value="">Seleccionar Unidad de Medida</option>
                                        {unidadesMedida.map((unidad) => (
                                            <option key={unidad.id} value={unidad.id}>
                                                {unidad.denominacion}
                                            </option>
                                        ))}
                                    </Field>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <label htmlFor="nuevaImagen">Seleccionar imagen</label>
                                    <input
                                        name="imagenes"
                                        type="file"
                                        className="form-control"
                                        onChange={handleFileChange}
                                        multiple
                                    />
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <FieldArray name="articuloManufacturadoDetalles">
                                    {(arrayHelpers) => (
                                        <div>
                                            <h3>Insumos</h3>
                                            <Row>
                                                <Col>
                                                    <select
                                                        className="form-select"
                                                        value={selectedInsumo || ''}
                                                        onChange={(e) => {
                                                            setSelectedInsumo(parseInt(e.target.value));
                                                        }}
                                                    >
                                                        <option value="">Seleccionar Insumo</option>
                                                        {insumos.map((insumo) => (
                                                            <option key={insumo.id} value={insumo.id}>
                                                                {insumo.denominacion}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </Col>
                                                <Col>
                                                    <Button
                                                        onClick={() => handleAddInsumo(arrayHelpers, values)}
                                                    >
                                                        Agregar Insumo
                                                    </Button>
                                                </Col>
                                            </Row>
                                            {values.articuloManufacturadoDetalles.map((detalle, index) => (
                                                <Row key={index}>
                                                    <Col>{detalle.articuloInsumo.denominacion}</Col>
                                                    <Col>
                                                        <Field
                                                            name={`articuloManufacturadoDetalles[${index}].cantidad`}
                                                            type="number"
                                                            placeholder="Cantidad"
                                                            className="form-control"
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => arrayHelpers.remove(index)}
                                                        >
                                                            Eliminar
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            ))}
                                        </div>
                                    )}
                                </FieldArray>
                            </Row>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Cancelar
                                </Button>
                                <Button variant="primary" type="submit">
                                    Guardar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default ModalProducto;

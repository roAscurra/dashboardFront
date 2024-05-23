import React, { ChangeEvent, useEffect, useState } from 'react';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
// import ArticuloManufacturadoDetalleService from "../../../../services/ArticuloManufacturadoDetalleService.ts";
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
import ModalInsumo from './ModalInsumo.tsx';
import ArticuloManufacturadoDetalle from '../../../../types/ArticuloManufacturadoDetalle.ts';

interface ModalProductProps {
    getProducts: () => void;
    productToEdit?: ArticuloManufacturado;
}

const ModalProducto: React.FC<ModalProductProps> = ({ getProducts, productToEdit }) => {
    const productoService = new ArticuloManufacturadoService();
    const unidadService = new UnidadMedidaService();
    const insumoService = new ArticuloInsumoService();
    const categoriaService = new CategoriaService();
    // const articuloManufacturadoDetalles = new ArticuloManufacturadoDetalleService();
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
    const [insumos, setInsumos] = useState<ArticuloInsumoType[]>([]);
    const [categorias, setCategoria] = useState<Categoria[]>([]);
    // const [selectedInsumo, setSelectedInsumo] = useState<number | null>(null);
    const [showInsumoModal, setShowInsumoModal] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [articuloManufacturadoDetalles, setArticuloManufacturadoDetalles] = useState<ArticuloManufacturadoDetalle[]>(productToEdit?.articuloManufacturadoDetalles || []);
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
        categoria: productToEdit && productToEdit.categoria ? productToEdit.categoria :
            { id: 0, eliminado: false, denominacion: '', esInsumo: false, subCategorias: [], sucursales: [] }
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

    const handleAddInsumo = (detalles: ArticuloManufacturadoDetalle[]) => {
        console.log("Detalles a guardar:", detalles);
        setArticuloManufacturadoDetalles(detalles);
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
                    {({ setFieldValue }) => (
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

                                    <label htmlFor="preparacion">Preparación:</label>
                                    <Field
                                        name="preparacion"
                                        type="text"
                                        placeholder="Preparación"
                                        className="form-control my-2"
                                    />
                                    <ErrorMessage name="preparacion" className="error-message" component="div" />

                                    <label htmlFor="categoria">Categoría:</label>
                                    <Field
                                        name="categoria"
                                        as="select"
                                        className="form-control"
                                        onChange={(e: { target: { value: string; }; }) => {
                                            const categoriaId = parseInt(e.target.value);
                                            setFieldValue('categoria', categoriaId);
                                        }}
                                    >
                                        <option value="">Seleccionar Categoría</option>
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

                                    <label htmlFor="descripcion">Descripción:</label>
                                    <Field
                                        name="descripcion"
                                        type="text"
                                        placeholder="Descripción"
                                        className="form-control my-2"
                                    />
                                    <ErrorMessage name="descripcion" className="error-message" component="div" />

                                    <label htmlFor="unidadMedida">Unidad de Medida:</label>
                                    <Field
                                        name="unidadMedida.denominacion"
                                        as="select"
                                        className="form-control"
                                        onChange={(e: { target: { value: string; }; }) => {
                                            const unidad = unidadesMedida.find((u) => u.denominacion === e.target.value);
                                            setFieldValue('unidadMedida', unidad);
                                        }}
                                    >
                                        <option value="">Seleccionar Unidad de Medida</option>
                                        {unidadesMedida.map((unidad) => (
                                            <option key={unidad.id} value={unidad.denominacion}>
                                                {unidad.denominacion}
                                            </option>
                                        ))}
                                    </Field>

                                    <label htmlFor="imagen">Imagen:</label>
                                    <input
                                        name="imagen"
                                        type="file"
                                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                            handleFileChange(event);
                                        }}
                                        className="form-control my-2"
                                    />
                                    <ErrorMessage name="imagen" className="error-message" component="div" />
                                </Col>
                            </Row>
                            <Row>
                                <Col className="d-flex justify-content-between align-items-center my-2">
                                    <label htmlFor="articuloManufacturadoDetalle">Insumos:</label>
                                    <Button type="button" variant="primary" size="sm" onClick={() => setShowInsumoModal(true)}>Agregar Insumo</Button>
                                </Col>
                                <Col>
                                    <ul className="list-group">
                                        {articuloManufacturadoDetalles.map((detalle, index) => (
                                            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                <span>{detalle.articuloInsumo.denominacion}</span>
                                                <span>Cantidad: {detalle.cantidad}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Col>
                            </Row>
                            <ModalInsumo
                                insumos={insumos}
                                show={showInsumoModal}
                                handleClose={() => setShowInsumoModal(false)}
                                handleAddInsumo={handleAddInsumo}
                                initialDetalles={articuloManufacturadoDetalles}
                            />
                            <Button type="submit" className="btn btn-primary mt-3">
                                {productToEdit ? 'Guardar Cambios' : 'Agregar Producto'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default ModalProducto;

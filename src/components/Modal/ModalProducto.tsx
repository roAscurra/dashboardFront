import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { toggleModal } from "../../redux/slices/Modal";
import ArticuloManufacturado from "../../types/ArticuloManufacturado";
import ProductoService from "../../services/ProductoService";

interface ModalProductProps {
    getProducts: () => void;
    productToEdit?: ArticuloManufacturado;
}

const ModalProducto: React.FC<ModalProductProps> = ({ getProducts, productToEdit }) => {

    const productoService = new ProductoService();
    const url = import.meta.env.VITE_API_URL;


    const initialValues: ArticuloManufacturado = productToEdit
        ? productToEdit
        : {
            id: 0,
            denominacion: "",
            precioVenta: 0,
            imagenes: [],
            unidadMedida: {
                id: 0,
                denominacion: "",
            },
            descripcion: "",
            tiempoEstimadoMinutos: 0,
            preparacion: "",
            articuloManufacturadoDetalles: []
        };

    const modal = useAppSelector((state) => state.modal.modal);
    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(toggleModal({ modalName: "modal" }));
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
                <Modal.Title>{productToEdit ? "Editar Producto" : "Agregar Producto"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    validationSchema={Yup.object({
                        denominacion: Yup.string().required("Campo requerido"),
                        precioVenta: Yup.number().required("Campo requerido"),
                        descripcion: Yup.string().required("Campo requerido"),
                        tiempoEstimadoMinutos: Yup.number().required("Campo requerido"),
                    })}
                    initialValues={initialValues}
                    onSubmit={async (values: ArticuloManufacturado) => {
                        try {
                            if (productToEdit) {
                                await productoService.put(url + "articulosManufacturados", values.id.toString(), values);
                                console.log("Se ha actualizado correctamente.");
                            } else {
                                await productoService.post(url + "articulosManufacturados", values);
                                console.log("Se ha agregado correctamente.");
                            }
                            getProducts();
                            handleClose();
                        } catch (error) {
                            console.error("Error al realizar la operación:", error);
                        }
                    }}
                >
                    {() => (
                        <>
                            <Form autoComplete="off">
                                <div className="mb-4">
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
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="descripcion">Descripcion:</label>
                                    <Field
                                        name="descripcion"
                                        type="text"
                                        placeholder="Descripcion"
                                        className="form-control mt-2"
                                    />
                                    <ErrorMessage
                                        name="descripcion"
                                        className="error-message"
                                        component="div"
                                    />
                                </div>
                                <label htmlFor="imagenes">Imagen:</label>
                                <Field
                                    name="imagenes[0].url"
                                    type="text"
                                    placeholder="URL de la imagen"
                                    className="form-control my-2"
                                />
                                <ErrorMessage name="imagenes[0].url" className="error-message" component="div" />

                                <label htmlFor="precioVenta">Precio de Venta:</label>
                                <Field
                                    name="precioVenta"
                                    type="number"
                                    placeholder="Precio de Venta"
                                    className="form-control my-2"
                                />
                                <ErrorMessage name="precioVenta" className="error-message" component="div" />

                                <label htmlFor="tiempoEstimadoMinutos">Tiempo estimado en minutos:</label>
                                <Field
                                    name="tiempoEstimadoMinutos"
                                    type="number"
                                    placeholder="Tiempo estimado en minutos"
                                    className="form-control my-2"
                                />
                                <ErrorMessage name="precioVenta" className="error-message" component="div" />

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
                        </>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
}

export default ModalProducto;

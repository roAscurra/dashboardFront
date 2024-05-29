import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Categoria from '../../../../types/Categoria';
import CategoriaService from '../../../../services/CategoriaService';
import { useAppDispatch } from '../../../../hooks/redux';
import { toggleModal } from '../../../../redux/slices/Modal';
import { useParams } from 'react-router-dom';
import SucursalService from '../../../../services/SucursalService';
import Sucursal from '../../../../types/Sucursal';

interface ModalCategoriaProps {
    open: boolean;
    onClose: () => void;
    getCategories: () => void;
    categoryToEdit?: Categoria | null;
}

const ModalCategoria: React.FC<ModalCategoriaProps> = ({ open, onClose, getCategories, categoryToEdit }) => {
    const categoriaService = new CategoriaService();
    const url = import.meta.env.VITE_API_URL;
    const { sucursalId } = useParams();
    const sucursalService = new SucursalService();
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);

    const fetchSucursalData = async () => {
        try {
            if (sucursalId) {
                const sucursalSeleccionada = await sucursalService.get(url + 'sucursal', sucursalId);
                const empresaId = sucursalSeleccionada.empresa.id;
                const todasSucursales = await sucursalService.getAll(url + 'sucursal');
                const sucursalesEmpresa = todasSucursales.filter(sucursal => sucursal.empresa.id === empresaId);
                setSucursales(sucursalesEmpresa);
            }
        } catch (error) {
            console.error("Error al obtener los datos de las sucursales:", error);
        }
    };

    useEffect(() => {
        fetchSucursalData();
    }, []);

    const initialValues: Categoria = {
        id: categoryToEdit ? categoryToEdit.id : 0,
        eliminado: categoryToEdit ? categoryToEdit.eliminado : false,
        denominacion: categoryToEdit?.denominacion || '',
        subCategorias: categoryToEdit?.subCategorias || [],
        sucursales: categoryToEdit
            ? categoryToEdit.sucursales.map((sucursal: any) => ({
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
        esInsumo: categoryToEdit ? categoryToEdit.esInsumo : false
    };


    const dispatchCategory = useAppDispatch();

    const handleClose = () => {
        dispatchCategory(toggleModal({ modalName: 'modal' }));
        onClose();
    };

    return (
        <Modal show={open} onHide={handleClose} size="lg" backdrop="static" keyboard={false} centered>
            <Modal.Header closeButton>
                <Modal.Title>{categoryToEdit ? 'Editar Categoría' : 'Agregar Categoría'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    validationSchema={Yup.object({
                        denominacion: Yup.string().required('Campo requerido'),
                        // subCategorias: Yup.array().of(
                        //     Yup.object({
                        //         denominacion: Yup.string().required('Campo requerido'),
                        //     })
                        // ),
                        // sucursales: Yup.array().of(
                        //     Yup.object({
                        //         id: Yup.number().required(),
                        //         nombre: Yup.string().required(),
                        //     })
                        // )
                    })}
                    initialValues={initialValues}
                    onSubmit={async (values) => {
                        try {
                            if (categoryToEdit) {
                                await categoriaService.put(url + 'categoria', values.id.toString(), values);
                                console.log('Categoría actualizada correctamente.', values);
                            } else {

                                const sucursalesSeleccionadas = values.sucursales;
                                console.log(
                                    "Sucursales seleccionadas:",
                                    sucursalesSeleccionadas
                                );

                                // Ahora, en lugar de agregar una sola sucursal (como la de ID 1),
                                // añadimos todas las sucursales seleccionadas al array de sucursales en values
                                values.sucursales = sucursalesSeleccionadas;

                                console.log("Valores actualizados:", values);

                                await categoriaService.post(url + 'categoria', values);
                                console.log('Categoría agregada correctamente.', values);

                                // const respuesta = await sucursalService.get(url + 'sucursal', '1');
                                // console.log("Respuesta: ", respuesta);

                            }
                            getCategories();
                            handleClose();
                        } catch (error) {
                            console.error('Error al realizar la operación:', error);
                        }
                    }}
                >
                    {({ values, setFieldValue }) => (
                        <Form autoComplete="off">
                            <div className="mb-4">
                                <label htmlFor="denominacion">Nombre:</label>
                                <Field name="denominacion" type="text" placeholder="Nombre de la Categoría" className="form-control mt-2" />
                                <ErrorMessage name="denominacion" className="error-message" component="div" />
                            </div>
                            <FieldArray name="subCategorias">
                                {({ push, remove }) => (
                                    <div className="mb-4">
                                        <label>Subcategorías:</label>
                                        {values.subCategorias.map((subCategoria, index) => (
                                            <div key={index} className="d-flex mb-2">
                                                <Field
                                                    name={`subCategorias.${index}.denominacion`}
                                                    type="text"
                                                    placeholder="Nombre de la Subcategoría"
                                                    className="form-control mt-2"
                                                />
                                                <Button
                                                    variant="outline-danger"
                                                    onClick={() => remove(index)}
                                                    className="ml-2 mt-2"
                                                >
                                                    Eliminar
                                                </Button>
                                                <ErrorMessage name={`subCategorias.${index}.denominacion`} component="div" className="error-message" />
                                            </div>
                                        ))}
                                        <Button
                                            variant="outline-primary"
                                            onClick={() => push({ denominacion: '', eliminado: false, esInsumo: false, subCategorias: [], sucursales: [] })}
                                            className="mt-2"
                                        >
                                            Agregar Subcategoría
                                        </Button>
                                    </div>
                                )}
                            </FieldArray>
                            <div className="mb-4">
                                <label>Sucursales:</label>
                                {sucursales.map((sucursal) => (
                                    <div key={sucursal.id} className="d-flex mb-2">
                                        <Field
                                            name="sucursales"
                                            type="checkbox"
                                            value={sucursal.id}
                                            checked={values.sucursales.some(s => s.id === sucursal.id)}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                if (e.target.checked) {
                                                    setFieldValue("sucursales", [...values.sucursales, sucursal]);
                                                } else {
                                                    setFieldValue("sucursales", values.sucursales.filter(s => s.id !== sucursal.id));
                                                }
                                            }}
                                            className="form-check-input mt-2"
                                        />
                                        <label className="form-check-label ml-2 mt-2">{sucursal.nombre}</label>
                                    </div>
                                ))}
                            </div>

                            <div className="d-flex justify-content-end">
                                <Button variant="secondary" onClick={handleClose} className="mr-2">
                                    Cancelar
                                </Button>
                                <Button variant="primary" type="submit">
                                    Guardar
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default ModalCategoria;
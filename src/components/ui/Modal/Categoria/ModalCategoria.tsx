import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Categoria from '../../../../types/Categoria';
import CategoriaService from '../../../../services/CategoriaService';
import { useAppDispatch } from '../../../../hooks/redux';
import { toggleModal } from '../../../../redux/slices/Modal';

interface ModalCategoriaProps {
    open: boolean;
    onClose: () => void;
    getCategories: () => void;
    categoryToEdit?: Categoria | null;
}

const ModalCategoria: React.FC<ModalCategoriaProps> = ({ open, onClose, getCategories, categoryToEdit }) => {
    const categoriaService = new CategoriaService();
    const url = import.meta.env.VITE_API_URL;

    const initialValues: Categoria = categoryToEdit
        ? categoryToEdit
        : {
            id: 0,
            denominacion: '',
            articulos: [],
            subCategorias: [],
        };

    const dispatch = useAppDispatch();

    const handleClose = () => {
        dispatch(toggleModal({ modalName: 'modal' }));
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
                        subCategorias: Yup.array().of(
                            Yup.object({
                                denominacion: Yup.string().required('Campo requerido'),
                            })
                        )
                    })}
                    initialValues={initialValues}
                    onSubmit={async (values: Categoria) => {
                        try {
                            if (categoryToEdit) {
                                await categoriaService.put(url + 'categoria', values.id.toString(), values);
                                console.log('Categoría actualizada correctamente.');
                            } else {
                                await categoriaService.post(url + 'categoria', values);
                                console.log('Categoría agregada correctamente.');
                            }
                            getCategories();
                            handleClose();
                        } catch (error) {
                            console.error('Error al realizar la operación:', error);
                        }
                    }}
                >
                    {({ values }) => (
                        <>
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
                                                onClick={() => push({ denominacion: '' })}
                                                className="mt-2"
                                            >
                                                Agregar Subcategoría
                                            </Button>
                                        </div>
                                    )}
                                </FieldArray>
                                <div className="d-flex justify-content-end">
                                    <Button variant="outline-success" type="submit" className="custom-button">
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
};

export default ModalCategoria;

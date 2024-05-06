import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../../hooks/redux';
import { toggleModal } from '../../redux/slices/Modal';
import Categoria from '../../types/Categoria';
import CategoriaService from '../../services/CategoriaService';

interface ModalCategoriaProps {
    open: boolean; // Agregar propiedades open y onClose
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
        onClose(); // Llamar a onClose al cerrar el modal
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
                        // add validation for other fields
                    })}
                    initialValues={initialValues}
                    onSubmit={async (values: Categoria) => {
                        try {
                            if (categoryToEdit) {
                                await categoriaService.put(url + 'categorias', values.id.toString(), values);
                                console.log('Categoría actualizada correctamente.');
                            } else {
                                await categoriaService.post(url + 'categorias', values);
                                console.log('Categoría agregada correctamente.');
                            }
                            getCategories();
                            handleClose();
                        } catch (error) {
                            console.error('Error al realizar la operación:', error);
                        }
                    }}
                >
                    {() => (
                        <>
                            <Form autoComplete="off">
                                <div className="mb-4">
                                    <label htmlFor="denominacion">Nombre:</label>
                                    <Field name="denominacion" type="text" placeholder="Nombre de la Categoría" className="form-control mt-2" />
                                    <ErrorMessage name="denominacion" className="error-message" component="div" />
                                </div>
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

import React, { useEffect, useState } from "react";
import { Button, Modal, Row } from "react-bootstrap";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import Categoria from "../../../../types/Categoria";
import CategoriaService from "../../../../services/CategoriaService";
import { useAppDispatch } from "../../../../hooks/redux";
import { toggleModal } from "../../../../redux/slices/Modal";
import { useParams } from "react-router-dom";
import SucursalService from "../../../../services/SucursalService";
import Sucursal from "../../../../types/Sucursal";
import {useAuth0} from "@auth0/auth0-react";

interface ModalCategoriaProps {
  open: boolean;
  onClose: () => void;
  getCategories: () => void;
  categoryToEdit?: Categoria | null;
}

const ModalCategoria: React.FC<ModalCategoriaProps> = ({
  open,
  onClose,
  getCategories,
  categoryToEdit,
}) => {
  const categoriaService = new CategoriaService();
  const url = import.meta.env.VITE_API_URL;
  const { getAccessTokenSilently } = useAuth0();
  const { sucursalId } = useParams();
  const sucursalService = new SucursalService();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);

  const fetchSucursalData = async () => {
    try {
      if (sucursalId) {
        const sucursalSeleccionada = await sucursalService.get(
          url + "sucursal",
          sucursalId, await getAccessTokenSilently({})
        );
        const empresaId = sucursalSeleccionada.empresa.id;
        const todasSucursales = await sucursalService.getAll(url + "sucursal", await getAccessTokenSilently({}));
        const sucursalesEmpresa = todasSucursales.filter(
          (sucursal) => sucursal.empresa.id === empresaId
        );
        setSucursales(sucursalesEmpresa);
      }
    } catch (error) {
      console.error("Error al obtener los datos de las sucursales:", error);
    }
  };

  useEffect(() => {
    fetchSucursalData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialValues: Categoria = {
    id: categoryToEdit ? categoryToEdit.id : 0,
    eliminado: categoryToEdit ? categoryToEdit.eliminado : false,
    denominacion: categoryToEdit?.denominacion || "",
    subCategorias: categoryToEdit
      ? categoryToEdit.subCategorias.map((subCategoria: any) => ({
          id: subCategoria.id,
          eliminado: subCategoria.eliminado,
          denominacion: subCategoria.denominacion,
          esInsumo: subCategoria.esInsumo,
        }))
      : [],
    sucursales: categoryToEdit
      ? categoryToEdit.sucursales.map((sucursal: any) => ({
          id: sucursal.id,
          nombre: sucursal.nombre,
          horarioApertura: sucursal.horarioApertura,
          horarioCierre: sucursal.horarioCierre,
          esCasaMatriz: sucursal.esCasaMatriz,
          imagenes: sucursal.imagenes,
          domicilio: sucursal.domicilio,
          empresa: sucursal.empresa,
          eliminado: sucursal.eliminado || false,
        }))
      : [],
    esInsumo: categoryToEdit ? categoryToEdit.esInsumo : false,
  };

  const dispatchCategory = useAppDispatch();

  const handleClose = () => {
    dispatchCategory(toggleModal({ modalName: "modal" }));
    onClose();
  };

  return (
    <Modal
      show={open}
      onHide={handleClose}
      size="lg"
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {categoryToEdit ? "Editar Categoría" : "Agregar Categoría"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
            sucursales: Yup.array()
            .of(Yup.object().shape({
              id: Yup.number().required(),
              nombre: Yup.string().required(),
            }))
            .min(1, 'Debe seleccionar al menos una sucursal'),
          })}
          initialValues={initialValues}
          onSubmit={async (values) => {
            try {
              if (categoryToEdit) {
                await categoriaService.put(
                  url + "categoria",
                  values.id.toString(),
                  values, await getAccessTokenSilently({})
                );
                console.log("Categoría actualizada correctamente.", values);
              } else {
                const sucursalesSeleccionadas = values.sucursales;
                // Ahora, en lugar de agregar una sola sucursal (como la de ID 1),
                // añadimos todas las sucursales seleccionadas al array de sucursales en values
                values.sucursales = sucursalesSeleccionadas;

                await categoriaService.post(url + "categoria", values, await getAccessTokenSilently({}));
                console.log("Categoría agregada correctamente.", values);

              }
              getCategories();
              handleClose();
            } catch (error) {
              console.error("Error al realizar la operación:", error);
            }
          }}
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form autoComplete="off">
              <Row className="mb-4">
                <div className="col-md-10 d-flex flex-column justify-content-center">
                  <label htmlFor="denominacion">Nombre:</label>
                  <Field
                    name="denominacion"
                    type="text"
                    placeholder="Nombre de la Categoría"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="denominacion"
                    className="error-message text-danger"
                    component="div"
                  />
                </div>
                <div className="col-md-2 d-flex flex-column justify-content-center">
                  <label htmlFor="esInsumo">Es insumo:</label>
                  <Field
                    name="esInsumo"
                    as="select"
                    className="form-control mt-2"
                  >
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </Field>
                </div>
              </Row>
              {categoryToEdit &&
                categoryToEdit.subCategorias &&
                categoryToEdit.subCategorias.length > 0 && (
                  <FieldArray name="subCategorias">
                    {({ remove }) => (
                      <div className="mb-4">
                        <label>Subcategorías:</label>
                        {values.subCategorias.map((_subCategoria, index) => (
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
                            <ErrorMessage
                              name={`subCategorias.${index}.denominacion`}
                              component="div"
                              className="error-message text-danger"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>
                )}

              <div className="mb-4">
                <label>Sucursales:</label>
                {sucursales.map((sucursal) => (
                  <div key={sucursal.id} className="d-flex mb-2">
                    <Field
                      name="sucursales"
                      type="checkbox"
                      value={sucursal.id}
                      checked={values.sucursales.some(
                        (s) => s.id === sucursal.id
                      )}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
                      className="form-check-input mt-2"
                    />
                    <label className="form-check-label ml-2 mt-2">
                      {sucursal.nombre}
                    </label>
                  </div>
                ))}
                <ErrorMessage
                    name="sucursales"
                    className="error-message text-danger"
                    component="div"
                  />
              </div>

              <div className="d-flex justify-content-end">
              <Button
                  variant="secondary"
                  onClick={handleClose}
                  className="me-2"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Guardando..." : "Guardar"}
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

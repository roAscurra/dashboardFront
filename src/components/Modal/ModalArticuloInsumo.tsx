import { Button, Modal } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import ArticuloInsumoService from "../../services/ArticuloInsumoService";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import IUnidadMedida from "../../types/UnidadMedida";
import { toggleModal } from "../../redux/slices/Modal";
import ArticuloInsumo from "../../types/ArticuloInsumoType";

interface ModalArticuloInsumoProps {
  getArticulosInsumo: () => void;
  articuloToEdit?: ArticuloInsumo;
}

const ModalArticuloInsumo: React.FC<ModalArticuloInsumoProps> = ({ getArticulosInsumo, articuloToEdit }) => {
  const articuloInsumoService = new ArticuloInsumoService();
  const url = import.meta.env.VITE_API_URL;
  // const today = new Date();

  const initialValues: ArticuloInsumo = articuloToEdit
    ? articuloToEdit
    : {
        id: 0,
        denominacion: "",
        precioVenta: 0,
        imagenes: [],
        unidadMedida: { id: 0, denominacion: "", nombre: "" } as IUnidadMedida,
        precioCompra: 0,
        stockActual: 0,
        stockMaximo: 0,
        esParaElaborar: false
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
        <Modal.Title>{articuloToEdit ? "Editar Artículo de Insumo" : "Agregar Artículo de Insumo"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={Yup.object({
            denominacion: Yup.string().required("Campo requerido"),
            precioVenta: Yup.number().required("Campo requerido"),
            // Añade validaciones para otros campos según sea necesario
          })}
          initialValues={initialValues}
          onSubmit={async (values: ArticuloInsumo) => {
            try {
              if (articuloToEdit) {
                // Lógica para editar el artículo de insumo existente
                await articuloInsumoService.put(url + "articulos-insumo", values.id.toString(), values);
                console.log("Se ha actualizado correctamente.");
              } else {
                // Lógica para agregar un nuevo artículo de insumo
                await articuloInsumoService.post(url + "articulos-insumo", values);
                console.log("Se ha agregado correctamente.");
              }
              getArticulosInsumo(); 
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
                  <label htmlFor="denominacion">Denominación:</label>
                  <Field
                    name="denominacion"
                    type="text"
                    placeholder="Denominación"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="denominacion"
                    className="error-message"
                    component="div"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="precioVenta">Precio de Venta:</label>
                  <Field
                    name="precioVenta"
                    type="number"
                    placeholder="Precio de Venta"
                    className="form-control mt-2"
                  />
                  <ErrorMessage
                    name="precioVenta"
                    className="error-message"
                    component="div"
                  />
                </div>
                {/* Añade campos adicionales según los atributos de tu modelo de ArticuloInsumo */}
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
};

export default ModalArticuloInsumo;

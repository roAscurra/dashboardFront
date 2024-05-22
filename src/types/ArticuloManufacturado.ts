import ArticuloManufacturadoDetalle from "./ArticuloManufacturadoDetalle";
import DataModel from "./DataModel";
import ImagenArticulo from "./ImagenArticulo";
import UnidadMedida from "./UnidadMedida";

interface IArticuloManufacturado extends DataModel<IArticuloManufacturado> {
    denominacion: string;
    precioVenta: number;
    imagenes: ImagenArticulo[];
    unidadMedida: UnidadMedida;
    descripcion: string;
    tiempoEstimadoMinutos: number;
    preparacion: string;
    articuloManufacturadoDetalles: ArticuloManufacturadoDetalle[];
}

export default IArticuloManufacturado;
import ArticuloManufacturadoDetalle from "./ArticuloManufacturadoDetalle";
import DataModel from "./DataModel";
import Imagen from "./Imagen";
import UnidadMedida from "./UnidadMedida";

interface IArticuloManufacturado extends DataModel<IArticuloManufacturado> {
    denominacion: string;
    precioVenta: number;
    imagenes: Imagen[];
    unidadMedida: UnidadMedida;
    descripcion: string;
    tiempoEstimadoMinutos: number;
    preparacion: string;
    articuloManufacturadoDetalles: ArticuloManufacturadoDetalle[];
}

export default IArticuloManufacturado;
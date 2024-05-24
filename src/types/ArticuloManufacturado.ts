import ArticuloManufacturadoDetalle from "./ArticuloManufacturadoDetalle";
// import Categoria from "./Categoria";
import DataModel from "./DataModel";
import Imagen from "./Imagen";
import UnidadMedida from "./UnidadMedida";
import CategoriaShorDto from "./dto/CategoriaShorDto";

interface IArticuloManufacturado extends DataModel<IArticuloManufacturado> {
    denominacion: string;
    precioVenta: number;
    imagenes: Imagen[];
    unidadMedida: UnidadMedida;
    descripcion: string;
    tiempoEstimadoMinutos: number;
    preparacion: string;
    articuloManufacturadoDetalles: ArticuloManufacturadoDetalle[];
    categoria: CategoriaShorDto;
}

export default IArticuloManufacturado;
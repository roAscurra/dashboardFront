import ArticuloManufacturadoDetalle from "./ArticuloManufacturadoDetalle";
import Categoria from "./Categoria";
// import Categoria from "./Categoria";
import DataModel from "./DataModel";
import Imagen from "./Imagen";
import UnidadMedida from "./UnidadMedida";
import SucursalDto from "./dto/SucursalDto";
// import CategoriaShorDto from "./dto/CategoriaShorDto";

interface IArticuloManufacturado extends DataModel<IArticuloManufacturado> {
    denominacion: string;
    precioVenta: number;
    imagenes: Imagen[];
    unidadMedida: UnidadMedida;
    descripcion: string;
    tiempoEstimadoMinutos: number;
    preparacion: string;
    articuloManufacturadoDetalles: ArticuloManufacturadoDetalle[];
    categoria: Categoria;
    sucursal: SucursalDto;
}

export default IArticuloManufacturado;
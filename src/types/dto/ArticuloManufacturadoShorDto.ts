import DataModel from "../DataModel";
import IUnidadMedida from "../UnidadMedida";
import CategoriaShorDto from "./CategoriaShorDto";
import SucursalDto from "./SucursalDto";


interface ArticuloManufacturadoShorDto extends  DataModel<ArticuloManufacturadoShorDto> {
    denominacion: string;
    precioVenta: number;
    descripcion: string;
    tiempoEstimadoMinutos: number;
    preparacion: string;
    unidadMedida: IUnidadMedida;
    categoria: CategoriaShorDto;
    sucursal: SucursalDto;
}

export default ArticuloManufacturadoShorDto;
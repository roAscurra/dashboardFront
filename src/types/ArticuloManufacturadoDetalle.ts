// import ArticuloInsumo from "./ArticuloInsumoType";
import DataModel from "./DataModel";
import ArticuloInsumoShortDto from "./dto/ArticuloInsumoShortDto";

interface IArticuloManufacturadoDetalle extends  DataModel<IArticuloManufacturadoDetalle> {
    eliminado: boolean,
    cantidad: number;
    articuloInsumo: ArticuloInsumoShortDto;
}

export default IArticuloManufacturadoDetalle;
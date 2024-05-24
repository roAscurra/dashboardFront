import DataModel from "../DataModel";
import ArticuloInsumoShortDto from "./ArticuloInsumoShortDto";


interface IArticuloManufacturadoDetalle extends  DataModel<IArticuloManufacturadoDetalle> {
    id: number;
    cantidad: number;
    articuloInsumo: ArticuloInsumoShortDto;
}

export default IArticuloManufacturadoDetalle;
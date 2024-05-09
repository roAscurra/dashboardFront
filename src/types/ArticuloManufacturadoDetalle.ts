import ArticuloInsumo from "./ArticuloInsumoType";
import DataModel from "./DataModel";

interface IArticuloManufacturadoDetalle extends  DataModel<IArticuloManufacturadoDetalle> {
    cantidad: number;
    articuloInsumo: ArticuloInsumo;
}

export default IArticuloManufacturadoDetalle;